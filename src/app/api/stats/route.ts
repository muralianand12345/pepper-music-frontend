import { NextRequest, NextResponse } from 'next/server';

import { clientKey, createRateLimiter, tooManyRequests } from '@/lib/rate-limit';
import { getStatsBundle } from '@/lib/stats-api';
import { snapLimit } from '@/lib/upstream';

/**
 * The whole stats page in one call. It fans out to seven bot endpoints, each of
 * which aggregates over MongoDB, so this is the most expensive thing we expose:
 * limits are snapped to a step (so `?songs=` cannot be varied to walk past the
 * cache) and the per-IP budget is deliberately small.
 */

const limiter = createRateLimiter({ windowMs: 60_000, max: 10 });

export const GET = async (request: NextRequest) => {
	const limit = limiter(clientKey(request));
	if (!limit.allowed) return tooManyRequests(limit);

	const { searchParams } = request.nextUrl;

	try {
		const bundle = await getStatsBundle({
			songs: snapLimit(searchParams.get('songs') ?? searchParams.get('limit'), 20),
			requesters: snapLimit(searchParams.get('requesters'), 10),
			playtime: snapLimit(searchParams.get('playtime'), 10),
			servers: snapLimit(searchParams.get('servers'), 10),
			playlists: snapLimit(searchParams.get('playlists'), 10),
		});
		return NextResponse.json(bundle, {
			headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=120' },
		});
	} catch (error) {
		console.error('Error fetching stats data:', error);
		return NextResponse.json(
			{ status: 'error', message: 'Failed to fetch stats data' },
			{ status: 503, headers: { 'Cache-Control': 'no-store' } },
		);
	}
};

export const dynamic = 'force-dynamic';
