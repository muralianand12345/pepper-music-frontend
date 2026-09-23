'use client';

import React from 'react';

import { StatsRealtime, StatsRealtimeEvent, StatsRealtimeTrack } from '@/types';
import { isLiveDuration } from '@/utils/format';

const STREAM_URL = '/api/stats/realtime/stream';
/** First wait after the server refuses a connection; doubles with each refusal. */
const RETRY_BASE_MS = 5_000;
/** Backoff ceiling once the endpoint starts refusing us. */
const MAX_RETRY_MS = 120_000;
/** A tab left in the background this long gives its connection back; flicking between tabs does not. */
const HIDDEN_GRACE_MS = 30_000;

export interface RealtimeStatsState {
	data: StatsRealtime | null;
	/** True until the first live reading, and again whenever the feed drops or goes stale. */
	stale: boolean;
	/** When `data` was read from the bot, so playback positions can be moved on between updates. */
	fetchedAt: number;
}

/**
 * Keeps a server-rendered realtime snapshot live from `/api/stats/realtime/stream`.
 *
 * The server only sends a snapshot when something changed, so in between,
 * positions and clocks are moved on from `fetchedAt` — the moment the bot was
 * read, not the moment the message arrived.
 *
 * `EventSource` reconnects a dropped stream on its own but gives up for good
 * when the server refuses one (a 429 or 503), so refusals are retried here with
 * backoff. A tab that stays in the background closes its stream; coming back
 * reopens it, and the server answers with the latest snapshot straight away.
 */
export const useRealtimeStats = (initialData: StatsRealtime | null): RealtimeStatsState => {
	const [data, setData] = React.useState<StatsRealtime | null>(initialData);
	const [stale, setStale] = React.useState(!initialData);
	const [fetchedAt, setFetchedAt] = React.useState(() => Date.now());

	React.useEffect(() => {
		let source: EventSource | null = null;
		let retryTimer: ReturnType<typeof setTimeout> | undefined;
		let hiddenTimer: ReturnType<typeof setTimeout> | undefined;
		let refusals = 0;

		const disconnect = () => {
			clearTimeout(retryTimer);
			source?.close();
			source = null;
		};

		const connect = () => {
			disconnect();
			const stream = new EventSource(STREAM_URL);
			source = stream;

			stream.onmessage = (event: MessageEvent<string>) => {
				let message: StatsRealtimeEvent;
				try {
					message = JSON.parse(event.data) as StatsRealtimeEvent;
				} catch {
					return;
				}
				refusals = 0;
				setData(message.data);
				setFetchedAt(Date.now() - message.ageMs);
				setStale(false);
			};

			// The bot stopped answering; keep the last reading on screen, flagged.
			stream.addEventListener('stale', () => setStale(true));

			stream.onerror = () => {
				setStale(true);
				// Still CONNECTING means the browser is already retrying a dropped stream.
				if (stream.readyState !== EventSource.CLOSED) return;
				refusals += 1;
				retryTimer = setTimeout(
					connect,
					Math.min(RETRY_BASE_MS * 2 ** (refusals - 1), MAX_RETRY_MS)
				);
			};
		};

		const onVisibility = () => {
			clearTimeout(hiddenTimer);
			if (document.visibilityState === 'hidden') {
				hiddenTimer = setTimeout(disconnect, HIDDEN_GRACE_MS);
			} else if (!source) {
				connect();
			}
		};

		document.addEventListener('visibilitychange', onVisibility);
		connect();
		// Opened in a background tab: start the grace period now.
		onVisibility();

		return () => {
			clearTimeout(hiddenTimer);
			disconnect();
			document.removeEventListener('visibilitychange', onVisibility);
		};
	}, []);

	return { data, stale, fetchedAt };
};

/** Current time, re-read every `intervalMs`; pass `null` to stop ticking. */
export const useNow = (intervalMs: number | null = 1000): number => {
	const [now, setNow] = React.useState(() => Date.now());

	React.useEffect(() => {
		if (intervalMs === null) return;
		const tick = setInterval(() => setNow(Date.now()), intervalMs);
		return () => clearInterval(tick);
	}, [intervalMs]);

	return now;
};

/**
 * Position reported by the bot plus the time elapsed since that snapshot. A live
 * stream has no end to clamp to, so it just keeps counting time on air.
 */
export const livePosition = (track: StatsRealtimeTrack, elapsedMs: number): number => {
	if (!track.playing || track.paused) return track.position;
	if (isLiveDuration(track.duration)) return track.position + elapsedMs;
	return Math.min(track.position + elapsedMs, track.duration);
};

/**
 * How long a live stream has been on. A radio station counts from when it was
 * started, so a dropped stream that reconnects does not reset the clock.
 */
export const onAirTime = (track: StatsRealtimeTrack, elapsedMs: number): number =>
	track.radio ? track.radio.onAirMs + elapsedMs : livePosition(track, elapsedMs);
