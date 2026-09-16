import React from 'react';
import Image from 'next/image';
import { Disc3 } from 'lucide-react';

import { StatsSongs } from '@/types';
import {
	formatNumber,
	formatRelativeTime,
	formatSourceName,
	formatTime,
} from '@/utils/format';

import { EmptyState, Rank, StatsSection } from './section';

interface StatsMusicPageProps {
	songs: StatsSongs | null;
}

const StatsMusicPage: React.FC<StatsMusicPageProps> = ({ songs }) => {
	if (!songs?.topSongs?.length) {
		return (
			<StatsSection
				id="songs"
				label="Leaderboard"
				title="Global top songs"
				description="The most played tracks across every server Pepper is in."
			>
				<EmptyState message="No music data available yet." />
			</StatsSection>
		);
	}

	return (
		<StatsSection
			id="songs"
			label="Leaderboard"
			title="Global top songs"
			description={`The most played tracks across every server Pepper is in — ${formatNumber(
				songs.totalPlays
			)} plays counted.`}
			action={
				<span className="rounded-full border border-border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70">
					Top {songs.topSongs.length} of {formatNumber(songs.uniqueSongs)}
				</span>
			}
		>
			<div className="overflow-hidden rounded-lg border border-border">
				<div className="divide-y divide-border">
					{songs.topSongs.map((song, index) => {
						const artwork = song.artworkUrl || song.thumbnail;
						return (
							<div
								key={song.uri || song.identifier}
								className="flex items-center px-4 py-3 transition-colors hover:bg-surface-hover"
							>
								<Rank position={index + 1} />

								<div className="relative mx-3 h-11 w-11 shrink-0 overflow-hidden rounded bg-surface-hover">
									{artwork ? (
										<Image
											src={artwork}
											alt={song.title}
											fill
											sizes="44px"
											className="object-cover"
										/>
									) : (
										<Disc3 className="absolute inset-0 m-auto h-5 w-5 text-foreground/45" />
									)}
								</div>

								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between gap-3">
										<a
											href={song.uri}
											target="_blank"
											rel="noopener noreferrer"
											className="truncate font-medium text-foreground transition-colors hover:text-muted-foreground"
										>
											{song.title}
										</a>
										<span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
											{formatNumber(song.played_number)} plays
										</span>
									</div>
									<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground/85">
										<span className="max-w-[14rem] truncate">
											{song.author}
										</span>
										<span aria-hidden>·</span>
										<span>{song.isStream ? 'Live' : formatTime(song.duration)}</span>
										<span aria-hidden>·</span>
										<span>{formatSourceName(song.sourceName)}</span>
										<span aria-hidden>·</span>
										<span>{formatRelativeTime(song.timestamp)}</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</StatsSection>
	);
};

export default StatsMusicPage;
