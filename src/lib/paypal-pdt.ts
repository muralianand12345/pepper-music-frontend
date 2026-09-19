import { createRateLimiter } from '@/lib/rate-limit';

/**
 * Payment Data Transfer — how the PayPal return page learns who just paid and
 * how much.
 *
 * PayPal appends the transaction ID (`tx`) to the auto-return URL. Anyone can
 * type a URL, so the page never believes what the query string says; it posts
 * `tx` back to PayPal with the account's PDT identity token, and PayPal only
 * answers for payments made *to this account*. A made-up or someone else's ID
 * comes back `FAIL`.
 *
 * PayPal is not ours to hammer, and a page view is not a reason to call it, so
 * every lookup is guarded the way calls to the bot are: a hard timeout, a
 * bounded cache (a payer refreshing the page costs nothing), and per-client and
 * global budgets. Anything that goes wrong resolves to `null`, and the page
 * falls back to thanking the payer without naming them.
 *
 * Needs `PAYPAL_PDT_TOKEN` — PayPal → Account Settings → Website payments →
 * Website preferences → Payment data transfer. Without it, lookups are off.
 * Never import this from a client component.
 */

const PDT_ENDPOINT = 'https://www.paypal.com/cgi-bin/webscr';
const TIMEOUT_MS = 5_000;

export interface Donation {
	/** First name only; the payer's surname and email are never surfaced. */
	firstName: string | null;
	/** Decimal string exactly as PayPal reports it, e.g. `"5.00"`. */
	amount: string;
	/** ISO 4217 code, e.g. `"NZD"`. */
	currency: string;
	pending: boolean;
}

// A payer loads this page once or twice; anything past that is not a payer.
const perClient = createRateLimiter({ windowMs: 10 * 60_000, max: 10 });
// Caps the whole site, so spoofed `x-forwarded-for` values cannot fan out.
const siteWide = createRateLimiter({ windowMs: 60_000, max: 30 });

const SUCCESS_TTL_MS = 60 * 60_000;
const FAILURE_TTL_MS = 5 * 60_000;
// Transaction IDs are unbounded, unlike the bot's endpoints, so the cache is
// capped and evicts oldest-first (Map iteration is insertion order).
const MAX_ENTRIES = 500;

const cache = new Map<string, { value: Donation | null; expires: number }>();
const inflight = new Map<string, Promise<Donation | null>>();

const remember = (tx: string, value: Donation | null) => {
	cache.delete(tx);
	cache.set(tx, {
		value,
		expires: Date.now() + (value ? SUCCESS_TTL_MS : FAILURE_TTL_MS),
	});
	if (cache.size > MAX_ENTRIES) {
		const oldest = cache.keys().next().value;
		if (oldest !== undefined) cache.delete(oldest);
	}
};

/**
 * Percent-decodes to bytes, then reads them in the charset PayPal says it used.
 * PDT defaults to windows-1252 rather than UTF-8, and decoding it as UTF-8
 * would turn a name like "René" into "Ren�".
 */
const decode = (value: string, charset: string): string => {
	const raw = value.replace(/\+/g, ' ');
	const bytes: number[] = [];
	for (let i = 0; i < raw.length; i++) {
		const hex = raw.slice(i + 1, i + 3);
		if (raw[i] === '%' && /^[0-9a-f]{2}$/i.test(hex)) {
			bytes.push(Number.parseInt(hex, 16));
			i += 2;
		} else {
			bytes.push(raw.charCodeAt(i) & 0xff);
		}
	}
	try {
		return new TextDecoder(charset).decode(Uint8Array.from(bytes));
	} catch {
		// An unknown label; UTF-8 is right more often than not.
		return new TextDecoder().decode(Uint8Array.from(bytes));
	}
};

/** `SUCCESS` then one `key=value` per line, or `FAIL` and a reason. */
const parse = (body: string): Record<string, string> | null => {
	const [status, ...lines] = body.split(/\r?\n/);
	if (status?.trim() !== 'SUCCESS') return null;

	const pairs = lines
		.map((line) => {
			const at = line.indexOf('=');
			return at > 0 ? ([line.slice(0, at), line.slice(at + 1)] as const) : null;
		})
		.filter((pair) => pair !== null);

	const charset =
		pairs.find(([key]) => key === 'charset')?.[1].trim() || 'windows-1252';

	return Object.fromEntries(
		pairs.map(([key, value]) => [key, decode(value, charset)])
	);
};

const toDonation = (
	tx: string,
	fields: Record<string, string>
): Donation | null => {
	// Only a payment that is going through, and only the one that was asked
	// about. Refunded, reversed or denied payments get the generic page.
	const status = fields.payment_status;
	if (status !== 'Completed' && status !== 'Pending') return null;
	if (fields.txn_id && fields.txn_id !== tx) return null;

	const amount = fields.mc_gross?.trim();
	const currency = fields.mc_currency?.trim().toUpperCase();
	if (!amount || !/^\d+(\.\d{1,2})?$/.test(amount)) return null;
	if (!currency || !/^[A-Z]{3}$/.test(currency)) return null;

	const firstName =
		fields.first_name?.replace(/\s+/g, ' ').trim().slice(0, 40) || null;

	return { firstName, amount, currency, pending: status === 'Pending' };
};

const fetchDonation = async (
	tx: string,
	token: string
): Promise<Donation | null> => {
	try {
		const response = await fetch(PDT_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ cmd: '_notify-synch', tx, at: token }),
			signal: AbortSignal.timeout(TIMEOUT_MS),
			cache: 'no-store',
		});
		if (!response.ok) {
			console.warn(`[paypal-pdt] lookup responded with ${response.status}`);
			return null;
		}
		const fields = parse(await response.text());
		return fields ? toDonation(tx, fields) : null;
	} catch (error) {
		console.warn('[paypal-pdt] lookup failed:', error);
		return null;
	}
};

/**
 * The payment behind a PayPal transaction ID, or `null` when it cannot be
 * confirmed: no token configured, over budget, unknown ID, not a live payment,
 * or PayPal did not answer in time. `client` is the caller's rate-limit key.
 */
export const lookupDonation = async (
	tx: string,
	client: string
): Promise<Donation | null> => {
	const token = process.env.PAYPAL_PDT_TOKEN?.trim();
	if (!token) return null;

	const cached = cache.get(tx);
	if (cached && cached.expires > Date.now()) return cached.value;

	const pending = inflight.get(tx);
	if (pending) return pending;

	// Budgets are only spent on real round trips to PayPal. Not cached: being
	// over budget says nothing about the payment itself.
	if (!perClient(client).allowed || !siteWide('paypal-pdt').allowed) return null;

	const request = fetchDonation(tx, token)
		.then((value) => {
			remember(tx, value);
			return value;
		})
		.finally(() => inflight.delete(tx));

	inflight.set(tx, request);
	return request;
};
