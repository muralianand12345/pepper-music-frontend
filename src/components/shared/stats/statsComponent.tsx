import { getStatsBundle } from '@/lib/stats-api';

import StatsInsights from './parts/statsInsights';
import StatsMusicPage from './parts/statsMusic';
import StatsPlaylistsCard from './parts/statsPlaylists';
import StatsRealtimeCard from './parts/statsRealtime';
import StatsRequestersCard from './parts/statsRequesters';
import StatsServersCard from './parts/statsServers';

const StatsComponent: React.FC = async () => {
	const stats = await getStatsBundle({
		songs: 20,
		requesters: 10,
		playtime: 10,
		servers: 10,
		playlists: 10,
	});

	return (
		<div className="container mx-auto px-4 py-16 md:py-20">
			<div className="mx-auto max-w-5xl space-y-20">
				<StatsRealtimeCard initialData={stats.realtime} />
				<StatsInsights
					overview={stats.overview}
					playtime={stats.playtime}
					topRequester={stats.requesters?.requesters?.[0] ?? null}
				/>
				<StatsMusicPage songs={stats.songs} />
				<StatsRequestersCard requesters={stats.requesters} />
				<StatsPlaylistsCard playlists={stats.playlists} />
				<StatsServersCard servers={stats.servers} />
			</div>
		</div>
	);
};

export default StatsComponent;
