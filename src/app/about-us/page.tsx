import { Metadata, NextPage } from 'next';
import Link from 'next/link';
import {
	ArrowRight,
	ExternalLink,
	Heart,
	MessageSquare,
	Mic2,
	Music2,
	Server,
	ShieldCheck,
	Sparkles,
	Sparkle,
	UserRound,
	Users,
	Wallet,
	Zap,
} from 'lucide-react';

import {
	ActionLink,
	Cell,
	CellGrid,
	CtaBand,
	IconChip,
	PageHero,
	Rule,
	SectionHeading,
	Surface,
} from '@/components/shared/page/parts';
import PepperMascot from '@/components/shared/pepperMascot';
import Reveal from '@/components/shared/reveal';
import {
	discordServerLink,
	inviteLink,
	musicSources,
	privacyLink,
} from '@/constants';
import { getLanguagesOrFallback } from '@/lib/bot-catalogue';

interface Props {}

export const metadata: Metadata = {
	title: 'About Pepper | Premium Discord Music Bot with Crystal-Clear Playback',
	description:
		'The story behind Pepper — a free-forever Discord music bot powered by distributed Lavalink nodes, built for communities that listen together.',
	keywords: [
		'About Pepper',
		'Pepper music bot',
		'Discord music bot story',
		'premium Discord music bot',
		'Lavalink music bot',
		'Pepper bot features',
		'Pepper bot community',
		'free Discord music bot',
		'music streaming on Discord',
	],
};

const values = [
	{
		icon: <Music2 className="h-4 w-4" />,
		title: 'Playback comes first',
		body: 'Every decision is measured against one question: does it get music playing faster and keep it playing? Features that fail that test do not ship.',
	},
	{
		icon: <Users className="h-4 w-4" />,
		title: 'Built around communities',
		body: 'Shared queues, DJ roles and per-server settings exist because listening together is different from listening alone.',
	},
	{
		icon: <Wallet className="h-4 w-4" />,
		title: 'Free, and staying that way',
		body: 'No premium tier, no locked commands, no paywalled audio quality. The only thing membership of our support server unlocks is account linking.',
	},
	{
		icon: <Zap className="h-4 w-4" />,
		title: 'Always shipping',
		body: 'Pepper is actively maintained — new features, fixes and performance work land regularly, driven by what people ask for.',
	},
];

