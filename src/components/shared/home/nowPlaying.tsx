import { getRealtime } from '@/lib/stats-api';

import NowPlayingMock from './nowPlayingMock';

/**
 * Hands the now-playing panel a live snapshot. `getRealtime` is the same 10s
 * cached, single-flight read the hero metrics make, so rendering both costs the
 * bot one realtime call, not two. If the bot does not answer, the panel shows
 * its example instead.
 */
const NowPlaying: React.FC = async () => {
	const realtime = await getRealtime().catch(() => null);
	return <NowPlayingMock initialData={realtime} />;
};

export default NowPlaying;
