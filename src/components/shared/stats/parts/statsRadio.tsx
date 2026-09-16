import React from 'react';
import { Clock3, Radio, RadioTower, Tags } from 'lucide-react';

import { CellGrid } from '@/components/shared/page/parts';
import StationArt, { VerifiedStationMark } from '@/components/shared/stationArt';
import { StatsRadio, StatsRadioStation } from '@/types';
import {
	formatCountry,
	formatDuration,
	formatNumber,
	formatRelativeTime,
} from '@/utils/format';

import { EmptyState, Rank, StatsSection } from './section';
import { StatTile } from './statTile';

interface StatsRadioProps {
	radio: StatsRadio | null;
}

const plural = (count: number, word: string): string =>
	`${formatNumber(count)} ${word}${count === 1 ? '' : 's'}`;

const StationRow = ({ station }: { station: StatsRadioStation }) => {
	const country = formatCountry(station.country);
	const onAir = formatDuration(station.totalDurationMs, 2);

	return (
		<li className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover">
			<Rank position={station.rank} />

			<StationArt src={station.artworkUrl} />

			<div className="min-w-0 flex-1">
				<div className="flex min-w-0 items-center gap-1.5">
					<span className="truncate font-medium text-foreground">
						{station.name}
					</span>
					{station.source === 'curated' && <VerifiedStationMark />}
				</div>
				<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground/85">
					{/* Phone only — from `sm` the time on air has a column of its own. */}
					<span className="font-mono tabular-nums text-foreground/80 sm:hidden">
						{formatDuration(station.totalDurationMs, 1)}
					</span>
					<span aria-hidden className="sm:hidden">
						·
					</span>
					<span>{station.genre}</span>
					{country && (
						<>
							<span aria-hidden>·</span>
							<span>{country}</span>
						</>
					)}
					<span aria-hidden>·</span>
					<span>{plural(station.playCount, 'tune-in')}</span>
					<span aria-hidden>·</span>
					<span>played {formatRelativeTime(station.lastPlayed)}</span>
				</div>
			</div>

			<span className="hidden shrink-0 font-mono text-sm tabular-nums text-muted-foreground sm:block">
				{onAir}
			</span>
		</li>
	);
};

const StatsRadioCard: React.FC<StatsRadioProps> = ({ radio }) => {
	// Bots older than 5.15.0 have no radio endpoint — leave the section out.
	if (!radio) return null;

	const { summary, topStations } = radio;

	return (
		<StatsSection
			id="radio"
			label="Radio"
			title="Most tuned-in stations"
			description="Live stations streamed with /radio, ranked by time on air. A tick marks a station Pepper has hand-picked and tested; the rest come from the Radio Browser directory. Radio is counted apart from music, so it never shows up in the song charts."
			action={
				<span className="rounded-full border border-border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70">
					Try /radio lofi
				</span>
			}
		>
			{summary && topStations.length ? (
				<>
					<CellGrid className="grid-cols-2 lg:grid-cols-4">
						<StatTile
							icon={<Clock3 className="h-4 w-4" />}
							label="Time on air"
							value={formatDuration(summary.totalListenMs, 1)}
						/>
						<StatTile
							icon={<RadioTower className="h-4 w-4" />}
							label="Tune-ins"
							value={formatNumber(summary.totalPlays)}
						/>
						<StatTile
							icon={<Radio className="h-4 w-4" />}
							label="Stations played"
							value={formatNumber(summary.uniqueStations)}
							hint={
								summary.countries === 0
									? undefined
									: summary.countries === 1
										? 'From 1 country'
										: `From ${formatNumber(summary.countries)} countries`
							}
						/>
						<StatTile
							icon={<Tags className="h-4 w-4" />}
							label="Top genre"
							value={summary.topGenre ?? '—'}
						/>
					</CellGrid>

					<div className="mt-4 overflow-hidden rounded-lg border border-border">
						<ol className="divide-y divide-border">
							{topStations.map((station) => (
								<StationRow key={station.stationId} station={station} />
							))}
						</ol>
					</div>
				</>
			) : (
				<EmptyState message="Nobody has tuned in yet. Start a station with /radio — search by name, genre or country, or paste a stream link." />
			)}
		</StatsSection>
	);
};

export default StatsRadioCard;
