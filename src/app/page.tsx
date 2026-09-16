import { Suspense } from 'react';
import { Metadata, NextPage } from 'next';
import Link from 'next/link';
import {
	ArrowRight,
	AudioLines,
	Ban,
	Gauge,
	Globe2,
	Headphones,
	ListMusic,
	Radio,
	Shield,
	Sparkles,
	Wand2,
} from 'lucide-react';

import {
	ActionLink,
	Cell,
	CellGrid,
	CtaBand,
	Eyebrow,
	IconChip,
	Rule,
	SectionHeading,
	Surface,
} from '@/components/shared/page/parts';
import Features from '@/components/shared/features';
import PepperMascot from '@/components/shared/pepperMascot';
import Reveal from '@/components/shared/reveal';
import CommandGrid from '@/components/shared/home/commandGrid';
import HeroMetrics from '@/components/shared/home/heroMetrics';
import LanguagesCard from '@/components/shared/home/languagesCard';
import NowPlaying from '@/components/shared/home/nowPlaying';
import NowPlayingMock from '@/components/shared/home/nowPlayingMock';
import CommandGridSkeleton from '@/components/skeletons/commandGridSkeleton';
import LanguagesCardSkeleton from '@/components/skeletons/languagesCardSkeleton';
import MetricStripSkeleton from '@/components/skeletons/metricStripSkeleton';
import {
	discordServerLink,
	features,
	inviteLink,
	musicSources,
	unsupportedSource,
} from '@/constants';

export const metadata: Metadata = {
	title: 'Pepper | Best Discord Music Bot for Seamless Streaming',
	description:
		'Add Pepper to your Discord server for high-quality music streaming from Spotify, Apple Music, Deezer and SoundCloud, plus live radio. Lag-free playback, autoplay, queue management and slash commands.',
	keywords: [
		'Discord music bot',
		'Pepper music bot',
		'Lavalink music bot',
		'Spotify Discord bot',
		'Apple Music music bot',
		'high quality Discord music',
		'Discord voice channel bot',
		'Discord radio bot',
		'queue management Discord bot',
		'Discord audio streaming bot',
	],
};

const capabilities = [
	{
		icon: <AudioLines className="h-4 w-4" />,
		title: 'Lossless-feeling playback',
		description:
			'High-bitrate audio streamed through Lavalink servers we host ourselves, with automatic failover if one struggles mid-track.',
	},
	{
		icon: <Sparkles className="h-4 w-4" />,
		title: 'Autoplay when the queue runs dry',
		description:
			"Pepper keeps the room going using Lavalink's recommendations across Spotify and SoundCloud. A recommendation algorithm of our own is on the way.",
	},
	{
		icon: <ListMusic className="h-4 w-4" />,
		title: 'Queue control that makes sense',
		description:
			'Skip, loop, shuffle, seek and reorder with slash commands and buttons that respond instantly.',
	},
	{
		icon: <Shield className="h-4 w-4" />,
		title: 'DJ role permissions',
		description:
			'Hand playback control to a role you pick, so a busy server does not turn into a queue war.',
	},
	{
		icon: <Globe2 className="h-4 w-4" />,
		title: 'Speaks your language',
		description:
			'Every response is translated into each locale Pepper ships, set per server or per user.',
	},
	{
		icon: <Gauge className="h-4 w-4" />,
		title: 'Built to stay up',
		description:
			'Sharded, session-resuming and monitored — playback survives restarts and reconnects on its own.',
	},
];

const reasons = [
	{
		icon: <Gauge className="h-4 w-4" />,
		title: 'Audio infrastructure we own',
		body: 'We host our own Lavalink servers rather than renting shared public ones, so playback quality and uptime are ours to fix.',
	},
	{
		icon: <Headphones className="h-4 w-4" />,
		title: 'One command to start',
		body: 'Join a voice channel, run /play, and Pepper handles the search, the queue and the reconnects.',
	},
	{
		icon: <Wand2 className="h-4 w-4" />,
		title: 'Our own lyrics service',
		body: 'Lyrics are answered by infrastructure we run, so no third party sees what your server is listening to. Autoplay still leans on Lavalink while we build a recommendation engine of our own.',
	},
];

