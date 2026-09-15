'use client';

import React from 'react';

import { StatsRealtime, StatsRealtimeTrack } from '@/types';

/** Backoff ceiling once the endpoint starts refusing us. */
const MAX_POLL_INTERVAL_MS = 120_000;

export interface RealtimeStatsState {
	data: StatsRealtime | null;
	/** True until the first successful read, and again whenever a poll fails. */
	stale: boolean;
	refreshing: boolean;
	/** When `data` was read, so playback positions can be moved on between polls. */
	fetchedAt: number;
}

/**
 * Keeps a server-rendered realtime snapshot fresh from `/api/stats/realtime`.
 *
 * Polling is scheduled one tick at a time rather than on a fixed interval, so
 * it can do three things a plain `setInterval` cannot: stop entirely while the
 * tab is in the background, back off when the endpoint pushes back, and honour
 * a `Retry-After` instead of hammering through it. The route itself serves a
 * 10s cached copy, so however many cards poll, the bot sees one call per ten
 * seconds.
 */
export const useRealtimeStats = (
	initialData: StatsRealtime | null,
	intervalMs: number
): RealtimeStatsState => {
	const [data, setData] = React.useState<StatsRealtime | null>(initialData);
	const [stale, setStale] = React.useState(!initialData);
	const [fetchedAt, setFetchedAt] = React.useState(() => Date.now());
	const [refreshing, setRefreshing] = React.useState(false);

	React.useEffect(() => {
		let cancelled = false;
		let timer: ReturnType<typeof setTimeout> | undefined;
		let failures = 0;
		let delay = intervalMs;
		/** Seconds the server asked us to wait, when it bothered to say. */
		let retryAfterSeconds = 0;

		const schedule = (wait: number) => {
			if (cancelled) return;
			clearTimeout(timer);
			timer = setTimeout(poll, wait);
		};

		const backOff = () => {
			failures += 1;
			const exponential = Math.min(intervalMs * 2 ** failures, MAX_POLL_INTERVAL_MS);
			delay = Math.max(exponential, retryAfterSeconds * 1000);
			retryAfterSeconds = 0;
		};

		async function poll() {
			// Nobody is looking — do not spend a request on it.
			if (document.visibilityState === 'hidden') return schedule(intervalMs);

			setRefreshing(true);
			try {
				const response = await fetch('/api/stats/realtime', {
					cache: 'no-store',
				});

				if (response.status === 429) {
					const header = Number(response.headers.get('retry-after'));
					retryAfterSeconds = Number.isFinite(header) ? header : 0;
					throw new Error('rate limited');
				}
				if (!response.ok) throw new Error(`status ${response.status}`);

				const payload = (await response.json()) as StatsRealtime;
				if (cancelled) return;

				setData(payload);
				setFetchedAt(Date.now());
				setStale(false);
				failures = 0;
				delay = intervalMs;
			} catch {
				if (cancelled) return;
				setStale(true);
				backOff();
			} finally {
				if (!cancelled) {
					setRefreshing(false);
					schedule(delay);
				}
			}
		}

		// Coming back to the tab should show fresh numbers, not a stale snapshot.
		const onVisibility = () => {
			if (document.visibilityState !== 'visible') return;
			failures = 0;
			delay = intervalMs;
			schedule(0);
		};

		document.addEventListener('visibilitychange', onVisibility);
		schedule(delay);

		return () => {
			cancelled = true;
			clearTimeout(timer);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	}, [intervalMs]);

	return { data, stale, refreshing, fetchedAt };
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

/** Position reported by the bot plus the time elapsed since that snapshot. */
export const livePosition = (track: StatsRealtimeTrack, elapsedMs: number): number => {
	if (!track.playing || track.paused) return track.position;
	if (!track.duration) return track.position;
	return Math.min(track.position + elapsedMs, track.duration);
};
