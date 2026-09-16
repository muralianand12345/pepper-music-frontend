import { BadgeCheck, Radio } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

/**
 * A radio station's logo. Logos come from the stations themselves and are often
 * dead links, so this falls back to a plain mark rather than a broken image. No
 * referrer: most of these hosts are strangers to us.
 */
const StationArt = ({
	src,
	className,
	iconClassName,
}: {
	src: string | null | undefined;
	className?: string;
	iconClassName?: string;
}) => (
	<Avatar className={cn('size-11 rounded border border-border', className)}>
		{src && (
			<AvatarImage
				key={src}
				src={src}
				alt=""
				referrerPolicy="no-referrer"
				className="object-cover"
			/>
		)}
		<AvatarFallback className="rounded-none bg-surface-hover">
			<Radio className={cn('h-5 w-5 text-foreground/45', iconClassName)} />
		</AvatarFallback>
	</Avatar>
);

/** Marks a station Pepper has hand-picked and tested, as opposed to a directory listing. */
export const VerifiedStationMark = () => (
	<span title="Verified station" className="shrink-0 text-foreground/55">
		<BadgeCheck aria-hidden className="h-4 w-4" />
		<span className="sr-only">Verified station</span>
	</span>
);

export default StationArt;
