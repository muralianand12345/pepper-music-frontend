import { StatsRealtime } from '@/types';

import { getRealtime, REALTIME_TTL_MS, realtimeReadAt } from './stats-api';

/**
 * Fans the bot's realtime snapshot out to every open
 * `/api/stats/realtime/stream`, as server-sent events.
 *
 * One read loop serves every viewer and runs only while someone is connected,
 * so the bot sees at most one realtime call per cache TTL however many tabs are
 * open — and none once they all close. Each snapshot is serialised once and
 * written to every stream. A read that only moved the clocks on (positions,
 * uptime, time on air) is not sent at all: every client already extrapolates
 * those from the snapshot it has, so it gets a keep-alive ping instead.
 *
 * Process-local, like the cache and the rate limiter: the site runs as one
 * long-lived server. A second replica would run its own loop.
 *
 * Never import this from a client component: it reads server-only env vars.
 */

/** Read just after the cache expires, so each read reaches the bot instead of the cache. */
const READ_MARGIN_MS = 250;
/** Floor between reads, so a stale cache entry cannot spin the loop. */
const MIN_READ_GAP_MS = 5_000;
/** A snapshot this old is no longer live, and viewers are told so. */
const STALE_AFTER_MS = 30_000;
/** How far a clock may drift before it counts as a change (a seek, a stall, a restart). */
const DRIFT_TOLERANCE_MS = 5_000;
/** How long a browser waits before reconnecting a dropped stream (the SSE `retry:` field). */
const RECONNECT_DELAY_MS = 5_000;
/** Messages queued for one viewer before it is treated as gone. */
const MAX_QUEUED_MESSAGES = 8;
const MAX_STREAMS = 2_000;
/** Generous on purpose: a school or office NAT puts many visitors behind one address. */
const MAX_STREAMS_PER_CLIENT = 20;

interface Viewer {
	controller: ReadableStreamDefaultController<Uint8Array>;
	client: string;
}

interface Snapshot {
	json: string;
	/** When it was read from the bot. */
	at: number;
}

const encoder = new TextEncoder();
const RETRY = encoder.encode(`retry: ${RECONNECT_DELAY_MS}\n\n`);
const PING = encoder.encode(': ping\n\n');
const STALE = encoder.encode('event: stale\ndata: {}\n\n');

const viewers = new Set<Viewer>();
const perClient = new Map<string, number>();

let latest: Snapshot | null = null;
/** Fingerprint of the last snapshot broadcast — the one viewers are extrapolating from. */
let sentPrint: string | null = null;
/** Whether viewers have been told the feed is stale. */
let stale = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let reading = false;

const snapshotMessage = ({ json, at }: Snapshot): Uint8Array =>
	encoder.encode(`data: {"ageMs":${Math.max(Date.now() - at, 0)},"data":${json}}\n\n`);

/**
 * What a snapshot says with the clocks taken out. Anything that counts up is
 * replaced by the moment it started (read time − elapsed), which holds still
 * while things play on and jumps on a seek, a skip or a restart.
 */
const fingerprint = (data: StatsRealtime, at: number): string => {
	const startedAt = (elapsedMs: number) => Math.round((at - elapsedMs) / DRIFT_TOLERANCE_MS);
	return JSON.stringify({
		...data,
		uptime: startedAt(data.uptime),
		nowPlaying: data.nowPlaying.map((track) => ({
			...track,
			position: track.playing && !track.paused ? startedAt(track.position) : track.position,
			radio: track.radio && { ...track.radio, onAirMs: startedAt(track.radio.onAirMs) },
		})),
	});
};

const drop = (viewer: Viewer): void => {
	if (!viewers.delete(viewer)) return;

	const open = (perClient.get(viewer.client) ?? 1) - 1;
	if (open > 0) perClient.set(viewer.client, open);
	else perClient.delete(viewer.client);
	if (viewers.size) return;

	// Nobody is watching: stop reading, and forget the last snapshot so the next
	// viewer is not handed one from whenever the page was last open.
	if (timer) clearTimeout(timer);
	timer = null;
	latest = null;
	sentPrint = null;
	stale = false;
};

const write = (viewer: Viewer, message: Uint8Array): void => {
	try {
		if ((viewer.controller.desiredSize ?? 0) > 0) return viewer.controller.enqueue(message);
		// It has stopped reading. Skipping messages would leave it on a snapshot it
		// never replaced, so end the stream; the browser reconnects to a fresh copy.
		drop(viewer);
		viewer.controller.close();
	} catch {
		drop(viewer);
	}
};

const broadcast = (message: Uint8Array): void => {
	for (const viewer of viewers) write(viewer, message);
};

const publish = (data: StatsRealtime, at: number): void => {
	latest = { json: JSON.stringify(data), at };
	const print = fingerprint(data, at);
	if (!stale && print === sentPrint) return broadcast(PING);

	sentPrint = print;
	stale = false;
	broadcast(snapshotMessage(latest));
};

const markStale = (): void => {
	if (stale) return broadcast(PING);
	stale = true;
	broadcast(STALE);
};

const read = async (): Promise<void> => {
	timer = null;
	reading = true;
	let wait = MIN_READ_GAP_MS;
	try {
		const data = await getRealtime();
		const at = realtimeReadAt() ?? Date.now();
		wait = Math.max(at + REALTIME_TTL_MS + READ_MARGIN_MS - Date.now(), MIN_READ_GAP_MS);
		if (!viewers.size) return;
		// While the bot is down the cache keeps serving its last good copy.
		if (Date.now() - at > STALE_AFTER_MS) markStale();
		else publish(data, at);
	} catch {
		if (viewers.size) markStale();
	} finally {
		reading = false;
		if (viewers.size) timer = setTimeout(() => void read(), wait);
	}
};

const join = (viewer: Viewer): void => {
	viewers.add(viewer);
	perClient.set(viewer.client, (perClient.get(viewer.client) ?? 0) + 1);

	write(viewer, RETRY);
	if (latest) write(viewer, snapshotMessage(latest));
	if (stale) write(viewer, STALE);
	if (!timer && !reading) void read();
};

/**
 * Opens one viewer's stream, or returns null when the server (or this client)
 * already holds as many as it will.
 */
export const openRealtimeStream = (client: string): ReadableStream<Uint8Array> | null => {
	if (viewers.size >= MAX_STREAMS) return null;
	if ((perClient.get(client) ?? 0) >= MAX_STREAMS_PER_CLIENT) return null;

	let viewer: Viewer;
	return new ReadableStream<Uint8Array>(
		{
			start: (controller) => {
				viewer = { controller, client };
				join(viewer);
			},
			// The browser went away: the tab closed, navigated, or lost its connection.
			cancel: () => drop(viewer),
		},
		new CountQueuingStrategy({ highWaterMark: MAX_QUEUED_MESSAGES }),
	);
};
