'use client';

import React from 'react';
import Image from 'next/image';
import {
	Disc3,
	Headphones,
	Loader2,
	Radio,
	Server,
	Users,
	Wifi,
	WifiOff,
} from 'lucide-react';

import StationArt, { VerifiedStationMark } from '@/components/shared/stationArt';
import {
	livePosition,
	onAirTime,
	useNow,
	useRealtimeStats,
} from '@/hooks/use-realtime-stats';
import { StatsRealtime, StatsRealtimeTrack } from '@/types';
import {
	formatCompactNumber,
	formatCountry,
	formatSourceName,
	formatStreamMetadata,
	formatTime,
	formatUptime,
	isLiveDuration,
	repairMojibake,
} from '@/utils/format';

import { EmptyState, StatsSection } from './section';
import { CellGrid } from '@/components/shared/page/parts';
import { StatTile } from './statTile';

const POLL_INTERVAL_MS = 15_000;
const INITIAL_VISIBLE_TRACKS = 12;

interface StatsRealtimeCardProps {
	/** Snapshot rendered on the server; refreshed client-side from /api/stats/realtime. */
	initialData: StatsRealtime | null;
}

const NowPlayingRow: React.FC<{
	track: StatsRealtimeTrack;
	elapsedMs: number;
}> = ({ track, elapsedMs }) => {
	const { radio } = track;
	const position = livePosition(track, elapsedMs);
	const live = isLiveDuration(track.duration);
	const percentage = live ? 0 : Math.min((position / track.duration) * 100, 100);

	// On radio the station is the headline and links to its homepage, not the raw
	// audio stream; whatever the stream says is on sits underneath, when it says.
	const title = radio ? radio.name : repairMojibake(track.title);
	const link = radio ? radio.homepage : track.uri;
	const nowOn = radio ? formatStreamMetadata(track.title, track.author, radio.name) : null;
	const subtitle = radio ? (nowOn ?? radio.genre) : repairMojibake(track.author);
	const country = radio ? formatCountry(radio.country) : null;

	return (
		<div className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-hover">
			{radio ? (
				<StationArt src={radio.artworkUrl ?? track.artworkUrl} className="size-12" />
			) : (
				<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-surface-hover">
					{track.artworkUrl ? (
						<Image
							src={track.artworkUrl}
							alt={track.title}
							fill
							sizes="48px"
							className="object-cover"
						/>
					) : (
						<Disc3 className="absolute inset-0 m-auto h-5 w-5 text-foreground/45" />
					)}
				</div>
			)}

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<div className="flex min-w-0 items-center gap-1.5">
							{link ? (
								<a
									href={link}
									target="_blank"
									rel="noopener noreferrer"
									className="block truncate font-medium text-foreground transition-colors hover:text-muted-foreground"
								>
									{title}
								</a>
							) : (
								<span className="block truncate font-medium text-foreground">
									{title}
								</span>
							)}
							{radio?.source === 'curated' && <VerifiedStationMark />}
						</div>
						<p className="truncate text-sm text-muted-foreground/85">{subtitle}</p>
					</div>

					<div className="flex shrink-0 items-center gap-2">
						<span
							className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
								track.paused
									? 'border-border text-muted-foreground'
									: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
							}`}
						>
							{track.paused ? 'Paused' : radio ? 'On air' : 'Playing'}
						</span>
						<span className="flex items-center gap-1 text-xs text-muted-foreground/85">
							<Headphones className="h-3 w-3" />
							{track.listeners}
						</span>
					</div>
				</div>

				{/* A stream has no end, so there is nothing for the bar to fill towards. */}
				<div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
					{!live && (
						<div
							className="h-full rounded-full bg-foreground/70"
							style={{ width: `${percentage}%` }}
						/>
					)}
				</div>

				<div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground/85">
					{radio ? (
						<>
							<span className="inline-flex items-center gap-1.5">
								<Radio aria-hidden className="h-3 w-3 text-foreground/80" />
								<span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/80">
									Radio
								</span>
								<span className="font-mono tabular-nums">
									{formatTime(onAirTime(track, elapsedMs))} on air
								</span>
							</span>
							{/* The genre is already the subtitle when the stream sends no metadata. */}
							{nowOn && (
								<>
									<span aria-hidden>·</span>
									<span>{radio.genre}</span>
								</>
							)}
							{country && (
								<>
									<span aria-hidden>·</span>
									<span>{country}</span>
								</>
							)}
						</>
					) : (
						<>
							{live ? (
								<span className="inline-flex items-center gap-1.5">
									<span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/80">
										Live
									</span>
									<span className="font-mono tabular-nums">
										{formatTime(position)} on air
									</span>
								</span>
							) : (
								<span className="font-mono tabular-nums">
									{formatTime(position)} / {formatTime(track.duration)}
								</span>
							)}
							<span aria-hidden>·</span>
							<span>{formatSourceName(track.sourceName)}</span>
							{track.queueSize > 0 && (
								<>
									<span aria-hidden>·</span>
									<span>{track.queueSize} in queue</span>
								</>
							)}
						</>
					)}
					{track.requester?.username && (
						<>
							<span aria-hidden>·</span>
							<span className="truncate">by {track.requester.username}</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export const StatsRealtimeCard: React.FC<StatsRealtimeCardProps> = ({
	initialData,
}) => {
	const { data, stale, refreshing, fetchedAt } = useRealtimeStats(
		initialData,
		POLL_INTERVAL_MS
	);
	// Ticks the progress bars forward between polls.
	const now = useNow();
	const [expanded, setExpanded] = React.useState(false);

	if (!data) {
		return (
			<StatsSection
				id="live"
				label="Right now"
				title="Live activity"
				description="A direct read from the bot, refreshed every few seconds."
			>
				<div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-6 py-10 text-sm text-muted-foreground">
					<WifiOff className="h-5 w-5 text-muted-foreground/85" />
					Live stats are unavailable right now.
				</div>
			</StatsSection>
		);
	}

	const elapsedMs = Math.max(now - fetchedAt, 0);
	const tracks = expanded
		? data.nowPlaying
		: data.nowPlaying.slice(0, INITIAL_VISIBLE_TRACKS);
	const hiddenCount = data.nowPlaying.length - tracks.length;
	const onRadio = data.nowPlaying.filter((track) => track.radio).length;

	return (
		<StatsSection
			id="live"
			label="Right now"
			title="Live activity"
			description={`A direct read from the bot, refreshed every ${
				POLL_INTERVAL_MS / 1000
			} seconds.`}
			action={
				<span
					className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] ${
						stale
							? 'border-border text-muted-foreground'
							: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
					}`}
				>
					{stale ? (
						<>
							<WifiOff className="h-3 w-3" /> Reconnecting
						</>
					) : refreshing ? (
						<>
							<Loader2 className="h-3 w-3 animate-spin" /> Updating
						</>
					) : (
						<>
							<Wifi className="h-3 w-3" /> Live
						</>
					)}
				</span>
			}
		>
			<CellGrid className="grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				<StatTile
					icon={<Disc3 className="h-4 w-4" />}
					label="Active players"
					value={String(data.playing)}
					hint={`${data.paused} paused · ${data.idle} idle${
						onRadio ? ` · ${onRadio} on radio` : ''
					}`}
				/>
				<StatTile
					icon={<Headphones className="h-4 w-4" />}
					label="Listening now"
					value={formatCompactNumber(data.listeners)}
				/>
				<StatTile
					icon={<Server className="h-4 w-4" />}
					label="Servers"
					value={formatCompactNumber(data.guilds)}
				/>
				<StatTile
					icon={<Users className="h-4 w-4" />}
					label="Members reached"
					value={formatCompactNumber(data.members)}
				/>
				<StatTile
					icon={<Radio className="h-4 w-4" />}
					label="Shards"
					value={String(data.shards)}
					hint={`${formatCompactNumber(data.channels)} channels`}
				/>
				<StatTile
					icon={<Wifi className="h-4 w-4" />}
					label="Uptime"
					value={formatUptime(data.uptime)}
				/>
			</CellGrid>

			<div className="mt-8">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
						Now playing ({data.nowPlaying.length})
					</h3>
				</div>

				{data.nowPlaying.length === 0 ? (
					<EmptyState message="Nothing is playing at the moment. Start a track and it will show up here." />
				) : (
					<>
						<div className="overflow-hidden rounded-lg border border-border">
							<div className="divide-y divide-border">
								{tracks.map((track) => (
									<NowPlayingRow
										key={`${track.guildId}-${track.uri}`}
										track={track}
										elapsedMs={elapsedMs}
									/>
								))}
							</div>
						</div>

						{(hiddenCount > 0 || expanded) && (
							<button
								type="button"
								onClick={() => setExpanded((value) => !value)}
								className="mt-4 w-full rounded-lg border border-border py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-foreground/30 hover:bg-surface-hover hover:text-foreground"
							>
								{expanded
									? 'Show fewer'
									: `Show ${hiddenCount} more ${
											hiddenCount === 1 ? 'track' : 'tracks'
										}`}
							</button>
						)}
					</>
				)}
			</div>
		</StatsSection>
	);
};

export default StatsRealtimeCard;
