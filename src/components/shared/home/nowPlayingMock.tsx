'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	ArrowRight,
	Disc3,
	Headphones,
	ListMusic,
	Repeat2,
	SkipForward,
} from 'lucide-react';

import { livePosition, useNow, useRealtimeStats } from '@/hooks/use-realtime-stats';
import { StatsRealtime, StatsRealtimeTrack } from '@/types';
import { formatSourceName, formatTime } from '@/utils/format';

/**
 * What Pepper puts in the channel after `/play` — using a track that is really
 * playing in some server right now, when there is one.
 *
 * The snapshot comes from the same cached realtime read as the hero metrics and
 * is refreshed at half the stats page's rate: this is a teaser, and a song
 * rarely ends inside thirty seconds. When nothing is playing, or the bot cannot
 * be reached, it falls back to the illustrative example below. That state never
 * carries the Live badge, so it cannot pass for a reading.
 */

const POLL_INTERVAL_MS = 30_000;

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

/**
 * Keeps showing the current track while it is still playing, so a poll does not
 * swap it mid-song; otherwise features the one with the most people listening.
 */
const pickTrack = (
	tracks: StatsRealtimeTrack[],
	currentKey: string | null
): StatsRealtimeTrack | null => {
	const playing = tracks.filter((track) => track.playing && !track.paused);
	return (
		playing.find((track) => trackKey(track) === currentKey) ??
		[...playing].sort(
			(a, b) => b.listeners - a.listeners || a.guildId.localeCompare(b.guildId)
		)[0] ??
		null
	);
};

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
		className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--pepper-face)] ring-1 ring-inset ring-foreground/10 ${
			spinning ? 'motion-safe:animate-[spin_6s_linear_infinite]' : ''
		}`}
	>
		<span className="absolute inset-[7px] rounded-full border border-white/15" />
		<span className="absolute inset-[13px] rounded-full border border-white/10" />
		<Disc3 className="relative h-4 w-4 text-[var(--pepper-red)]" />
	</span>
);

const NowPlayingMock = ({ initialData }: { initialData: StatsRealtime | null }) => {
	const { data, fetchedAt } = useRealtimeStats(initialData, POLL_INTERVAL_MS);
	const currentKey = React.useRef<string | null>(null);
	const track = data ? pickTrack(data.nowPlaying, currentKey.current) : null;
	// The example never moves, so there is nothing to tick for.
	const now = useNow(track ? 1000 : null);

	React.useEffect(() => {
		currentKey.current = track ? trackKey(track) : null;
	});

	const liveCount = data
		? data.nowPlaying.filter((item) => item.playing && !item.paused).length
		: 0;
	const position = track
		? livePosition(track, Math.max(now - fetchedAt, 0))
		: example.positionMs;
	const duration = track ? track.duration : example.durationMs;
	const percentage = duration ? Math.min((position / duration) * 100, 100) : 0;

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
							Playing in a server right now
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
					Now playing
				</p>

				<div className="mt-3 flex items-center gap-3.5">
					{track?.artworkUrl ? (
						// The record slides out from behind the sleeve and turns while it plays.
						<span className="relative h-12 w-[4.5rem] shrink-0">
							<span className="absolute right-0 top-0">
								<Vinyl spinning />
							</span>
							<span className="absolute left-0 top-0 h-12 w-12 overflow-hidden rounded-md shadow-md ring-1 ring-foreground/10">
								<Image
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
							{track?.uri ? (
								<a
									href={track.uri}
									target="_blank"
									rel="noopener noreferrer"
									className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground transition-colors hover:text-muted-foreground"
								>
									{track.title}
								</a>
							) : (
								<p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
									{track ? track.title : example.title}
								</p>
							)}
							<Equalizer />
						</div>
						<p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[13px] text-muted-foreground">
							{track ? (
								<>
									<span className="truncate">{track.author}</span>
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

				{/* Scrubber */}
				<div className="mt-4">
					<div
						aria-hidden
						className="h-1 overflow-hidden rounded-full bg-surface-strong"
					>
						<div
							className="h-full rounded-full bg-[var(--pepper-red)] transition-[width] duration-1000 ease-linear"
							style={{ width: `${percentage}%` }}
						/>
					</div>
					<div className="mt-2 flex items-center justify-between font-mono text-[11px] tabular-nums text-muted-foreground">
						<span>{formatTime(position)}</span>
						<span>{duration ? formatTime(duration) : 'Live'}</span>
					</div>
				</div>
			</div>

			{/* Controls */}
			<div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
				{[
					{ icon: <SkipForward className="h-3.5 w-3.5" />, label: 'Skip' },
					{ icon: <Repeat2 className="h-3.5 w-3.5" />, label: 'Loop' },
					{ icon: <ListMusic className="h-3.5 w-3.5" />, label: 'Queue' },
				].map((control) => (
					<span
						key={control.label}
						className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-foreground/80"
					>
						{control.icon}
						{control.label}
					</span>
				))}
				{track ? (
					<Link
						href="/stats"
						className="group ml-auto inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
					>
						{liveCount} playing now
						<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
					</Link>
				) : (
					<span className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
						{example.source}
					</span>
				)}
			</div>
		</div>
	);
};

export default NowPlayingMock;
