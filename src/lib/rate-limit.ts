import { NextResponse } from 'next/server';

/**
 * Per-IP request budgets for the routes that proxy the bot's API.
 *
 * The app runs as a single long-lived server, so an in-memory sliding window is
 * enough; it resets on deploy, which is acceptable. The point is not perfect
 * accounting — it is making sure one browser tab (or one script) cannot turn
 * into thousands of requests against the bot.
 */

export interface RateLimitRule {
	windowMs: number;
	/** Requests allowed per window, per client. */
	max: number;
}

export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	/** Seconds until the client's oldest request falls out of the window. */
	retryAfterSeconds: number;
}

/**
 * Best-effort client identity. Behind a proxy, `x-forwarded-for` is the real one.
 * Takes a `Request` in route handlers, or `{ headers: await headers() }` in a
 * server component.
 */
export const clientKey = (request: { headers: Pick<Headers, 'get'> }): string => {
	const forwarded = request.headers.get('x-forwarded-for');
	return (
		forwarded?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip')?.trim() ||
		'unknown'
	);
};

const MAX_TRACKED_CLIENTS = 5_000;

/**
 * Builds an isolated limiter. Each route gets its own so a burst of stats polls
 * cannot spend the budget for feedback submissions.
 */
export const createRateLimiter = ({ windowMs, max }: RateLimitRule) => {
	const hits = new Map<string, number[]>();

	/** Drops clients whose entire history has aged out of the window. */
	const prune = (now: number): void => {
		for (const [key, times] of hits) {
			if (times.every((at) => now - at >= windowMs)) hits.delete(key);
		}
	};

	return (key: string): RateLimitResult => {
		const now = Date.now();
		const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);

		if (recent.length >= max) {
			hits.set(key, recent);
			const oldest = recent[0] ?? now;
			return {
				allowed: false,
				remaining: 0,
				retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
			};
		}

		recent.push(now);
		hits.set(key, recent);
		if (hits.size > MAX_TRACKED_CLIENTS) prune(now);

		return { allowed: true, remaining: max - recent.length, retryAfterSeconds: 0 };
	};
};

/** The 429 every rate-limited route answers with. */
export const tooManyRequests = (result: RateLimitResult): NextResponse =>
	NextResponse.json(
		{
			status: 'error',
			message: 'Too many requests — slow down for a moment.',
		},
		{
			status: 429,
			headers: {
				'Retry-After': String(result.retryAfterSeconds),
				'Cache-Control': 'no-store',
			},
		},
	);