const Page: NextPage = async () => {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Hero. Animates on load rather than on scroll — it is already in view,
			    and an observer here would only hold back the largest paint. */}
			<section className="relative overflow-hidden border-b border-border">
				<div
					aria-hidden
					className="grid-wash pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] opacity-60"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-[min(52rem,90%)] rounded-full bg-glow blur-3xl"
				/>

				<div className="container relative mx-auto px-4 py-16 md:py-24">
					<div className="mx-auto max-w-5xl">
						<div className="grid items-center gap-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
							<div>
								<div className="rise" style={{ animationDelay: '40ms' }}>
									<Eyebrow>
										<Radio className="h-3 w-3" />
										Free Discord music bot
									</Eyebrow>
								</div>

								<h1
									className="rise mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.035em] md:text-[3.5rem]"
									style={{ animationDelay: '100ms' }}
								>
									Music for your Discord, without the friction.
								</h1>

								<p
									className="rise mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg"
									style={{ animationDelay: '180ms' }}
								>
									Pepper joins your voice channel, finds the track and plays it
									in seconds — from Spotify, Apple Music, Deezer and SoundCloud,
									or tunes into live radio. No setup, no paywall, no queue
									babysitting.
								</p>

								<div
									className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
									style={{ animationDelay: '260ms' }}
								>
									<ActionLink href={inviteLink} external>
										Add Pepper to Discord
										<ArrowRight className="h-4 w-4" />
									</ActionLink>
									<ActionLink href="/stats" variant="ghost">
										<Radio className="h-4 w-4" />
										See what is playing now
									</ActionLink>
								</div>
							</div>

							{/* The mascot is the only saturated thing above the fold; it earns
							    the space by being the page's single warm note. */}
							<div
								className="rise relative mx-auto w-full max-w-[15rem] sm:max-w-[18rem] lg:max-w-none"
								style={{ animationDelay: '320ms' }}
							>
								<div
									aria-hidden
									className="pointer-events-none absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--pepper-red)] opacity-[0.11] blur-3xl"
								/>
								<PepperMascot className="relative w-full" />
							</div>
						</div>

						<Suspense fallback={<MetricStripSkeleton />}>
							<HeroMetrics />
						</Suspense>
					</div>
				</div>
			</section>

			{/* Why Pepper */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<Rule label="Why Pepper" />
						</Reveal>

						<div className="mt-10 grid items-center gap-12 lg:grid-cols-2">
							<Reveal>
								{/* The example stands in while the live read resolves, so the
								    section keeps its height either way. */}
								<Suspense fallback={<NowPlayingMock initialData={null} />}>
									<NowPlaying />
								</Suspense>
							</Reveal>

							<Reveal delay={0.08}>
								<SectionHeading
									title="Fast where it matters, quiet everywhere else."
									description="Pepper is built around one idea: the gap between typing a command and hearing the music should be as close to nothing as possible."
								/>
								<div className="mt-8 space-y-6">
									{reasons.map((reason) => (
										<div key={reason.title} className="flex gap-4">
											<IconChip>{reason.icon}</IconChip>
											<div>
												<h3 className="text-base font-semibold tracking-[-0.01em] text-foreground">
													{reason.title}
												</h3>
												<p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
													{reason.body}
												</p>
											</div>
										</div>
									))}
								</div>
							</Reveal>
						</div>
					</div>
				</div>
			</section>

			{/* Capabilities. A hairline grid rather than six floating cards — the set
			    is the point, not each tile. */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<SectionHeading
								label="Capabilities"
								title="Everything a server actually needs"
								description="No feature gates, no premium upsell. Every command below works the moment Pepper joins."
							/>
						</Reveal>

						<Reveal delay={0.08}>
							<CellGrid className="mt-10 sm:grid-cols-2 lg:grid-cols-3">
								{capabilities.map((capability) => (
									<Cell key={capability.title} interactive className="p-6">
										<IconChip>{capability.icon}</IconChip>
										<h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground">
											{capability.title}
										</h3>
										<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
											{capability.description}
										</p>
									</Cell>
								))}
							</CellGrid>
						</Reveal>
					</div>
				</div>
			</section>

			{/* Highlights */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<SectionHeading
								label="Highlights"
								title="Made for the way servers listen together"
							/>
						</Reveal>
						<div className="mt-10 grid gap-5 md:grid-cols-3">
							{features.map((feature, index) => (
								<Reveal key={feature.value} delay={index * 0.07}>
									<Features feature={feature} />
								</Reveal>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Commands */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<SectionHeading
								label="Commands"
								title="Slash commands, no prefixes to remember"
								description="Type a slash and Discord does the rest. Here is the full set."
							/>
						</Reveal>
						<Reveal delay={0.08}>
							<div className="mt-10">
								<Suspense fallback={<CommandGridSkeleton />}>
									<CommandGrid />
								</Suspense>
							</div>
						</Reveal>
					</div>
				</div>
			</section>

			{/* Sources & languages */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
						<Reveal>
							<Surface className="h-full p-8">
								<IconChip>
									<ListMusic className="h-4 w-4" />
								</IconChip>
								<h3 className="mt-4 text-lg font-semibold tracking-[-0.015em] text-foreground">
									Plays from the platforms you already use
								</h3>
								<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
									Paste a link or search by name — Pepper resolves the track and
									streams the best available source.
								</p>
								<div className="mt-5 flex flex-wrap gap-2">
									{musicSources.map((source) => (
										<span
											key={source}
											className="rounded-full border border-border px-3 py-1 text-[13px] text-foreground/80"
										>
											{source}
										</span>
									))}
								</div>

								<div className="mt-5 flex gap-3 rounded-lg border border-border bg-surface-hover p-4">
									<Ban className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/85" />
									<p className="text-[13px] leading-relaxed text-muted-foreground">
										<span className="font-semibold text-foreground/80">
											{unsupportedSource.summary}
										</span>{' '}
										{unsupportedSource.detail}
									</p>
								</div>
							</Surface>
						</Reveal>

						<Reveal delay={0.08}>
							<Suspense fallback={<LanguagesCardSkeleton />}>
								<LanguagesCard />
							</Suspense>
						</Reveal>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="container mx-auto px-4 py-16 md:py-24">
				<div className="mx-auto max-w-5xl">
					<Reveal>
						<CtaBand
							title="Add Pepper and play something"
							description="It takes one click to invite, one command to start. Free forever, with a support server if you ever get stuck."
							actions={
								<>
									<ActionLink href={inviteLink} external>
										Add to Discord
										<ArrowRight className="h-4 w-4" />
									</ActionLink>
									<ActionLink href={discordServerLink} variant="ghost" external>
										Join the support server
									</ActionLink>
								</>
							}
						/>
					</Reveal>
					<p className="mt-6 text-center text-[13px] text-muted-foreground/85">
						Curious what Pepper does with your data?{' '}
						<Link
							href="/privacy-policy"
							className="font-medium text-foreground/80 underline decoration-foreground/35 underline-offset-4 hover:decoration-foreground"
						>
							Read the privacy policy
						</Link>
						.
					</p>
				</div>
			</section>
		</div>
	);
};

export const dynamic = 'force-dynamic';
export default Page;
