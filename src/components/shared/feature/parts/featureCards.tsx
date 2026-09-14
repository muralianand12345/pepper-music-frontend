import { Award, Clock, ListMusic, Music, Server, Zap } from 'lucide-react';

import { Cell, CellGrid, IconChip } from '@/components/shared/page/parts';

const FeatureCardContent = [
	{
		icon: <Music className="h-4 w-4" />,
		title: 'Voice Channel Music',
		description:
			'Play high-quality music directly in your Discord voice channels with a single slash command.',
	},
	{
		icon: <Server className="h-4 w-4" />,
		title: 'Multi-Lingual Support',
		description:
			'Search and enjoy music in multiple languages, with every response translated to match.',
	},
	{
		icon: <ListMusic className="h-4 w-4" />,
		title: 'Your Own Playlists',
		description:
			'Build playlists with /playlist, keep them private, or share a code anyone can paste into /play.',
	},
	{
		icon: <Zap className="h-4 w-4" />,
		title: 'Fast & Reliable',
		description:
			'Lightning-fast song loading and stable 24/7 uptime for uninterrupted music sessions.',
	},
	{
		icon: <Award className="h-4 w-4" />,
		title: 'Premium Audio Quality',
		description:
			'Crystal-clear sound with high-bitrate streaming and minimal buffering.',
	},
	{
		icon: <Clock className="h-4 w-4" />,
		title: 'Queue Management',
		description:
			'Reorder, skip and loop tracks or whole playlists without losing your place.',
	},
];

const FeatureCards: React.FC = () => {
	return (
		<CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
			{FeatureCardContent.map((feature) => (
				<Cell key={feature.title} interactive className="p-6">
					<IconChip>{feature.icon}</IconChip>
					<h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground">
						{feature.title}
					</h3>
					<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
						{feature.description}
					</p>
				</Cell>
			))}
		</CellGrid>
	);
};

export default FeatureCards;
