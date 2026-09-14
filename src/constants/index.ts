import { FeedbackCategory } from '@/enums';
import { FeedbackCategoryOption, MenuItemType } from '@/types';

/** Product pages, shown as the header's primary navigation. */
export const primaryNavItems: MenuItemType[] = [
	{ name: 'Features', value: '/bot-features' },
	{ name: 'Stats', value: '/stats' },
	{ name: 'About', value: '/about-us' },
	{ name: 'Feedback', value: '/feedback' },
];

/** Legal pages — reachable from the footer and the mobile menu, not the top nav. */
export const legalNavItems: MenuItemType[] = [
	{ name: 'Terms of Service', value: '/terms-of-service' },
	{ name: 'Privacy Policy', value: '/privacy-policy' },
];

/** Every first-party page. `middleware.ts` derives its public-route list from this. */
export const menuItems: MenuItemType[] = [...primaryNavItems, ...legalNavItems];

export const commonRoutes = ['/auth', '/public', '/images', '/dashboard'];

export const client_id =
	process.env.NODE_ENV === 'development'
		? '1302023614735847597'
		: '871808444502540379';

export const inviteLink: string = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&permissions=275443600464&scope=bot%20applications.commands`;
export const twitterLink: string = 'https://twitter.com';
export const discordServerLink: string = 'https://discord.gg/XzE9hSbsNb';

export const featursLink = '/bot-features';
export const termsLink = '/terms-of-service';
export const privacyLink = '/privacy-policy';
export const feedbackLink = '/feedback';
export const pepperLogoLink = '/images/pepperLogo.png';

export const features = [
	{
		name: 'High Quality Audio',
		value: 'Experience crystal-clear sound for all your favorite tracks.',
		imgSrc: '/images/high_quality_audio.jpg',
	},
	{
		name: 'DJ Support',
		value: 'Give DJ roles the power to manage music controls.',
		imgSrc: '/images/dj_for_discord.png',
	},
	{
		name: '24/7 Availability',
		value: 'Keep the music going anytime, anywhere.',
		imgSrc: '/images/247.jpg',
	},
];

export const MusicQuotes = [
  "“Where words fail, music speaks.” – Hans Christian Andersen",
  "“Music can change the world because it can change people.” – Bono",
  "“Without music, life would be a mistake.” – Friedrich Nietzsche",
  "“One good thing about music, when it hits you, you feel no pain.” – Bob Marley",
  "“Music is the shorthand of emotion.” – Leo Tolstoy",
  "“Music is the divine way to tell beautiful, poetic things to the heart.” – Pablo Casals",
  "“After silence, that which comes nearest to expressing the inexpressible is music.” – Aldous Huxley",
  "“To play a wrong note is insignificant; to play without passion is inexcusable.” – Ludwig van Beethoven",
  "“Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything.” – Plato",
  "“Music is a world within itself, it’s a language we all understand.” – Stevie Wonder",
  "“If something happened where I couldn’t write music anymore, it would kill me. It’s not just a job. It’s not just a hobby. It’s why I get up in the morning.” – Hans Zimmer",
  "“Your inner voice is the voice of divinity. To hear it, we need to be in solitude, even in crowded places.” – A. R. Rahman"
];

/**
 * Last-resort command list, used only when the bot's `/api/v1/commands`
 * endpoint cannot be reached. The live catalogue is the source of truth — see
 * `src/lib/bot-catalogue.ts`.
 */
export const fallbackCommands = [
	{ name: 'play', description: 'Search or paste a link and start playing instantly.', category: 'music' },
	{ name: 'queue', description: 'See what is lined up next and jump around it.', category: 'music' },
	{ name: 'playlist', description: 'Build your own playlists and share them by code.', category: 'music' },
	{ name: 'autoplay', description: 'Keep the music going once the queue runs dry.', category: 'music' },
	{ name: 'lyrics', description: 'Pull up the lyrics for the track that is playing.', category: 'music' },
	{ name: 'chart', description: 'Your top tracks, artists and listening time.', category: 'music' },
	{ name: 'filter', description: 'Bassboost, nightcore, karaoke and more audio filters.', category: 'music' },
	{ name: 'loop', description: 'Repeat a single track or the whole queue.', category: 'music' },
	{ name: 'skip', description: 'Move on to the next track in the queue.', category: 'music' },
	{ name: 'pause', description: 'Pause playback without losing the queue.', category: 'music' },
	{ name: 'resume', description: 'Pick up exactly where you paused.', category: 'music' },
	{ name: 'volume', description: 'Set playback volume for the whole server.', category: 'music' },
	{ name: 'stop', description: 'Stop playback and clear the queue.', category: 'music' },
	{ name: 'login', description: 'Connect Spotify to queue your own playlists.', category: 'music' },
	{ name: 'logout', description: 'Disconnect a linked account at any time.', category: 'music' },
	{ name: 'dj', description: 'Restrict controls to a DJ role you choose.', category: 'utility' },
	{ name: 'language', description: 'Switch Pepper responses to another language.', category: 'utility' },
	{ name: 'help', description: 'Browse every command with usage examples.', category: 'utility' },
	{ name: 'ping', description: 'Check bot latency and node health.', category: 'utility' },
	{ name: 'feedback', description: 'Send bugs or ideas straight to the developers.', category: 'utility' },
];

/** Platforms Pepper can resolve and stream from. */
export const musicSources = [
	'Spotify',
	'Apple Music',
	'Deezer',
	'SoundCloud',
];

/**
 * The source Pepper deliberately does not stream from, and what it does
 * instead. Shown wherever `musicSources` is, so nobody has to find this out the
 * hard way. See Pepper-Bot `Music.ytToSpotifyQuery`.
 */
export const unsupportedSource = {
	name: 'YouTube',
	summary:
		"YouTube and YouTube Music are not supported — YouTube's terms of service do not allow it.",
	detail:
		'Paste a YouTube or YouTube Music link anyway and Pepper looks the same track up on Spotify and plays that instead, as long as the link points at real music.',
};

/**
 * Last-resort language list, used only when the bot's `/api/v1/languages`
 * endpoint cannot be reached. Matches the locale files in Pepper-Bot `locales/`.
 */
export const fallbackLanguages = [
	{ code: 'en', name: 'English', nativeName: 'English' },
	{ code: 'de', name: 'German', nativeName: 'Deutsch' },
	{ code: 'es', name: 'Spanish', nativeName: 'Español' },
	{ code: 'fr', name: 'French', nativeName: 'Français' },
	{ code: 'pt', name: 'Portuguese', nativeName: 'Português' },
	{ code: 'ru', name: 'Russian', nativeName: 'Русский' },
	{ code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
];

/** Anchor nav shown in the stats hero; ids match the sections rendered below it. */
export const statsSections = [
	{ id: 'live', label: 'Live now' },
	{ id: 'overview', label: 'All time' },
	{ id: 'songs', label: 'Top songs' },
	{ id: 'requesters', label: 'Top requesters' },
	{ id: 'playlists', label: 'Playlists' },
	{ id: 'servers', label: 'Servers' },
];


/** Categories offered on the feedback form; the order is the order they render in. */
export const feedbackCategories: FeedbackCategoryOption[] = [
	{
		value: FeedbackCategory.BUG,
		label: 'Bug report',
		hint: 'Something broke or behaved unexpectedly.',
	},
	{
		value: FeedbackCategory.FEATURE,
		label: 'Feature idea',
		hint: 'A command or option you wish Pepper had.',
	},
	{
		value: FeedbackCategory.AUDIO,
		label: 'Audio quality',
		hint: 'Stuttering, dropouts or anything that sounds wrong.',
	},
	{
		value: FeedbackCategory.GENERAL,
		label: 'Something else',
		hint: 'General thoughts, praise or a question.',
	},
];

/** Shared by the form and the API route so both agree on what is acceptable. */
export const feedbackLimits = {
	messageMin: 15,
	messageMax: 1000,
	usernameMax: 40,
	ratingMin: 1,
	ratingMax: 5,
} as const;

/** Wording used next to each star, and on the Discord post. */
export const feedbackRatingLabels: Record<number, string> = {
	1: 'Rough',
	2: 'Needs work',
	3: 'Does the job',
	4: 'Really good',
	5: 'Love it',
};
