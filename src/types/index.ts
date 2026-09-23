import { FeedbackCategory, HealthAPIStatus } from '@/enums';

export interface MenuItemType {
	name: string;
	value: string;
}

export interface FeaturesType extends MenuItemType {
	imgSrc: string;
}

/**
 * Command catalogue — mirrors `GET /api/v1/commands` on the bot (see Pepper-Bot
 * `src/core/api/commands/index.ts`). Names and descriptions come back already
 * translated for the requested locale.
 */
export interface CommandChoice {
	name: string;
	value: string | number;
}

export interface CommandOption {
	name: string;
	description: string;
	type: number;
	typeName: string;
	required: boolean;
	autocomplete: boolean;
	choices: CommandChoice[];
}

export interface CommandSubcommand {
	name: string;
	description: string;
	/** Set when the subcommand sits inside a group, e.g. `/language set`. */
	group: string | null;
	options: CommandOption[];
}

export interface BotCommand {
	name: string;
	description: string;
	category: string;
	categoryName: string;
	categoryEmoji: string;
	cooldown: number;
	dj: boolean;
	premium: boolean;
	ownerOnly: boolean;
	userPermissions: string[];
	botPermissions: string[];
	options: CommandOption[];
	subcommands: CommandSubcommand[];
}

export interface CommandCategory {
	id: string;
	name: string;
	emoji: string;
	count: number;
}

/** `GET /commands` */
export interface CommandCatalogue {
	locale: string;
	total: number;
	categories: CommandCategory[];
	commands: BotCommand[];
}

/**
 * Language catalogue — mirrors `GET /api/v1/languages` (see Pepper-Bot
 * `src/core/api/languages/index.ts`). `completeness` is the share of translation
 * keys present for that locale, 0-1.
 */
export interface BotLanguage {
	code: string;
	name: string;
	nativeName: string;
	discordLocale: string | null;
	default: boolean;
	completeness: number;
	totalKeys: number;
	missingKeys: number;
}

/** `GET /languages` */
export interface LanguageCatalogue {
	default: string;
	total: number;
	languages: BotLanguage[];
}

export interface HealthAPIData {
	status: HealthAPIStatus.SUCCESS;
	timestamp: Date;
	uptime: number;
	system: {
		platform: 'linux';
		cpuLoad: number;
		memoryUsage: number;
		nodeVersion: string;
	};
}

export interface BaseTrackData {
	title: string;
	author: string;
	sourceName: string;
	uri: string;
	played_number: number;
	timestamp: Date;
	artworkUrl: string;
}

export interface GuildCommandHistoryData {
	status: string;
	timestamp: Date;
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
	data: BaseTrackData[];
}

export interface ErrorComponentProps {
	title?: string;
	message?: string;
	retryAction?: () => void;
	customAction?: {
		label: string;
		onClick: () => void;
	};
}

/**
 * Stats API — mirrors `GET /api/v1/stats/*` on the bot (see Pepper-Bot
 * `src/core/api/music/stats/index.ts`). Every endpoint answers with a
 * `StatsEnvelope`; dates are serialised as ISO strings over the wire.
 */
export interface StatsEnvelope<T> {
	success: boolean;
	cached: boolean;
	generatedAt: string;
	data: T;
}

export interface StatsSongUser {
	id: string;
	username: string;
	discriminator: string;
	avatar?: string;
}

/** `GET /stats/songs` → `topSongs[]` */
export interface StatsSong {
	track: string;
	artworkUrl: string;
	sourceName: string;
	title: string;
	identifier: string;
	author: string;
	duration: number;
	isrc: string;
	isSeekable: boolean;
	isStream: boolean;
	uri: string;
	thumbnail: string | null;
	requester?: StatsSongUser | null;
	played_number: number;
	timestamp: string;
}

/** `GET /stats/overview` */
export interface StatsOverview {
	uniqueSongs: number;
	totalPlays: number;
	uniqueArtists: number;
	estimatedPlaytimeMs: number;
	activeGuilds: number;
	trackedListeners: number;
	songsLastPlayed24h: number;
	songsLastPlayed7d: number;
	lastPlayedAt: string | null;
}

/** `GET /stats/songs` */
export interface StatsSongs {
	uniqueSongs: number;
	totalPlays: number;
	limit: number;
	topSongs: StatsSong[];
}

export interface StatsTopRequester {
	rank: number;
	userId: string;
	username: string | null;
	avatar: string | null;
	totalPlays: number;
	uniqueSongs: number;
	uniqueArtists: number;
	estimatedPlaytimeMs: number;
	lastPlayedAt: string | null;
}

/** `GET /stats/requesters` */
export interface StatsRequesters {
	limit: number;
	requesters: StatsTopRequester[];
}

export interface StatsServerPlaytime {
	guildId: string;
	guildName: string | null;
	estimatedPlaytimeMs: number;
	totalPlays: number;
	uniqueSongs: number;
}

/** `GET /stats/playtime` */
export interface StatsPlaytime {
	estimatedPlaytimeMs: number;
	totalPlays: number;
	trackedGuilds: number;
	limit: number;
	servers: StatsServerPlaytime[];
}

export interface StatsServerTopSong {
	title: string;
	author: string;
	uri: string;
	artworkUrl: string | null;
	plays: number;
}

/** `GET /stats/servers/:guildId` */
export interface StatsServerInsight {
	guildId: string;
	guildName: string | null;
	guildIcon: string | null;
	memberCount: number | null;
	totalPlays: number;
	uniqueSongs: number;
	uniqueArtists: number;
	estimatedPlaytimeMs: number;
	averagePlaysPerSong: number;
	sources: string[];
	topSong: StatsServerTopSong | null;
	lastPlayedAt: string | null;
	live: boolean;
}

