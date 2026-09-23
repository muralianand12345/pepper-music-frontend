'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	ArrowRight,
	AudioLines,
	Disc3,
	Headphones,
	ListMusic,
	Repeat2,
	SkipForward,
} from 'lucide-react';

import StationArt, { VerifiedStationMark } from '@/components/shared/stationArt';
import {
	livePosition,
	onAirTime,
	useNow,
	useRealtimeStats,
} from '@/hooks/use-realtime-stats';
import { cn } from '@/lib/utils';
import { StatsRealtime, StatsRealtimeTrack } from '@/types';
import {
	formatStreamMetadata,
	formatTime,
	isLiveDuration,
	repairMojibake,
} from '@/utils/format';

/**
 * What Pepper puts in the channel after `/play` — using a track that is really
 * playing in some server right now, when there is one.
 *
 * The snapshot comes from the same cached realtime read as the hero metrics and
 * stays live on the same stream as the stats page. When nothing is playing, or
 * the bot cannot be reached, it falls back to the illustrative example below.
 * That state never carries the Live badge, so it cannot pass for a reading.
 *
 * The controls browse what is playing across Pepper; they only change what this
 * card shows. Nothing here can reach a real player — these are other people's
 * servers.
 */

/** How long Loop lingers on each song before moving to the next. */
const LOOP_INTERVAL_MS = 12_000;

/** Placeholder copy for the fallback; not a real response. */
const example = {
	query: 'kite season — nightshift',
	title: 'Nightshift',
	subtitle: 'Kite Season · added by you',
	positionMs: 84_000,
	durationMs: 232_000,
	source: 'Spotify',
};

const trackKey = (track: StatsRealtimeTrack) => `${track.guildId}:${track.uri}`;

const isPlaying = (track: StatsRealtimeTrack) => track.playing && !track.paused;

/**
 * Headline and subtitle for a reading. On radio that is the station, with what
 * the stream says is on (or the genre) underneath; otherwise the song and artist.
 */
const describe = (track: StatsRealtimeTrack) =>
	track.radio
		? {
				title: track.radio.name,
				link: track.radio.homepage,
				subtitle:
					formatStreamMetadata(track.title, track.author, track.radio.name) ??
					track.radio.genre,
			}
		: {
				title: repairMojibake(track.title),
				link: track.uri,
				subtitle: repairMojibake(track.author),
			};

/** Busiest first; the guild id only breaks ties, so the order holds still between renders. */
const byListeners = (a: StatsRealtimeTrack, b: StatsRealtimeTrack) =>
	b.listeners - a.listeners || a.guildId.localeCompare(b.guildId);

const Equalizer = () => (
	<span aria-hidden className="flex h-4 shrink-0 items-end gap-[3px]">
		{[0, 1, 2, 3, 4].map((bar) => (
			<span
				key={bar}
				className="eq__bar block h-full w-[3px] rounded-full bg-[var(--pepper-red)]"
			/>
		))}
	</span>
);

/** Vinyl, echoing the turntable in the Pepper wordmark. */
const Vinyl = ({ spinning = false }: { spinning?: boolean }) => (
	<span
		aria-hidden
		className={cn(
			'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--pepper-face)] ring-1 ring-inset ring-foreground/10',
			spinning && 'motion-safe:animate-[spin_6s_linear_infinite]'
		)}
	>
		<span className="absolute inset-[7px] rounded-full border border-white/15" />
		<span className="absolute inset-[13px] rounded-full border border-white/10" />
		<Disc3 className="relative h-4 w-4 text-[var(--pepper-red)]" />
	</span>
);

const controlClass =
	'inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-foreground/80 outline-none transition-colors hover:border-foreground/25 hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45';

const activeControlClass =
	'border-[var(--pepper-red)]/45 bg-[var(--pepper-red)]/10 text-[var(--pepper-red)] hover:border-[var(--pepper-red)]/60 hover:bg-[var(--pepper-red)]/15 hover:text-[var(--pepper-red)]';

