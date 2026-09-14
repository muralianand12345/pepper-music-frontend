'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight, Disc3, ListMusic, RotateCw, UserRound } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { StatsPlaylistDetail, StatsPublicPlaylist } from '@/types';
import {
	formatDuration,
	formatNumber,
	formatRelativeTime,
	formatSourceName,
	formatTime,
} from '@/utils/format';

import PlaylistCode from './playlistCode';
import { Rank } from './section';

/** Matches the bot's 60s stats cache, so reopening a playlist inside it costs nothing. */
const DETAIL_FRESH_MS = 60_000;

const plural = (count: number, word: string): string =>
	`${formatNumber(count)} ${word}${count === 1 ? '' : 's'}`;

type DetailState =
	| { status: 'loading' }
	| { status: 'ready'; data: StatsPlaylistDetail }
	| { status: 'error'; message: string };

/** Thrown for failures whose message is fit to show; anything else gets the generic one. */
class DetailError extends Error {}

const OwnerLink = ({
	playlist,
	className,
}: {
	playlist: Pick<StatsPublicPlaylist, 'ownerId' | 'ownerUsername' | 'ownerAvatar'>;
	className?: string;
}) => (
	<a
		href={`https://discord.com/users/${playlist.ownerId}`}
		target="_blank"
		rel="noopener noreferrer"
		className={cn(
			'inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-foreground',
			className
		)}
	>
		<Avatar className="size-4 border border-border">
			{playlist.ownerAvatar && <AvatarImage src={playlist.ownerAvatar} alt="" />}
			<AvatarFallback className="bg-surface-hover text-muted-foreground">
				<UserRound className="h-2.5 w-2.5" />
			</AvatarFallback>
		</Avatar>
		<span className="max-w-[10rem] truncate">
			{playlist.ownerUsername ?? playlist.ownerId}
		</span>
	</a>
);

const PlaylistRow = ({
	playlist,
	onOpen,
}: {
	playlist: StatsPublicPlaylist;
	onOpen: () => void;
}) => (
	<div className="group relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover">
		<Rank position={playlist.rank} />

		<div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded bg-surface-hover sm:flex">
			<ListMusic className="h-5 w-5 text-foreground/45" />
		</div>

		<div className="min-w-0 flex-1">
			<div className="flex items-center justify-between gap-3">
				{/* The name is the real control; its ::after stretches over the whole
				    row so anywhere on it opens the playlist. The owner link and code
				    button sit above that layer so they keep working on their own. */}
				<button
					type="button"
					onClick={onOpen}
					aria-haspopup="dialog"
					className="block min-w-0 truncate text-left font-medium text-foreground outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring"
				>
					{playlist.name}
				</button>
				<span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
					{plural(playlist.playCount, 'play')}
				</span>
			</div>
			<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground/85">
				<OwnerLink playlist={playlist} className="relative z-10" />
				<span aria-hidden>·</span>
				<span>{plural(playlist.trackCount, 'song')}</span>
				{playlist.lastPlayedAt && (
					<>
						<span aria-hidden>·</span>
						<span>played {formatRelativeTime(playlist.lastPlayedAt)}</span>
					</>
				)}
			</div>
			{/* On a phone the code drops under the details so the name keeps the width. */}
			<PlaylistCode
				code={playlist.code}
				name={playlist.name}
				className="relative z-10 mt-2 sm:hidden"
			/>
		</div>

		<PlaylistCode
			code={playlist.code}
			name={playlist.name}
			className="relative z-10 hidden sm:inline-flex"
		/>
		<ChevronRight
			aria-hidden
			className="hidden h-4 w-4 shrink-0 text-foreground/35 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/60 sm:block"
		/>
	</div>
);

const TrackSkeleton = ({ rows }: { rows: number }) => (
	<div className="animate-pulse divide-y divide-border" aria-hidden>
		{Array.from({ length: rows }).map((_, index) => (
			<div key={index} className="flex items-center gap-3 px-6 py-2.5">
				<div className="h-3 w-6 shrink-0 rounded bg-surface-strong" />
				<div className="h-10 w-10 shrink-0 rounded bg-surface-strong" />
				<div className="min-w-0 flex-1">
					<div className="h-3.5 w-3/5 rounded bg-surface-strong" />
					<div className="mt-2 h-3 w-2/5 rounded bg-surface-strong" />
				</div>
				<div className="h-3 w-9 shrink-0 rounded bg-surface-strong" />
			</div>
		))}
	</div>
);

const TrackList = ({ detail }: { detail: StatsPlaylistDetail }) => {
	if (!detail.tracks.length) {
		return (
			<p className="px-6 py-12 text-center text-sm text-muted-foreground/85">
				This playlist has no songs yet.
			</p>
		);
	}

	return (
		<ol className="divide-y divide-border">
			{detail.tracks.map((track) => (
				<li
					key={`${track.position}-${track.uri}`}
					className="flex items-center gap-3 px-6 py-2.5 transition-colors hover:bg-surface-hover"
				>
					<span className="w-6 shrink-0 text-right font-mono text-[13px] tabular-nums text-foreground/45">
						{track.position}
					</span>
					<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-surface-hover">
						{track.artworkUrl ? (
							<Image
								src={track.artworkUrl}
								alt=""
								fill
								sizes="40px"
								className="object-cover"
							/>
						) : (
							<Disc3 className="absolute inset-0 m-auto h-4 w-4 text-foreground/45" />
						)}
					</div>
					<div className="min-w-0 flex-1">
						{track.uri ? (
							<a
								href={track.uri}
								target="_blank"
								rel="noopener noreferrer"
								className="block truncate text-[14px] font-medium text-foreground transition-colors hover:text-muted-foreground"
							>
								{track.title}
							</a>
						) : (
							<span className="block truncate text-[14px] font-medium text-foreground">
								{track.title}
							</span>
						)}
						<p className="truncate text-[13px] text-muted-foreground/85">
							{track.author} · {formatSourceName(track.sourceName)}
						</p>
					</div>
					<span className="shrink-0 font-mono text-[13px] tabular-nums text-muted-foreground">
						{track.isStream ? 'Live' : formatTime(track.duration)}
					</span>
				</li>
			))}
		</ol>
	);
};