/** `GET /stats/servers` */
export interface StatsServers {
	limit: number;
	servers: StatsServerInsight[];
}

/** `GET /stats/playlists` → `playlists[]`. Only public playlists that have been played are listed. */
export interface StatsPublicPlaylist {
	rank: number;
	/** Share code — pasting it into `/play` queues the playlist. */
	code: string;
	name: string;
	ownerId: string;
	ownerUsername: string | null;
	ownerAvatar: string | null;
	trackCount: number;
	playCount: number;
	lastPlayedAt: string | null;
	createdAt: string;
}

/** `GET /stats/playlists` — private playlists are only ever counted. */
export interface StatsPlaylists {
	totalPlaylists: number;
	publicPlaylists: number;
	privatePlaylists: number;
	publicPlays: number;
	limit: number;
	playlists: StatsPublicPlaylist[];
}

export interface StatsPlaylistTrack {
	position: number;
	title: string;
	author: string;
	uri: string;
	sourceName: string;
	duration: number;
	isStream: boolean;
	artworkUrl: string | null;
}

/** `GET /stats/playlists/:code` — a public playlist and its songs. */
export interface StatsPlaylistDetail extends Omit<StatsPublicPlaylist, 'rank'> {
	/** Sum of track durations, live streams excluded. */
	totalDurationMs: number;
	tracks: StatsPlaylistTrack[];
}

/** `curated` stations are hand-picked and verified; `radiobrowser` ones come from the Radio Browser directory. */
export type StatsRadioSource = 'curated' | 'radiobrowser';

/** `GET /stats/radio` → `topStations[]`, ranked by listening time, then tune-ins. */
export interface StatsRadioStation {
	rank: number;
	stationId: string;
	name: string;
	genre: string;
	/** ISO 3166-1 alpha-2 code, e.g. `IN`. */
	country: string | null;
	artworkUrl: string | null;
	source: StatsRadioSource;
	/** Times the station was started with `/radio`. */
	playCount: number;
	/** Measured time on air, flushed by the bot every five minutes. */
	totalDurationMs: number;
	lastPlayed: string;
}

export interface StatsRadioSummary {
	uniqueStations: number;
	totalPlays: number;
	totalListenMs: number;
	totalSessions: number;
	topGenre: string | null;
	countries: number;
}

/**
 * `GET /stats/radio` (Pepper-Bot 5.15.0+). Radio is tracked apart from music,
 * so none of it is counted in the song, requester or playtime endpoints.
 * `summary` is null until someone has tuned in.
 */
export interface StatsRadio {
	limit: number;
	summary: StatsRadioSummary | null;
	topStations: StatsRadioStation[];
}

/** The station behind a live player, when it was started with `/radio`. */
export interface StatsRealtimeRadio {
	stationId: string;
	name: string;
	genre: string;
	/** ISO 3166-1 alpha-2 code, e.g. `IN`. */
	country: string | null;
	artworkUrl: string | null;
	homepage: string | null;
	source: StatsRadioSource;
	codec: string;
	bitrate: number;
	/** Time since the station was started; stream reconnects do not reset it. */
	onAirMs: number;
}

export interface StatsRealtimeTrack {
	guildId: string;
	guildName: string | null;
	voiceChannelId: string | null;
	listeners: number;
	playing: boolean;
	paused: boolean;
	position: number;
	queueSize: number;
	title: string;
	author: string;
	uri: string;
	duration: number;
	artworkUrl: string | null;
	sourceName: string;
	requester: StatsSongUser | null;
	shardId: number;
	/**
	 * Set while the player is streaming a station; `title` and `author` are then
	 * whatever the stream reports. Missing from bots that predate it.
	 */
	radio?: StatsRealtimeRadio | null;
}

/** `GET /stats/realtime` */
export interface StatsRealtime {
	players: number;
	playing: number;
	paused: number;
	idle: number;
	listeners: number;
	guilds: number;
	members: number;
	channels: number;
	shards: number;
	uptime: number;
	nowPlaying: StatsRealtimeTrack[];
}

/** One `message` event on the site's own `/api/stats/realtime/stream`. */
export interface StatsRealtimeEvent {
	/** How long ago the bot was read, so clocks are moved on from the right moment. */
	ageMs: number;
	data: StatsRealtime;
}

/**
 * Every stats endpoint fetched in one pass. Sections resolve independently so a
 * single failing endpoint degrades that card instead of the whole page.
 */
export interface StatsBundle {
	generatedAt: string;
	realtime: StatsRealtime | null;
	overview: StatsOverview | null;
	songs: StatsSongs | null;
	requesters: StatsRequesters | null;
	playtime: StatsPlaytime | null;
	servers: StatsServers | null;
	playlists: StatsPlaylists | null;
	radio: StatsRadio | null;
}

export interface FeatureCardProps {
	readonly icon: React.ReactNode;
	readonly title: string;
	readonly description: string;
}

/**
 * Feedback form — what the browser POSTs to `/api/feedback`. The route
 * re-validates every field before anything reaches the Discord webhook.
 */
export interface FeedbackSubmission {
	rating: number;
	category: FeedbackCategory;
	message: string;
	/** Optional, so we can credit the reporter in release notes. */
	discordUsername?: string;
	/** Honeypot — hidden from real users, filled in by most bots. */
	website?: string;
}

export interface FeedbackResponse {
	success: boolean;
	message: string;
}

export interface FeedbackCategoryOption {
	value: FeedbackCategory;
	label: string;
	hint: string;
}
