import React from 'react';
import { Globe, ListMusic, Lock, Play } from 'lucide-react';

import { CellGrid } from '@/components/shared/page/parts';
import { StatsPlaylists } from '@/types';
import { formatNumber } from '@/utils/format';

import PlaylistList from './playlistList';
import { EmptyState, StatsSection } from './section';
import { StatTile } from './statTile';

interface StatsPlaylistsProps {
	playlists: StatsPlaylists | null;
}

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
			description="Built by listeners with /playlist and shared by code — open one to see its songs. Private playlists are only ever counted; nothing else about them is shown."
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
					<PlaylistList playlists={playlists.playlists} />
				) : (
					<EmptyState message={emptyMessage} />
				)}
			</div>
		</StatsSection>
	);
};

export default StatsPlaylistsCard;
