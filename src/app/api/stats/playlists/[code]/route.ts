import { NextRequest, NextResponse } from 'next/server';

import { clientKey, createRateLimiter, tooManyRequests } from '@/lib/rate-limit';
import { getPlaylist, getPlaylists, TOP_PLAYLIST_COUNT } from '@/lib/stats-api';
import { UpstreamError } from '@/lib/upstream';

/**
 * Songs in one public playlist, fetched when someone opens it on the stats
 * page. Only codes currently in the cached top list are passed on: the list is
 * already held for 60s, so checking it is free, and it stops a script from
 * walking the code space — each code would otherwise be a fresh cache entry and
 * a fresh MongoDB read on the bot.
 */

const PLAYLIST_CODE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/;

/** A person clicking through the list; not a crawler. */
const limiter = createRateLimiter({ windowMs: 60_000, max: 20 });

const failure = (status: number, message: string) =>
	NextResponse.json(
		{ status: 'error', message },
		{ status, headers: { 'Cache-Control': 'no-store' } },
	);

export const GET = async (
	request: NextRequest,
	{ params }: { params: Promise<{ code: string }> },
) => {
	const limit = limiter(clientKey(request));
	if (!limit.allowed) return tooManyRequests(limit);

	const code = (await params).code.trim().toUpperCase();
	if (!PLAYLIST_CODE.test(code)) return failure(400, 'Invalid playlist code');

	try {
		const top = await getPlaylists(TOP_PLAYLIST_COUNT);
		if (!top.playlists.some((playlist) => playlist.code === code)) {
			return failure(404, 'Playlist not found');
		}

		return NextResponse.json(await getPlaylist(code), {
			headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=120' },
		});
	} catch (error) {
		if (error instanceof UpstreamError && error.status === 404) {
			return failure(404, 'Playlist not found');
		}
		console.error(`Error fetching playlist ${code}:`, error);
		return failure(503, 'Failed to fetch playlist');
	}
};

export const dynamic = 'force-dynamic';
