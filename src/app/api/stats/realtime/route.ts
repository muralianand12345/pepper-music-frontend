import { NextRequest, NextResponse } from 'next/server';

import { clientKey, createRateLimiter, tooManyRequests } from '@/lib/rate-limit';
import { getRealtime } from '@/lib/stats-api';

/**
 * A one-off read of the realtime snapshot. The site's own cards stay live on
 * `./stream` instead. `getRealtime` holds a 10s in-process copy, so however
 * often this is called it costs the bot one call every ten seconds; the limiter
 * below is what stops a script doing the same thing a thousand times a second.
 */
const limiter = createRateLimiter({ windowMs: 60_000, max: 30 });

export const GET = async (request: NextRequest) => {
	const limit = limiter(clientKey(request));
	if (!limit.allowed) return tooManyRequests(limit);

	try {
		return NextResponse.json(await getRealtime(), {
			headers: { 'Cache-Control': 'public, max-age=5, stale-while-revalidate=30' },
		});
	} catch (error) {
		console.error('Error fetching realtime stats:', error);
		return NextResponse.json(
			{ status: 'error', message: 'Failed to fetch realtime stats' },
			{ status: 503, headers: { 'Cache-Control': 'no-store' } },
		);
	}
};

export const dynamic = 'force-dynamic';