const AboutUs: NextPage<Props> = async ({}) => {
	// Read from the bot rather than hard-coded, so the count cannot go stale.
	const { total: languageCount } = await getLanguagesOrFallback();

	return (
		<div className="min-h-screen bg-background text-foreground">
			<PageHero
				eyebrow={
					<>
						<Sparkles className="h-3 w-3" />
						About
					</>
				}
				title="A music bot built by people who got tired of bad ones"
				summary="Pepper started as a fix for the same frustrations everyone has with Discord music bots: slow searches, dropped audio, features hidden behind a subscription. It is free, actively maintained, and built to stay out of your way."
				actions={
					<>
						<ActionLink href={inviteLink} external>
							Add to Discord
							<ArrowRight className="h-4 w-4" />
						</ActionLink>
						<ActionLink href={discordServerLink} variant="ghost" external>
							<MessageSquare className="h-4 w-4" />
							Join the support server
						</ActionLink>
					</>
				}
			/>

			{/* Story */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<Rule label="Our story" />
						</Reveal>
					</div>
					<div className="mx-auto mt-10 grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
						<Reveal>
							<SectionHeading title="Where Pepper came from" />
							<div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
								<p>
									Pepper began as a small project for one Discord server, built
									because the bots available at the time kept buffering,
									dropping out of voice channels, or asking for money to play a
									song at a decent bitrate.
								</p>
								<p>
									It grew from there. Today it runs on audio infrastructure we
									host ourselves, streams from {musicSources.length} major
									platforms, speaks {languageCount} languages, and plays for
									communities around the world — still free, still improving.
								</p>
								<p>
									It is run by a small team that uses it daily. If you want to
									know exactly what Pepper records while it plays, our privacy
									policy spells it out in plain language.
								</p>
							</div>
						</Reveal>

						<Reveal delay={0.08}>
							<Surface className="mx-auto w-full max-w-[16rem] p-6 text-center">
								<PepperMascot className="mx-auto h-28 w-28" />
								<p className="mt-4 text-sm font-semibold text-foreground">
									Pepper
								</p>
								<p className="mt-1 text-[13px] text-muted-foreground">
									Discord music bot
								</p>
								<Link
									href={privacyLink}
									className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/80 underline decoration-foreground/35 underline-offset-4 transition-colors hover:decoration-foreground"
								>
									<ShieldCheck className="h-3.5 w-3.5" />
									Privacy policy
								</Link>
								<Link
									href="/creator"
									className="mx-auto mt-2.5 flex w-fit items-center gap-1.5 text-[13px] font-medium text-foreground/80 underline decoration-foreground/35 underline-offset-4 transition-colors hover:decoration-foreground"
								>
									<UserRound className="h-3.5 w-3.5" />
									Meet the creator
								</Link>
							</Surface>
						</Reveal>
					</div>
				</div>
			</section>

			{/* Values */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<SectionHeading
								label="What we care about"
								title="Four things we will not compromise on"
							/>
						</Reveal>
						<Reveal delay={0.08}>
							<CellGrid className="mt-10 sm:grid-cols-2">
								{values.map((value) => (
									<Cell
										key={value.title}
										interactive
										className="flex gap-4 p-6"
									>
										<IconChip>{value.icon}</IconChip>
										<div>
											<h3 className="text-base font-semibold tracking-[-0.01em] text-foreground">
												{value.title}
											</h3>
											<p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
												{value.body}
											</p>
										</div>
									</Cell>
								))}
							</CellGrid>
						</Reveal>
					</div>
				</div>
			</section>

			{/* What powers Pepper */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<SectionHeading
								label="Under the hood"
								title="We run the whole stack ourselves"
								description="Most music bots rent their audio infrastructure and bolt on third-party services for everything else. Pepper runs its own — which is why we can tune it, fix it ourselves when something breaks, and keep your listening data off anyone else's servers."
							/>
						</Reveal>
						<Reveal delay={0.08}>
							<CellGrid className="mt-10 sm:grid-cols-3">
								{[
									{
										icon: <Server className="h-4 w-4" />,
										title: 'Our own audio nodes',
										body: 'We host the Lavalink servers Pepper streams through, so nothing disappears overnight when a shared provider goes down. Sessions resume after a restart without losing your place.',
									},
									{
										icon: <Mic2 className="h-4 w-4" />,
										title: 'Our own lyrics service',
										body: 'The /lyrics command is answered by a service we built and host. Only the track link is sent to it — never who asked for it.',
									},
									{
										icon: <Sparkle className="h-4 w-4" />,
										title: 'Autoplay, honestly',
										body: "When the queue empties, autoplay keeps going on Lavalink's own recommendations across Spotify and SoundCloud. A recommendation engine of our own is being built.",
									},
								].map((item) => (
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
						</Reveal>
					</div>
				</div>
			</section>

			{/* Support */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<Surface className="p-8 md:p-10">
								<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
									<div className="max-w-xl">
										<IconChip>
											<MessageSquare className="h-4 w-4" />
										</IconChip>
										<h2 className="mt-4 text-2xl font-bold tracking-[-0.025em] text-foreground">
											Support server
										</h2>
										<p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
											Stuck on setup, hit a bug, or want a feature? Our support
											server is where the maintainers and the community answer
											questions — usually within the hour. It is also where
											release notes and outage updates get posted first.
										</p>
										<p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
											Joining it also unlocks account linking, so you can queue
											your own Spotify playlists with{' '}
											<code className="font-mono text-foreground/80">
												/login
											</code>
											, and raises your{' '}
											<code className="font-mono text-foreground/80">
												/playlist
											</code>{' '}
											limit from 1 playlist of 10 songs to 5 playlists of 50.
										</p>
									</div>

									<div className="shrink-0 lg:w-72">
										<div className="rounded-lg border border-border bg-background p-4">
											<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
												Invite link
											</p>
											<p className="mt-2 break-all font-mono text-[13px] text-foreground/80">
												{discordServerLink}
											</p>
										</div>
										<ActionLink
											href={discordServerLink}
											external
											className="mt-3 w-full"
										>
											<ExternalLink className="h-4 w-4" />
											Join now
										</ActionLink>
									</div>
								</div>
							</Surface>
						</Reveal>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="container mx-auto px-4 py-16 md:py-20">
				<div className="mx-auto max-w-5xl">
					<Reveal>
						<CtaBand
							title="Ready to elevate your server?"
							description="Add Pepper, run /play, and let the music take center stage in your community."
							actions={
								<>
									<ActionLink href={inviteLink} external>
										<Heart className="h-4 w-4" />
										Add to Discord
									</ActionLink>
									<ActionLink href="/bot-features" variant="ghost">
										Browse the features
									</ActionLink>
								</>
							}
						/>
					</Reveal>
				</div>
			</section>
		</div>
	);
};

export default AboutUs;