const PlaylistDialog = ({
	playlist,
	open,
	onOpenChange,
}: {
	playlist: StatsPublicPlaylist | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const cache = React.useRef(
		new Map<string, { data: StatsPlaylistDetail; at: number }>()
	);
	const [state, setState] = React.useState<DetailState>({ status: 'loading' });
	const [attempt, setAttempt] = React.useState(0);

	React.useEffect(() => {
		if (!open || !playlist) return;

		const hit = cache.current.get(playlist.code);
		if (hit && Date.now() - hit.at < DETAIL_FRESH_MS) {
			setState({ status: 'ready', data: hit.data });
			return;
		}

		const controller = new AbortController();
		setState({ status: 'loading' });

		(async () => {
			try {
				const response = await fetch(
					`/api/stats/playlists/${encodeURIComponent(playlist.code)}`,
					{ signal: controller.signal }
				);
				if (response.status === 429) {
					const wait = Number(response.headers.get('retry-after'));
					throw new DetailError(
						Number.isFinite(wait) && wait > 0
							? `Too many requests — try again in ${wait}s.`
							: 'Too many requests — try again in a moment.'
					);
				}
				if (response.status === 404) {
					throw new DetailError(
						'This playlist is no longer public, or has dropped out of the top list.'
					);
				}
				if (!response.ok) throw new Error(`status ${response.status}`);

				const data = (await response.json()) as StatsPlaylistDetail;
				cache.current.set(playlist.code, { data, at: Date.now() });
				setState({ status: 'ready', data });
			} catch (error) {
				if (controller.signal.aborted) return;
				setState({
					status: 'error',
					message:
						error instanceof DetailError
							? error.message
							: "Couldn't load the songs right now.",
				});
			}
		})();

		return () => controller.abort();
	}, [open, playlist, attempt]);

	// Prefer the freshly fetched numbers once they arrive; the list row is up to a minute old.
	const summary = state.status === 'ready' ? state.data : playlist;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex max-h-[85vh] w-[calc(100%-2rem)] max-w-xl flex-col gap-0 overflow-hidden p-0">
				{playlist && summary && (
					<>
						<DialogHeader className="gap-0 border-b border-border px-6 pb-5 pt-6 text-left sm:text-left">
							<div className="flex items-start gap-3 pr-8">
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
									<ListMusic className="h-5 w-5" />
								</span>
								<div className="min-w-0">
									<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
										Public playlist
									</p>
									<DialogTitle className="mt-1.5 break-words text-lg leading-snug tracking-[-0.01em]">
										{summary.name}
									</DialogTitle>
								</div>
							</div>

							<DialogDescription asChild>
								<div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground/85">
									<OwnerLink playlist={summary} />
									<span aria-hidden>·</span>
									<span>{plural(summary.trackCount, 'song')}</span>
									{state.status === 'ready' && state.data.totalDurationMs > 0 && (
										<>
											<span aria-hidden>·</span>
											<span>{formatDuration(state.data.totalDurationMs)}</span>
										</>
									)}
									<span aria-hidden>·</span>
									<span>{plural(summary.playCount, 'play')}</span>
								</div>
							</DialogDescription>

							<div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
								<PlaylistCode code={playlist.code} name={summary.name} />
								<span className="text-[13px] text-muted-foreground">
									Paste the code into{' '}
									<code className="font-mono text-foreground/80">/play</code> to
									queue it.
								</span>
							</div>
						</DialogHeader>

						<div className="min-h-0 flex-1 overflow-y-auto" aria-busy={state.status === 'loading'}>
							{state.status === 'loading' && (
								<TrackSkeleton rows={Math.min(Math.max(playlist.trackCount, 3), 6)} />
							)}
							{state.status === 'error' && (
								<div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
									<p className="text-sm text-muted-foreground">{state.message}</p>
									<button
										type="button"
										onClick={() => setAttempt((value) => value + 1)}
										className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-foreground/25 hover:bg-surface-hover hover:text-foreground"
									>
										<RotateCw className="h-3.5 w-3.5" />
										Try again
									</button>
								</div>
							)}
							{state.status === 'ready' && <TrackList detail={state.data} />}
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

/** The ranked public playlists; opening one shows its songs, fetched on demand. */
const PlaylistList: React.FC<{ playlists: StatsPublicPlaylist[] }> = ({
	playlists,
}) => {
	// Kept after closing so the dialog still has content while it animates out.
	const [selected, setSelected] = React.useState<StatsPublicPlaylist | null>(null);
	const [open, setOpen] = React.useState(false);

	return (
		<>
			<div className="overflow-hidden rounded-lg border border-border">
				<div className="divide-y divide-border">
					{playlists.map((playlist) => (
						<PlaylistRow
							key={playlist.code}
							playlist={playlist}
							onOpen={() => {
								setSelected(playlist);
								setOpen(true);
							}}
						/>
					))}
				</div>
			</div>

			<PlaylistDialog playlist={selected} open={open} onOpenChange={setOpen} />
		</>
	);
};

export default PlaylistList;
