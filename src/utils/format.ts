/**
 * Formats milliseconds as "m:ss", or "h:mm:ss" from an hour up — a radio
 * station can stay on for a whole day.
 */
export const formatTime = (milliseconds: number): string => {
	if (!Number.isFinite(milliseconds) || milliseconds < 0) return '0:00';

	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const mins = Math.floor((totalSeconds % 3600) / 60);
	const secs = (totalSeconds % 60).toString().padStart(2, '0');

	return hours
		? `${hours}:${mins.toString().padStart(2, '0')}:${secs}`
		: `${mins}:${secs}`;
};

const MS = {
	year: 1000 * 60 * 60 * 24 * 365,
	day: 1000 * 60 * 60 * 24,
	hour: 1000 * 60 * 60,
	minute: 1000 * 60,
} as const;

/**
 * Breaks a duration into its largest units, e.g. "2 years, 41 days, 7 hours".
 * Used for the playtime totals the stats API reports in milliseconds.
 */
export const formatDurationParts = (milliseconds: number): string[] => {
	if (!Number.isFinite(milliseconds) || milliseconds <= 0) return ['0 minutes'];

	const parts: string[] = [];
	let remaining = Math.floor(milliseconds);

	for (const unit of ['year', 'day', 'hour', 'minute'] as const) {
		const value = Math.floor(remaining / MS[unit]);
		remaining -= value * MS[unit];
		if (value > 0) parts.push(`${value} ${unit}${value === 1 ? '' : 's'}`);
	}

	return parts.length ? parts : ['less than a minute'];
};

/**
 * Compact duration for inline use, e.g. "2y 41d" or "7h 12m".
 */
export const formatDuration = (milliseconds: number, maxParts: number = 2): string =>
	formatDurationParts(milliseconds).slice(0, maxParts).join(', ');

/**
 * Thousands separators for the large play counts the overview endpoint returns.
 */
export const formatNumber = (value: number | null | undefined): string => {
	if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
	return value.toLocaleString('en-US');
};

/**
 * Shortens big counts for stat tiles, e.g. 12400 -> "12.4K".
 */
export const formatCompactNumber = (value: number | null | undefined): string => {
	if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);
};

/**
 * "3 hours ago" style label for the ISO timestamps the stats API serialises.
 */
export const formatRelativeTime = (value: string | Date | null | undefined): string => {
	if (!value) return 'never';

	const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
	if (!Number.isFinite(timestamp)) return 'unknown';

	const diff = Date.now() - timestamp;
	if (diff < MS.minute) return 'just now';

	const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	for (const unit of ['year', 'day', 'hour', 'minute'] as const) {
		const amount = Math.floor(diff / MS[unit]);
		if (amount >= 1) return formatter.format(-amount, unit);
	}
	return 'just now';
};

/**
 * Turns a Lavalink source name ("youtube", "spotify") into a display label.
 */
export const formatSourceName = (source: string | null | undefined): string => {
	if (!source) return 'Unknown';
	const labels: Record<string, string> = {
		spotify: 'Spotify',
		soundcloud: 'SoundCloud',
		applemusic: 'Apple Music',
		deezer: 'Deezer',
		jiosaavn: 'JioSaavn',
		http: 'Direct',
	};
	const key = source.toLowerCase().replace(/[\s_-]/g, '');
	return labels[key] ?? source.charAt(0).toUpperCase() + source.slice(1);
};

/**
 * ISO country code -> "India". Falls back to the code itself for anything the
 * runtime does not recognise, since radio directory data is user-submitted.
 */
export const formatCountry = (code: string | null | undefined): string | null => {
	if (!code) return null;
	try {
		return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) ?? code;
	} catch {
		return code;
	}
};

/**
 * Undoes UTF-8 text that was read as Latin-1 somewhere upstream — stream
 * metadata often arrives as "ÄÃ i PhÃ¡t" instead of "Đài Phát". Only a string
 * made entirely of Latin-1 code points that decodes as valid UTF-8 is changed,
 * so ordinary accented titles ("Café") come back untouched.
 */
export const repairMojibake = (value: string): string => {
	if (!/[\u00C2-\u00F4][\u0080-\u00BF]/.test(value) || /[^\u0000-\u00FF]/.test(value)) {
		return value;
	}
	try {
		const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
		return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
	} catch {
		return value;
	}
};

/** Lavalink's stand-ins for a stream that sent no metadata. */
const PLACEHOLDER_METADATA = /^unknown(?: title| artist)?$/i;

/**
 * What a radio stream says is on, e.g. "eclipse — Sport3000". Null when all it
 * sends is the station's own name or Lavalink's "Unknown title" placeholders.
 */
export const formatStreamMetadata = (
	title: string | null | undefined,
	author: string | null | undefined,
	stationName: string
): string | null => {
	const station = stationName.trim().toLowerCase();
	const parts = [title, author]
		.map((part) => repairMojibake(part?.trim() ?? ''))
		.filter((part) => part && !PLACEHOLDER_METADATA.test(part) && part.toLowerCase() !== station);
	return parts.length ? [...new Set(parts)].join(' — ') : null;
};

/**
 * Uptime in milliseconds -> "4d 6h 12m".
 */
export const formatUptime = (milliseconds: number): string => {
	if (!Number.isFinite(milliseconds) || milliseconds <= 0) return '0m';

	const days = Math.floor(milliseconds / MS.day);
	const hours = Math.floor((milliseconds % MS.day) / MS.hour);
	const minutes = Math.floor((milliseconds % MS.hour) / MS.minute);

	return [days ? `${days}d` : '', hours ? `${hours}h` : '', `${minutes}m`]
		.filter(Boolean)
		.join(' ');
};

/**
 * Longest a single track can plausibly be. Live streams are stored with a
 * duration of `Long.MAX_VALUE`, so any total that implies an average track
 * longer than this is poisoned by them rather than real listening time.
 */
export const MAX_PLAUSIBLE_TRACK_MS = 24 * 60 * 60 * 1000;

/**
 * True for a live stream — a radio station or any other endless source. Lavalink
 * reports those as `Long.MAX_VALUE` (or 0), which must never be shown as a
 * length or used to fill a progress bar.
 */
export const isLiveDuration = (durationMs: number | null | undefined): boolean =>
	!durationMs || !Number.isFinite(durationMs) || durationMs > MAX_PLAUSIBLE_TRACK_MS;

/**
 * Guards the `estimatedPlaytimeMs` totals the stats API reports. The bot sums
 * `duration × plays` across every track, including live streams whose duration
 * is `Long.MAX_VALUE` — a handful of those makes the total meaningless. When
 * that happens we decline to render a number rather than show a wrong one.
 */
export const isPlausiblePlaytime = (
	playtimeMs: number | null | undefined,
	totalPlays: number | null | undefined
): boolean => {
	if (typeof playtimeMs !== 'number' || !Number.isFinite(playtimeMs)) return false;
	if (playtimeMs < 0) return false;
	if (!totalPlays || totalPlays <= 0) return playtimeMs === 0;
	return playtimeMs / totalPlays <= MAX_PLAUSIBLE_TRACK_MS;
};