const NowPlayingMock = ({ initialData }: { initialData: StatsRealtime | null }) => {
	const { data, fetchedAt } = useRealtimeStats(initialData);
	const [currentKey, setCurrentKey] = React.useState<string | null>(null);
	const [looping, setLooping] = React.useState(false);
	const [queueOpen, setQueueOpen] = React.useState(false);
	const queueId = React.useId();

	const playing = data ? data.nowPlaying.filter(isPlaying).sort(byListeners) : [];
	// The example never moves, so there is nothing to tick for.
	const now = useNow(playing.length ? 1000 : null);
	const elapsedMs = Math.max(now - fetchedAt, 0);

	// A song that has run out since the last update drops off, so the card moves on
	// instead of parking on a full bar — unless every song has, in which case the
	// last reading beats flashing the example until the next update.
	const unfinished = playing.filter(
		(track) =>
			isLiveDuration(track.duration) || livePosition(track, elapsedMs) < track.duration
	);
	const queue = unfinished.length ? unfinished : playing;
	const track = queue.find((item) => trackKey(item) === currentKey) ?? queue[0] ?? null;
	const trackIndex = track ? queue.indexOf(track) : -1;
	const canSkip = queue.length > 1;

	// Remember what is on screen, so an update that reorders the list does not swap
	// it mid-song.
	React.useEffect(() => {
		const key = track ? trackKey(track) : null;
		if (key !== currentKey) setCurrentKey(key);
	}, [track, currentKey]);

	const skip = () => {
		if (!canSkip) return;
		setCurrentKey(trackKey(queue[(trackIndex + 1) % queue.length]));
	};

	const skipRef = React.useRef(skip);
	React.useEffect(() => {
		skipRef.current = skip;
	});

	// Loop moves on after a while on each song. Keyed on the song too, so a manual
	// skip or pick restarts the wait instead of cutting the next song short.
	React.useEffect(() => {
		if (!looping || !canSkip) return;
		const timer = setTimeout(() => skipRef.current(), LOOP_INTERVAL_MS);
		return () => clearTimeout(timer);
	}, [looping, canSkip, currentKey]);

	const radio = track?.radio ?? null;
	const details = track ? describe(track) : null;
	const duration = track ? track.duration : example.durationMs;
	// Radio and other streams report an endless duration: count time on air instead.
	const live = isLiveDuration(duration);
	const position = !track
		? example.positionMs
		: live
			? onAirTime(track, elapsedMs)
			: livePosition(track, elapsedMs);
	const percentage = live ? 0 : Math.min((position / duration) * 100, 100);

	return (
		<div className="overflow-hidden rounded-xl border border-border bg-surface">
			{/* Header: the command for the example; a live marker for a real track,
			    which may have been queued by autoplay or a playlist rather than typed. */}
			<div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
				<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
					P
				</span>
				{track ? (
					<>
						<p className="min-w-0 truncate text-[13px] text-muted-foreground">
							{radio ? 'Streaming radio in a server right now' : 'Playing in a server right now'}
						</p>
						<span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/40 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
							<span className="relative flex h-1.5 w-1.5">
								<span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />
								<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
							</span>
							Live
						</span>
					</>
				) : (
					<code className="min-w-0 truncate font-mono text-[13px] text-foreground">
						<span className="font-semibold">/play</span>{' '}
						<span className="text-muted-foreground">query: {example.query}</span>
					</code>
				)}
			</div>

			{/* Response */}
			<div className="p-4">
				<p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
					{radio ? 'On air' : 'Now playing'}
					{canSkip && (
						<span className="text-muted-foreground/70">
							{' '}
							· {trackIndex + 1} of {queue.length}
						</span>
					)}
				</p>

				<div className="mt-3 flex items-center gap-3.5">
					{radio ? (
						// A station has no record to spin — just its logo.
						<StationArt
							src={radio.artworkUrl ?? track?.artworkUrl}
							className="size-12 rounded-md"
						/>
					) : track?.artworkUrl ? (
						// The record slides out from behind the sleeve and turns while it plays.
						<span className="relative h-12 w-[4.5rem] shrink-0">
							<span className="absolute right-0 top-0">
								<Vinyl spinning />
							</span>
							<span className="absolute left-0 top-0 h-12 w-12 overflow-hidden rounded-md shadow-md ring-1 ring-foreground/10">
								<Image
									key={track.artworkUrl}
									src={track.artworkUrl}
									alt=""
									fill
									sizes="48px"
									className="object-cover"
								/>
							</span>
						</span>
					) : (
						<Vinyl spinning={!!track} />
					)}

					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2.5">
							{details?.link ? (
								<a
									href={details.link}
									target="_blank"
									rel="noopener noreferrer"
									className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground transition-colors hover:text-muted-foreground"
								>
									{details.title}
								</a>
							) : (
								<p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
									{details ? details.title : example.title}
								</p>
							)}
							{radio?.source === 'curated' && <VerifiedStationMark />}
							<Equalizer />
						</div>
						<p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[13px] text-muted-foreground">
							{track && details ? (
								<>
									<span className="truncate">{details.subtitle}</span>
									{track.listeners > 0 && (
										<>
											<span aria-hidden>·</span>
											<span className="inline-flex shrink-0 items-center gap-1">
												<Headphones className="h-3 w-3" />
												{track.listeners} listening
											</span>
										</>
									)}
								</>
							) : (
								<span className="truncate">{example.subtitle}</span>
							)}
						</p>
					</div>
				</div>

				{/* Scrubber. Width only animates while a song plays through; a skip
				    jumps straight to the new song's position. */}
				<div className="mt-4">
					<div
						aria-hidden
						className="h-1 overflow-hidden rounded-full bg-surface-strong"
					>
						<div
							key={track ? trackKey(track) : 'example'}
							className="h-full rounded-full bg-[var(--pepper-red)] transition-[width] duration-1000 ease-linear"
							style={{ width: `${percentage}%` }}
						/>
					</div>
					<div className="mt-2 flex items-center justify-between font-mono text-[11px] tabular-nums text-muted-foreground">
						<span>{live ? `${formatTime(position)} on air` : formatTime(position)}</span>
						<span>{radio ? 'Radio' : live ? 'Live' : formatTime(duration)}</span>
					</div>
				</div>
			</div>

			{/* Controls */}
			<div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
				<button
					type="button"
					onClick={skip}
					disabled={!canSkip}
					title={
						canSkip
							? 'Show the next song playing on Pepper'
							: 'Nothing else is playing right now'
					}
					className={controlClass}
				>
					<SkipForward className="h-3.5 w-3.5" />
					Skip
				</button>
				<button
					type="button"
					onClick={() => setLooping((value) => !value)}
					disabled={!canSkip}
					aria-pressed={looping && canSkip}
					title="Cycle through every song playing on Pepper"
					className={cn(controlClass, looping && canSkip && activeControlClass)}
				>
					<Repeat2 className="h-3.5 w-3.5" />
					Loop
				</button>
				<button
					type="button"
					onClick={() => setQueueOpen((value) => !value)}
					aria-expanded={queueOpen}
					aria-controls={queueId}
					title="See everything playing on Pepper"
					className={cn(controlClass, queueOpen && activeControlClass)}
				>
					<ListMusic className="h-3.5 w-3.5" />
					Queue
					{queue.length > 0 && (
						<span className="font-mono tabular-nums opacity-70">{queue.length}</span>
					)}
				</button>
				{track ? (
					<Link
						href="/stats"
						className="group ml-auto inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
					>
						Live stats
						<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
					</Link>
				) : (
					<span className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
						{example.source}
					</span>
				)}
			</div>

			{/* Queue */}
			<div id={queueId} hidden={!queueOpen} className="border-t border-border">
				{queue.length ? (
					<>
						<p className="px-4 pb-1 pt-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Playing across Pepper · pick one to show it
						</p>
						<ol className="max-h-60 overflow-y-auto pb-1.5">
							{queue.map((item, index) => {
								const active = item === track;
								const itemDetails = describe(item);
								return (
									<li key={trackKey(item)}>
										<button
											type="button"
											onClick={() => setCurrentKey(trackKey(item))}
											aria-current={active || undefined}
											className={cn(
												'flex w-full items-center gap-3 px-4 py-2 text-left outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover',
												active && 'bg-surface-hover'
											)}
										>
											<span className="flex w-5 shrink-0 justify-end font-mono text-[11px] tabular-nums text-muted-foreground">
												{active ? (
													<AudioLines className="h-3.5 w-3.5 text-[var(--pepper-red)]" />
												) : (
													index + 1
												)}
											</span>
											{item.radio ? (
												<StationArt
													src={item.radio.artworkUrl ?? item.artworkUrl}
													className="size-8"
													iconClassName="h-3.5 w-3.5"
												/>
											) : (
												<span className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-surface-strong">
													{item.artworkUrl ? (
														<Image
															src={item.artworkUrl}
															alt=""
															fill
															sizes="32px"
															className="object-cover"
														/>
													) : (
														<Disc3 className="absolute inset-0 m-auto h-3.5 w-3.5 text-foreground/45" />
													)}
												</span>
											)}
											<span className="min-w-0 flex-1">
												<span className="block truncate text-[13px] font-medium text-foreground">
													{itemDetails.title}
												</span>
												<span className="block truncate text-[12px] text-muted-foreground">
													{item.radio ? `Radio · ${itemDetails.subtitle}` : itemDetails.subtitle}
												</span>
											</span>
											<span className="inline-flex shrink-0 items-center gap-1 text-[12px] text-muted-foreground">
												<Headphones className="h-3 w-3" />
												{item.listeners}
											</span>
										</button>
									</li>
								);
							})}
						</ol>
					</>
				) : (
					<p className="px-4 py-4 text-[13px] leading-relaxed text-muted-foreground">
						{data
							? 'Nothing is playing on Pepper right now — this is an example of what it looks like.'
							: "Live data isn't available right now — this is an example of what it looks like."}{' '}
						<Link
							href="/stats"
							className="font-medium text-foreground/80 underline decoration-foreground/35 underline-offset-4 hover:decoration-foreground"
						>
							See live stats
						</Link>
					</p>
				)}
			</div>
		</div>
	);
};

export default NowPlayingMock;
