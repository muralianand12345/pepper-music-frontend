import { AudioLines, Unlock, Wand2 } from 'lucide-react';

import { Cell, CellGrid, IconChip } from '@/components/shared/page/parts';
import { cn } from '@/lib/utils';

const upkeep = [
	{
		icon: <AudioLines className="h-4 w-4" />,
		title: 'Audio nodes',
		body: 'The Lavalink servers Pepper streams through are ours, not shared public ones — so playback quality and uptime stay in our hands.',
	},
	{
		icon: <Wand2 className="h-4 w-4" />,
		title: 'Lyrics service',
		body: 'Lyrics are answered by infrastructure we run, so no third party sees what your server is listening to.',
	},
	{
		icon: <Unlock className="h-4 w-4" />,
		title: 'Every command, for everyone',
		body: 'No premium tier and no locked commands. Every server gets the same Pepper, whether or not it chips in.',
	},
];

/** What donations pay for. Shared by the donate page and PayPal's return page, so the two never disagree. */
const UpkeepGrid = ({ className }: { className?: string }) => (
	<CellGrid className={cn('md:grid-cols-3', className)}>
		{upkeep.map((item) => (
			<Cell key={item.title} className="p-6">
				<IconChip>{item.icon}</IconChip>
				<h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground">
					{item.title}
				</h3>
				<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
					{item.body}
				</p>
			</Cell>
		))}
	</CellGrid>
);

export default UpkeepGrid;
