import { NextPage } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MessageSquare } from 'lucide-react';

import {
	discordServerLink,
	donateLink,
	featursLink,
	feedbackLink,
	inviteLink,
	legalNavItems,
	musicSources,
} from '@/constants';
import PepperMascot from '@/components/shared/pepperMascot';

interface Props {}

const columns = [
	{
		title: 'Product',
		links: [
			{ label: 'Features', href: featursLink, external: false },
			{ label: 'Live stats', href: '/stats', external: false },
			{ label: 'Add to Discord', href: inviteLink, external: true },
		],
	},
	{
		title: 'Community',
		links: [
			{ label: 'Support server', href: discordServerLink, external: true },
			{ label: 'About us', href: '/about-us', external: false },
			{ label: 'The creator', href: '/creator', external: false },
			{ label: 'Send feedback', href: feedbackLink, external: false },
			{ label: 'Donate', href: donateLink, external: false },
		],
	},
	{
		title: 'Legal',
		links: legalNavItems.map((item) => ({
			label: item.name,
			href: item.value,
			external: false,
		})),
	},
];

const Footer: NextPage<Props> = ({}) => {
	return (
		<footer className="relative overflow-hidden border-t border-border bg-background text-foreground">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 -bottom-32 mx-auto h-64 w-[min(46rem,90%)] rounded-full bg-glow blur-3xl"
			/>

			<div className="container relative mx-auto px-4 pt-14">
				<div className="grid gap-12 lg:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))]">
					{/* Brand */}
					<div className="max-w-sm">
						<Link
							href="/"
							className="inline-flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<PepperMascot
								decorative
								idle={false}
								className="h-8 w-8 shrink-0"
							/>
							<span className="text-[17px] font-bold tracking-tight">
								Pepper
							</span>
						</Link>

						<p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
							A free Discord music bot with high-quality playback, autoplay and
							controls your moderators can trust.
						</p>

						<div className="mt-6">
							<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
								Plays from
							</p>
							<div className="mt-3 flex flex-wrap gap-1.5">
								{musicSources.map((source) => (
									<span
										key={source}
										className="rounded-full border border-border px-2.5 py-1 text-[12px] text-muted-foreground"
									>
										{source}
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Link columns */}
					{columns.map((column) => (
						<div key={column.title}>
							<h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
								{column.title}
							</h2>
							<ul className="mt-4 space-y-3">
								{column.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											{...(link.external
												? { target: '_blank', rel: 'noreferrer' }
												: {})}
											className="group inline-flex items-center gap-1 text-[14px] text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
										>
											{link.label}
											{link.external && (
												<ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
											)}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Wordmark */}
				<div
					aria-hidden
					className="pointer-events-none mt-12 select-none overflow-hidden"
				>
					<p className="translate-y-[0.18em] text-center text-[18vw] font-bold leading-[0.8] tracking-tighter text-foreground/[0.045] lg:text-[13rem]">
						Pepper
					</p>
				</div>
			</div>

			<div className="relative border-t border-border">
				<div className="container mx-auto flex flex-col-reverse items-center justify-between gap-4 px-4 py-6 md:flex-row">
					<p className="text-center text-[13px] text-muted-foreground/85 md:text-left">
						© {new Date().getFullYear()} Pepper · Not affiliated with Discord,
						Spotify or any other platform.
					</p>

					<div className="flex items-center gap-2">
						<Link
							href={discordServerLink}
							target="_blank"
							rel="noreferrer"
							aria-label="Pepper support server on Discord"
							className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors outline-none hover:border-foreground/30 hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
						>
							<MessageSquare className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
