import {
	StatsBundle,
	StatsOverview,
	StatsPlaylistDetail,
	StatsPlaylists,
	StatsPlaytime,
	StatsRadio,
	StatsRealtime,
	StatsRequesters,
	StatsServerInsight,
	StatsServers,
	StatsSongs,
} from '@/types';

import { fetchUpstream, withCache } from './upstream';

/**
 * Server-side client for the bot's stats API (`/api/v1/stats/*`).
 * Never import this from a client component — it reads STATS_API_KEY.
 *
 * Every endpoint here is aggregated from MongoDB on the bot's side, so each of
 * these calls is genuinely expensive for it. `withCache` makes sure the cost
 * scales with time rather than with traffic: no matter how many visitors are on
 * the page, the bot sees at most one request per endpoint per TTL.
 */

const DEFAULT_LIMIT = 10;
/** Matches the bot's own 60s stats cache. */
const STATS_TTL_MS = 60_000;
/** Realtime is genuinely live, but not 15-browsers-at-once live. */
const REALTIME_TTL_MS = 10_000;

const authHeaders = (): Record<string, string> => {
	const apiKey = process.env.STATS_API_KEY?.trim();
	if (!apiKey) throw new Error('STATS_API_KEY is not configured');
	return { 'x-api-key': apiKey };
};

const readStats = <T>(
	path: string,
	{ key, ttlMs, params }: { key: string; ttlMs: number; params?: Record<string, number> },
): Promise<T> =>
	withCache(key, { ttlMs }, () =>
		fetchUpstream<T>(`/stats${path}`, { params, headers: authHeaders() }),
	);

export const getRealtime = (): Promise<StatsRealtime> =>
	readStats<StatsRealtime>('/realtime', { key: 'stats:realtime', ttlMs: REALTIME_TTL_MS });

export const getOverview = (): Promise<StatsOverview> =>
	readStats<StatsOverview>('/overview', { key: 'stats:overview', ttlMs: STATS_TTL_MS });

export const getSongs = (limit: number = DEFAULT_LIMIT): Promise<StatsSongs> =>
	readStats<StatsSongs>('/songs', {
		key: `stats:songs:${limit}`,
		ttlMs: STATS_TTL_MS,
		params: { limit },
	});

export const getRequesters = (limit: number = DEFAULT_LIMIT): Promise<StatsRequesters> =>
	readStats<StatsRequesters>('/requesters', {
		key: `stats:requesters:${limit}`,
		ttlMs: STATS_TTL_MS,
		params: { limit },
	});

export const getPlaytime = (limit: number = DEFAULT_LIMIT): Promise<StatsPlaytime> =>
	readStats<StatsPlaytime>('/playtime', {
		key: `stats:playtime:${limit}`,
		ttlMs: STATS_TTL_MS,
		params: { limit },
	});

export const getServers = (limit: number = DEFAULT_LIMIT): Promise<StatsServers> =>
	readStats<StatsServers>('/servers', {
		key: `stats:servers:${limit}`,
		ttlMs: STATS_TTL_MS,
		params: { limit },
	});

export const getServer = (guildId: string): Promise<StatsServerInsight> =>
	readStats<StatsServerInsight>(`/servers/${encodeURIComponent(guildId)}`, {
		key: `stats:server:${guildId}`,
		ttlMs: STATS_TTL_MS,
	});

/** How many playlists the stats page ranks. Only these can be opened — see `/api/stats/playlists/[code]`. */
export const TOP_PLAYLIST_COUNT = 10;

/** Added in Pepper-Bot 5.14.0; older bots 404 and the section is left out. */
export const getPlaylists = (limit: number = TOP_PLAYLIST_COUNT): Promise<StatsPlaylists> =>
	readStats<StatsPlaylists>('/playlists', {
		key: `stats:playlists:${limit}`,
		ttlMs: STATS_TTL_MS,
		params: { limit },
	});

/**
 * One public playlist with its songs. Every distinct code is its own cache
 * entry, so callers must only pass codes taken from the top list rather than
 * whatever a browser sends. A bot without this endpoint answers 404.
 */
export const getPlaylist = (code: string): Promise<StatsPlaylistDetail> =>
	readStats<StatsPlaylistDetail>(`/playlists/${encodeURIComponent(code)}`, {
		key: `stats:playlist:${code}`,
		ttlMs: STATS_TTL_MS,
	});

/**
 * Top radio stations and totals. Added in Pepper-Bot 5.15.0; older bots 404 and
 * the section is left out. Unlike the music endpoints the bot does not cache
 * this aggregate itself, so the TTL here is its only shield.
 */
export const getRadio = (limit: number = DEFAULT_LIMIT): Promise<StatsRadio> =>
	readStats<StatsRadio>('/radio', {
		key: `stats:radio:${limit}`,
		ttlMs: STATS_TTL_MS,
		params: { limit },
	});

const settled = <T>(result: PromiseSettledResult<T>, label: string): T | null => {
	if (result.status === 'fulfilled') return result.value;
	console.error(`[stats] ${label} failed:`, result.reason);
	return null;
};

export interface StatsBundleOptions {
	songs?: number;
	requesters?: number;
	playtime?: number;
	servers?: number;
	playlists?: number;
	radio?: number;
}

/**
 * Fans out to every stats endpoint at once. A section that fails resolves to
 * null so the rest of the page still renders.
 */
export const getStatsBundle = async (options: StatsBundleOptions = {}): Promise<StatsBundle> => {
	const [realtime, overview, songs, requesters, playtime, servers, playlists, radio] =
		await Promise.allSettled([
			getRealtime(),
			getOverview(),
			getSongs(options.songs ?? 20),
			getRequesters(options.requesters ?? 10),
			getPlaytime(options.playtime ?? 10),
			getServers(options.servers ?? 10),
			getPlaylists(options.playlists ?? TOP_PLAYLIST_COUNT),
			getRadio(options.radio ?? DEFAULT_LIMIT),
		]);

	return {
		generatedAt: new Date().toISOString(),
		realtime: settled(realtime, 'realtime'),
		overview: settled(overview, 'overview'),
		songs: settled(songs, 'songs'),
		requesters: settled(requesters, 'requesters'),
		playtime: settled(playtime, 'playtime'),
		servers: settled(servers, 'servers'),
		playlists: settled(playlists, 'playlists'),
		radio: settled(radio, 'radio'),
	};
};
