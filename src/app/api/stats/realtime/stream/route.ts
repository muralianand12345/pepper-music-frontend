import { NextRequest, NextResponse } from 'next/server';

import { clientKey, createRateLimiter, tooManyRequests } from '@/lib/rate-limit';
import { openRealtimeStream } from '@/lib/realtime-stream';

/**
 * The live feed behind the "Live activity" and "Now playing" cards, as
 * server-sent events. Everything expensive happens once, in
 * `realtime-stream.ts`; this only admits the connection.
 *
 * The limiter counts connections opened, not messages: a tab reconnects when
 * its network drops or it comes back from the background, which is a handful a
 * minute at most.
 */
const limiter = createRateLimiter({ windowMs: 60_000, max: 20 });

export const GET = (request: NextRequest) => {
	const client = clientKey(request);
	const limit = limiter(client);
	if (!limit.allowed) return tooManyRequests(limit);

	const stream = openRealtimeStream(client);
	if (!stream) {
		return NextResponse.json(
			{ status: 'error', message: 'Too many live connections — try again shortly.' },
			{ status: 503, headers: { 'Retry-After': '30', 'Cache-Control': 'no-store' } },
		);
	}

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream; charset=utf-8',
			// `no-transform` keeps `next start`'s gzip from buffering the stream.
			'Cache-Control': 'no-cache, no-transform',
			// nginx buffers proxied responses unless told not to.
			'X-Accel-Buffering': 'no',
		},
	});
};

export const dynamic = 'force-dynamic';
