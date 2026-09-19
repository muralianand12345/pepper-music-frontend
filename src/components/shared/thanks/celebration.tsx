import { CSSProperties } from 'react';
import { Music, Music2 } from 'lucide-react';

import PepperMascot from '@/components/shared/pepperMascot';

type Piece = {
	kind: 'note' | 'note2' | 'dot';
	/** Where the piece comes to rest, as a share of the mascot's width. */
	x: number;
	y: number;
	rotate?: number;
	delay: number;
	size: number;
	color?: string;
};

// Weighted upward and outward: the mascot stands on a contact shadow, so
// anything flung below it reads as falling rather than celebrating.
const pieces: Piece[] = [
	{ kind: 'note', x: -52, y: -18, rotate: -18, delay: 0.5, size: 22 },
	{ kind: 'dot', x: -36, y: -44, delay: 0.56, size: 9, color: 'var(--pepper-red)' },
	{ kind: 'note2', x: -10, y: -56, rotate: 10, delay: 0.5, size: 20 },
	{ kind: 'dot', x: 16, y: -52, delay: 0.6, size: 7, color: 'var(--pepper-green)' },
	{ kind: 'note', x: 40, y: -40, rotate: 16, delay: 0.53, size: 24 },
	{ kind: 'dot', x: 56, y: -12, delay: 0.58, size: 8, color: 'var(--pepper-red-light)' },
	{ kind: 'note2', x: 52, y: 16, rotate: 24, delay: 0.63, size: 18 },
	{ kind: 'dot', x: -56, y: 12, delay: 0.61, size: 6, color: 'var(--pepper-green)' },
	{ kind: 'dot', x: -24, y: -64, delay: 0.66, size: 5, color: 'var(--pepper-red)' },
	{ kind: 'note', x: 28, y: -66, rotate: -8, delay: 0.64, size: 16 },
	{ kind: 'dot', x: 46, y: 36, delay: 0.7, size: 5, color: 'var(--foreground)' },
	{ kind: 'dot', x: -46, y: 38, delay: 0.7, size: 5, color: 'var(--foreground)' },
];

/**
 * The mascot, with a one-off burst of notes and confetti the moment the page
 * lands. Everything is CSS (`.cheer*` in `globals.css`), so this stays a server
 * component; pieces are placed in container units, so the burst scales with
 * the mascot rather than overshooting it on a phone. Reduced motion drops the
 * burst and the hop, and leaves Pepper standing.
 */
const Celebration = () => (
	<div className="@container relative">
		<div
			aria-hidden
			className="pointer-events-none absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--pepper-red)] opacity-[0.11] blur-3xl"
		/>

		<div className="cheer__hop relative">
			<PepperMascot
				className="w-full"
				title="Pepper, a bell pepper wearing headphones, jumping for joy"
			/>
		</div>

		<div aria-hidden className="pointer-events-none absolute inset-0">
			{pieces.map((piece, index) => (
				<span
					key={index}
					className="cheer__piece text-foreground/55"
					style={
						{
							'--x': `${piece.x}cqw`,
							'--y': `${piece.y}cqw`,
							'--r': `${piece.rotate ?? 0}deg`,
							'--delay': `${piece.delay}s`,
						} as CSSProperties
					}
				>
					{piece.kind === 'dot' ? (
						<span
							className="block rounded-full"
							style={{
								width: piece.size,
								height: piece.size,
								background: piece.color,
								opacity: piece.color === 'var(--foreground)' ? 0.35 : 1,
							}}
						/>
					) : piece.kind === 'note' ? (
						<Music style={{ width: piece.size, height: piece.size }} />
					) : (
						<Music2 style={{ width: piece.size, height: piece.size }} />
					)}
				</span>
			))}
		</div>
	</div>
);

export default Celebration;
