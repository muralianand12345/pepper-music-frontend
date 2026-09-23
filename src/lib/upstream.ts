/**
 * Shared plumbing for every call this site makes into the bot's API
 * (Pepper-Bot `src/events/client/ready/api.ts`).
 *
 * The bot serves the API from the same process that runs the shards and talks
 * to MongoDB, so browser traffic must never map one-to-one onto upstream
 * requests. Everything here goes through three guards:
 *
 *   1. a hard timeout, so a stalled bot cannot pin our own connections open;
 *   2. an in-process cache that collapses concurrent callers into a single
 *      upstream request (single-flight) and holds the answer for a TTL;
 *   3. a stale window — while the bot is unhappy we keep serving the last good
 *      payload instead of retrying on every request.
 *
 * Never import this from a client component: it reads server-only env vars.
 */

const DEFAULT_TIMEOUT_MS = 8_000;

/** Thrown for anything the bot could not answer; `status` is what we surface. */
export class UpstreamError extends Error {
	readonly status: number;

	constructor(message: string, status: number = 502) {
		super(message);
		this.name = 'UpstreamError';
		this.status = status;
	}
}

/**
 * BACKEND_API_ENDPOINT may be given as the bare origin
 * (`http://pepper-bot:3000`) or already versioned (`.../api/v1`).
 */
const resolveBaseUrl = (): string => {
	const raw = process.env.BACKEND_API_ENDPOINT?.trim();
	if (!raw) throw new UpstreamError('BACKEND_API_ENDPOINT is not configured', 503);
	const base = raw.replace(/\/+$/, '');
	return /\/api\/v\d+$/.test(base) ? base : `${base}/api/v1`;
};

const buildUrl = (
	path: string,
	params?: Record<string, string | number>,
): string => {
	const url = new URL(`${resolveBaseUrl()}${path}`);
	for (const [key, value] of Object.entries(params ?? {})) {
		url.searchParams.set(key, String(value));
	}
	return url.toString();
};

/** Envelope every bot endpoint answers with. */
interface Envelope<T> {
	success: boolean;
	cached?: boolean;
	generatedAt: string;
	data: T;
	error?: string;
}

export interface UpstreamRequest {
	params?: Record<string, string | number>;
	headers?: Record<string, string>;
	/** Next data-cache lifetime in seconds. 0 opts out (we cache in-process). */
	revalidate?: number;
	timeoutMs?: number;
}

/** One request to the bot, unwrapped from its envelope. Throws on any failure. */
export const fetchUpstream = async <T>(
	path: string,
	options: UpstreamRequest = {},
): Promise<T> => {
	const { params, headers, revalidate = 0, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

	let response: Response;
	try {
		response = await fetch(buildUrl(path, params), {
			headers,
			signal: AbortSignal.timeout(timeoutMs),
			...(revalidate > 0 ? { next: { revalidate } } : { cache: 'no-store' }),
		});
	} catch (error) {
		const timedOut = error instanceof Error && error.name === 'TimeoutError';
		throw new UpstreamError(
			timedOut ? `${path} timed out after ${timeoutMs}ms` : `${path} is unreachable`,
			504,
		);
	}

	if (!response.ok) {
		throw new UpstreamError(
			`${path} responded with ${response.status}`,
			response.status === 404 ? 404 : 502,
		);
	}

	const payload = (await response.json()) as Envelope<T>;
	if (!payload.success) {
		throw new UpstreamError(payload.error ?? `${path} returned an unsuccessful response`);
	}
	return payload.data;
};

interface CacheEntry<T> {
	value: T;
	storedAt: number;
}

/**
 * Process-wide, so every visitor shares one copy. The key space is small and
 * fixed (see `snapLimit` for why user-supplied limits cannot fragment it), so
 * this cannot grow without bound.
 */
const entries = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();
const failures = new Map<string, { error: unknown; at: number }>();

export interface CacheOptions {
	/** How long a value is served before we go back to the bot. */
	ttlMs: number;
	/** How long past the TTL a value may still be served if the bot fails. */
	staleMs?: number;
	/**
	 * After a failure with nothing cached to fall back on, how long to answer
	 * from the remembered error instead of asking again. A bot that is down or
	 * mid-deploy should not also be taking a request per page view.
	 */
	failureCooldownMs?: number;
}

const DEFAULT_STALE_MS = 10 * 60_000;
const DEFAULT_FAILURE_COOLDOWN_MS = 30_000;

/**
 * Memoises `load` under `key`. Concurrent callers that arrive while a request
 * is in flight join that request rather than starting their own, so a hundred
 * simultaneous page loads still cost the bot exactly one call.
 */
export const withCache = async <T>(
	key: string,
	{
		ttlMs,
		staleMs = DEFAULT_STALE_MS,
		failureCooldownMs = DEFAULT_FAILURE_COOLDOWN_MS,
	}: CacheOptions,
	load: () => Promise<T>,
): Promise<T> => {
	const fresh = entries.get(key) as CacheEntry<T> | undefined;
	if (fresh && Date.now() - fresh.storedAt < ttlMs) return fresh.value;

	const pending = inflight.get(key) as Promise<T> | undefined;
	if (pending) return pending;

	const failed = failures.get(key);
	if (failed && Date.now() - failed.at < failureCooldownMs) {
		const stale = entries.get(key) as CacheEntry<T> | undefined;
		if (stale && Date.now() - stale.storedAt < ttlMs + staleMs) return stale.value;
		throw failed.error;
	}

	const request = load()
		.then((value) => {
			entries.set(key, { value, storedAt: Date.now() });
			failures.delete(key);
			return value;
		})
		.catch((error: unknown) => {
			failures.set(key, { error, at: Date.now() });

			// The bot is down or slow. A slightly old answer beats an error page,
			// and it stops us hammering an endpoint that is already struggling.
			const stale = entries.get(key) as CacheEntry<T> | undefined;
			if (stale && Date.now() - stale.storedAt < ttlMs + staleMs) {
				console.warn(`[upstream] ${key} failed, serving cached copy:`, error);
				return stale.value;
			}
			throw error;
		})
		.finally(() => {
			inflight.delete(key);
		});

	inflight.set(key, request);
	return request;
};

/**
 * When the value `withCache` currently holds under `key` was read from the bot.
 * A stale copy served while the bot is failing keeps its original read time.
 */
export const cachedAt = (key: string): number | undefined => entries.get(key)?.storedAt;

/**
 * Snaps a caller-supplied list length to a step so `?songs=` cannot be varied
 * to walk straight past the cache — 100 distinct values would otherwise mean
 * 100 distinct upstream queries.
 */
export const snapLimit = (
	value: string | number | null | undefined,
	fallback: number,
	{ step = 10, max = 100 }: { step?: number; max?: number } = {},
): number => {
	const parsed =
		typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
	if (!Number.isFinite(parsed) || parsed < 1) return fallback;
	return Math.min(Math.ceil(parsed / step) * step, max);
};
