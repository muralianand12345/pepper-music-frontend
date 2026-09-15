import React from 'react';
import { Radio, Users } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatsServers } from '@/types';
import {
	formatDuration,
	formatNumber,
	formatRelativeTime,
	formatSourceName,
} from '@/utils/format';

import { Rank, StatsSection } from './section';

interface StatsServersProps {
	servers: StatsServers | null;
}

const StatsServersCard: React.FC<StatsServersProps> = ({ servers }) => {
	if (!servers?.servers?.length) return null;

	return (
		<StatsSection
			id="servers"
			label="Communities"
			title="Server insights"
			description="The busiest communities on Pepper, ranked by total plays."
		>
			{/* `grid-cols-1` is minmax(0, 1fr): an implicit column sizes to its
			    content, so a long guild name or top track (both `truncate`, so
			    unbreakable) would widen the card past a phone's screen. */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{servers.servers.map((server, index) => (
					<div
						key={server.guildId}
						className="min-w-0 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-foreground/25 hover:bg-surface-hover sm:p-5"
					>
						<div className="flex items-start gap-3">
							<Rank position={index + 1} />

							<Avatar className="size-10 border border-border">
								{server.guildIcon && (
									<AvatarImage
										src={server.guildIcon}
										alt={server.guildName ?? server.guildId}
									/>
								)}
								<AvatarFallback className="bg-surface-hover text-xs text-muted-foreground">
									{(server.guildName ?? 'S').slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<span className="min-w-0 max-w-full truncate font-medium text-foreground">
										{server.guildName ?? `Guild ${server.guildId}`}
									</span>
									{server.live && (
										<span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
											<Radio className="h-3 w-3" /> Live
										</span>
									)}
									{server.memberCount !== null && (
										<span className="flex items-center gap-1 text-xs text-muted-foreground/85">
											<Users className="h-3 w-3" />
											{formatNumber(server.memberCount)}
										</span>
									)}
								</div>

								<div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground/85">
									<span className="font-mono tabular-nums text-foreground/80">
										{formatNumber(server.totalPlays)} plays
									</span>
									<span aria-hidden>·</span>
									<span>{formatNumber(server.uniqueSongs)} songs</span>
									<span aria-hidden>·</span>
									<span>{formatNumber(server.uniqueArtists)} artists</span>
									<span aria-hidden>·</span>
									<span>{formatDuration(server.estimatedPlaytimeMs)}</span>
									<span aria-hidden>·</span>
									<span>{server.averagePlaysPerSong.toFixed(1)} avg/song</span>
									<span aria-hidden>·</span>
									<span>{formatRelativeTime(server.lastPlayedAt)}</span>
								</div>

								{server.sources.length > 0 && (
									<div className="mt-3 flex flex-wrap gap-1.5">
										{server.sources.map((source) => (
											<span
												key={source}
												className="rounded-full border border-border px-2.5 py-0.5 text-[12px] text-muted-foreground"
											>
												{formatSourceName(source)}
											</span>
										))}
									</div>
								)}

								{server.topSong && (
									<p className="mt-3 truncate text-[13px] text-muted-foreground/85">
										Top track:{' '}
										<a
											href={server.topSong.uri}
											target="_blank"
											rel="noopener noreferrer"
											className="text-foreground/80 underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground"
										>
											{server.topSong.title}
										</a>{' '}
										by {server.topSong.author} (
										{formatNumber(server.topSong.plays)} plays)
									</p>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</StatsSection>
	);
};

export default StatsServersCard;
