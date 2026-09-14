import { Suspense } from 'react';
import { NextPage } from 'next';
import { default as nextDynamic } from 'next/dynamic';
import { Radio } from 'lucide-react';

import { PageHero } from '@/components/shared/page/parts';
import StatsPageSkeleton from '@/components/skeletons/statsPageSkeleton';
import { statsSections } from '@/constants';

const StatsComponent = nextDynamic(
	() => import('@/components/shared/stats/statsComponent'),
	{ ssr: true }
);

interface Props {}

export const metadata = {
	title: 'Stats | What we have achieved with Pepper',
	description:
		'Live and all-time Pepper music bot statistics — active players, listeners, top songs, top requesters, public playlists and server insights.',
	keywords: [
		'Discord music bot stats',
		'Pepper music bot statistics',
		'Discord music streaming stats',
		'Discord bot analytics',
	],
};

const StatsPage: NextPage<Props> = async ({}) => {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<PageHero
				eyebrow={
					<>
						<Radio className="h-3 w-3" />
						Stats
					</>
				}
				title="Pepper, by the numbers"
				summary="Everything Pepper is playing right now, and everything it has played since day one — pulled straight from the bot, not a marketing deck."
			>
				<nav className="mt-8 flex flex-wrap gap-2">
					{statsSections.map((section) => (
						<a
							key={section.id}
							href={`#${section.id}`}
							className="rounded-full border border-border px-3.5 py-1.5 text-[13px] text-foreground/80 transition-colors hover:border-foreground/40 hover:bg-surface-hover hover:text-foreground"
						>
							{section.label}
						</a>
					))}
				</nav>
			</PageHero>

			{/* The hero is on screen immediately; the numbers stream in behind it. */}
			<Suspense fallback={<StatsPageSkeleton />}>
				<StatsComponent />
			</Suspense>
		</div>
	);
};

export const dynamic = 'force-dynamic';
export default StatsPage;
