import React from 'react';
import { Globe, ListMusic, Lock, Play, UserRound } from 'lucide-react';

import { CellGrid } from '@/components/shared/page/parts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatsPlaylists } from '@/types';
import { formatNumber, formatRelativeTime } from '@/utils/format';

import PlaylistCode from './playlistCode';
import { EmptyState, Rank, StatsSection } from './section';
import { StatTile } from './statTile';

interface StatsPlaylistsProps {
	playlists: StatsPlaylists | null;
}

const plural = (count: number, word: string): string =>
	`${formatNumber(count)} ${word}${count === 1 ? '' : 's'}`;

const StatsPlaylistsCard: React.FC<StatsPlaylistsProps> = ({ playlists }) => {
	// Bots older than 5.14.0 have no playlists endpoint — leave the section out
	// rather than render a row of zeros that looks like nobody uses the feature.
	if (!playlists) return null;

	const emptyMessage =
		playlists.totalPlaylists === 0
			? 'Nobody has built a playlist yet. Start one with /playlist create.'
			: 'No public playlist has been played yet. Make one public with /playlist visibility and share its code.';

	return (
		<StatsSection
			id="playlists"
			label="Playlists"
			title="Most played public playlists"
			description="Built by listeners with /playlist and shared by code. Private playlists are only ever counted — nothing else about them is shown."
			action={
				<span className="rounded-full border border-border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70">
					Paste a code into /play
				</span>
			}
		>
			<CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
				<StatTile
					icon={<ListMusic className="h-4 w-4" />}
					label="Playlists created"
					value={formatNumber(playlists.totalPlaylists)}
				/>
				<StatTile
					icon={<Globe className="h-4 w-4" />}
					label="Public"
					value={formatNumber(playlists.publicPlaylists)}
				/>
				<StatTile
					icon={<Lock className="h-4 w-4" />}
					label="Private"
					value={formatNumber(playlists.privatePlaylists)}
				/>
				<StatTile
					icon={<Play className="h-4 w-4" />}
					label="Public playlist plays"
					value={formatNumber(playlists.publicPlays)}
				/>
			</CellGrid>

			<div className="mt-4">
				{playlists.playlists.length ? (
					<div className="overflow-hidden rounded-lg border border-border">
						<div className="divide-y divide-border">
							{playlists.playlists.map((playlist) => (
								<div
									key={playlist.code}
									className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover"
								>
									<Rank position={playlist.rank} />

									<div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded bg-surface-hover sm:flex">
										<ListMusic className="h-5 w-5 text-foreground/45" />
									</div>

									<div className="min-w-0 flex-1">
										<div className="flex items-center justify-between gap-3">
											<span className="truncate font-medium text-foreground">
												{playlist.name}
											</span>
											<span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
												{plural(playlist.playCount, 'play')}
											</span>
										</div>
										<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground/85">
											<a
												href={`https://discord.com/users/${playlist.ownerId}`}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-foreground"
											>
												<Avatar className="size-4 border border-border">
													{playlist.ownerAvatar && (
														<AvatarImage
															src={playlist.ownerAvatar}
															alt=""
														/>
													)}
													<AvatarFallback className="bg-surface-hover text-muted-foreground">
														<UserRound className="h-2.5 w-2.5" />
													</AvatarFallback>
												</Avatar>
												<span className="max-w-[10rem] truncate">
													{playlist.ownerUsername ?? playlist.ownerId}
												</span>
											</a>
											<span aria-hidden>·</span>
											<span>{plural(playlist.trackCount, 'song')}</span>
											{playlist.lastPlayedAt && (
												<>
													<span aria-hidden>·</span>
													<span>
														played {formatRelativeTime(playlist.lastPlayedAt)}
													</span>
												</>
											)}
										</div>
										{/* On a phone the code drops under the details so the name keeps the width. */}
										<PlaylistCode
											code={playlist.code}
											name={playlist.name}
											className="mt-2 sm:hidden"
										/>
									</div>

									<PlaylistCode
										code={playlist.code}
										name={playlist.name}
										className="hidden sm:inline-flex"
									/>
								</div>
							))}
						</div>
					</div>
				) : (
					<EmptyState message={emptyMessage} />
				)}
			</div>
		</StatsSection>
	);
};

export default StatsPlaylistsCard;
