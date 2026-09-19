import { Metadata, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
	ArrowUpRight,
	Bot,
	ChevronDown,
	Globe,
	HeartHandshake,
	LifeBuoy,
	MessageSquare,
	Music2,
	Spade,
	Terminal,
	Ticket,
	UserRound,
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
import Reveal from '@/components/shared/reveal';
import PayPalButton from '@/components/shared/support/paypalButton';
import { discordServerLink, privacyLink } from '@/constants';

export const metadata: Metadata = {
	title: 'The creator | Murali Anand, the developer behind Pepper',
	description:
		'Meet Murali Anand, the AI Engineer who builds Pepper — a free, open-source Discord music bot made without a profit motive.',
	keywords: [
		'Murali Anand',
		'Pepper creator',
		'Pepper Discord bot developer',
		'open source Discord bot',
	],
};

const websiteLink = 'https://www.muralianand.in';
const githubLink = 'https://github.com/muralianand12345';
/** GitHub's avatar CDN by user id — `github.com/<name>.png` redirects here anyway. */
const avatarUrl = 'https://avatars.githubusercontent.com/u/71955467?v=4';

const repo = (name: string) => `${githubLink}/${name}`;

const facts = [
	{ label: 'Day job', value: 'AI Engineer' },
	{ label: 'Favourite languages', value: 'Python & TypeScript' },
	{ label: 'Profit from bots', value: 'None' },
	{ label: 'Source code', value: 'Open source' },
];

type ProjectLink = { label: string; href: string };

// Six entries, so the grid closes cleanly at both two and three columns.
const projects: {
	icon: React.ReactNode;
	name: string;
	kind: string;
	body: string;
	links: ProjectLink[];
}[] = [
	{
		icon: <Music2 className="h-4 w-4" />,
		name: 'Pepper',
		kind: 'Discord music bot',
		body: 'The bot this site is for — free, streaming through audio nodes I host, and the one I reach for myself now and then.',
		links: [{ label: 'Source', href: repo('Pepper-Bot') }],
	},
	{
		icon: <Ticket className="h-4 w-4" />,
		name: 'Salt',
		kind: 'Ticket bot · retired',
		body: "A multi-server ticket bot I've since stopped running. It's one of the most complex bots I've ever built, and the code is still up.",
		links: [{ label: 'Source', href: repo('Salt-Bot') }],
	},
	{
		icon: <LifeBuoy className="h-4 w-4" />,
		name: 'Ticket bots',
		kind: 'Single-server bots',
		body: 'Several ticket support bots, mostly designed for individual servers rather than for anyone to invite.',
		links: [
			{ label: 'EliteX', href: repo('Discord-TicketBot-EliteX') },
			{ label: 'Ticket Bot', href: repo('Discord-Ticket-Bot') },
		],
	},
	{
		icon: <Terminal className="h-4 w-4" />,
		name: 'Smart Terminal',
		kind: 'AI command-line tool',
		body: 'AI-powered terminal commands for macOS, Linux and Windows, published as a Python package.',
		links: [
			{ label: 'Source', href: repo('Smart-Terminal') },
			{ label: 'PyPI', href: 'https://pypi.org/project/smart-terminal-cli/' },
		],
	},
	{
		icon: <Spade className="h-4 w-4" />,
		name: 'Coup',
		kind: 'Multiplayer card game',
		body: 'The bluffing card game Coup, rebuilt to play online with friends in the browser.',
		links: [
			{ label: 'Play', href: 'https://coup.muralianand.in/' },
			{ label: 'Source', href: repo('coup-game') },
		],
	},
	{
		icon: <Bot className="h-4 w-4" />,
		name: 'Reasoning chatbot',
		kind: 'LLM app',
		body: 'A Streamlit chatbot that runs reasoning models through Groq.',
		links: [{ label: 'Source', href: repo('streamlit-chatbot') }],
	},
];

const inlineLink =
	'text-foreground/80 underline decoration-foreground/35 underline-offset-4 transition-colors hover:decoration-foreground';

const faqs: { group: string; items: { q: string; a: React.ReactNode }[] }[] = [
	{
		group: 'About me',
		items: [
			{ q: 'What do you do for a living?', a: "I'm an AI Engineer." },
			{
				q: 'What is your favourite programming language?',
				a: 'Python and TypeScript.',
			},
			{
				q: 'Do you make a profit from your Discord bots?',
				a: "No, I don't. Pepper is free to use.",
			},
			{
				q: 'Is the code for your bots open source?',
				a: (
					<>
						Yes —{' '}
						<a href={repo('Pepper-Bot')} target="_blank" rel="noreferrer" className={inlineLink}>
							Pepper is on GitHub
						</a>
						, and the code for my older bots, Salt included, is still up
						there too. If you&apos;re interested in contributing, you&apos;re
						more than welcome.
					</>
				),
			},
			{
				q: 'Have you built any other Discord bots?',
				a: "Several ticket support bots, mostly designed for individual servers, and Salt, a public ticket bot I've since stopped. Pepper is the only public bot I run now, and I have no plans to make another.",
			},
			{
				q: 'Do you use your bots yourself?',
				a: 'Occasionally — I do use Pepper.',
			},
			{
				q: 'Which was your favourite, Pepper or Salt?',
				a: "I really liked Salt and spent a lot of time developing it — it's one of the most complex bots I've ever built. I've since stopped running it, so Pepper is the one that's still going.",
			},
		],
	},
	{
		group: 'About Pepper',
		items: [
			{
				q: 'Does Pepper use AI? What about in the future?',
				a: 'No — just mathematical algorithms and formulas for its predictions. So far there are no plans to bring AI into Pepper.',
			},
			{
				q: 'Does Pepper use Lavalink?',
				a: 'Yes. Pepper streams through Lavalink, for better performance.',
			},
			{
				q: 'What data do you collect, and what do you do with it?',
				a: (
					<>
						Only what the bot needs to work: things like your Discord user ID,
						username and server ID, plus the songs and radio stations played in
						a server and by each user, which power{' '}
						<code className="font-mono text-foreground/80">/chart</code>,
						playlists and the public stats. None of it is sold. If you&apos;d
						like your data removed, open a ticket in the{' '}
						<a href={discordServerLink} target="_blank" rel="noreferrer" className={inlineLink}>
							support server
						</a>{' '}
						with your reason and I&apos;ll consider it. The{' '}
						<Link href={privacyLink} className={inlineLink}>
							privacy policy
						</Link>{' '}
						lists everything in full.
					</>
				),
			},
		],
	},
];

const Creator: NextPage = () => {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<PageHero
				eyebrow={
					<>
						<UserRound className="h-3 w-3" />
						The creator
					</>
				}
				title="Hi, I'm Murali — I build Pepper"
				summary="I'm an AI Engineer who builds Discord bots on the side. Pepper is free and open source, I don't make any money from it, and contributions are always welcome."
				actions={
					<>
						<ActionLink href={websiteLink} external>
							<Globe className="h-4 w-4" />
							muralianand.in
						</ActionLink>
						<ActionLink href={githubLink} variant="ghost" external>
							GitHub
							<ArrowUpRight className="h-4 w-4" />
						</ActionLink>
					</>
				}
			/>

			{/* Intro */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<Rule label="Who's behind it" />
						</Reveal>
					</div>
					<div className="mx-auto mt-10 grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
						<Reveal>
							<SectionHeading title="The one person behind Pepper" />
							<div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
								<p>
									By day I work as an AI Engineer. Discord bots are what I build
									for the fun of it — first ticket bots for individual servers,
									then Salt, a public ticket bot I&apos;ve since retired, and now
									Pepper.
								</p>
								<p>
									Pepper is open source and isn&apos;t run for profit. If you want
									to fix a bug or add a feature, the code is on GitHub and pull
									requests are welcome.
								</p>
							</div>
						</Reveal>

						<Reveal delay={0.08}>
							<Surface className="mx-auto w-full max-w-[16rem] p-6 text-center">
								<Image
									src={avatarUrl}
									alt="Murali Anand"
									width={112}
									height={112}
									className="mx-auto h-28 w-28 rounded-full border border-border object-cover"
								/>
								<p className="mt-4 text-sm font-semibold text-foreground">
									Murali Anand
								</p>
								<p className="mt-1 text-[13px] text-muted-foreground">
									AI Engineer
								</p>
								<div className="mt-4 flex items-center justify-center gap-4 text-[13px] font-medium">
									<a href={websiteLink} target="_blank" rel="noreferrer" className={inlineLink}>
										Website
									</a>
									<a href={githubLink} target="_blank" rel="noreferrer" className={inlineLink}>
										GitHub
									</a>
								</div>
							</Surface>
						</Reveal>
					</div>

					<div className="mx-auto mt-12 max-w-5xl">
						<Reveal delay={0.08}>
							<CellGrid className="grid-cols-2 lg:grid-cols-4">
								{facts.map((fact) => (
									<Cell key={fact.label} className="px-5 py-5">
										<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
											{fact.label}
										</p>
										<p className="mt-2.5 text-[15px] font-semibold tracking-[-0.01em] text-foreground">
											{fact.value}
										</p>
									</Cell>
								))}
							</CellGrid>
						</Reveal>
					</div>
				</div>
			</section>

			{/* Projects */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<SectionHeading
								label="What I've built"
								title="Bots and side projects"
								description="Pepper is the one most people know. These are the others, all open source."
							/>
						</Reveal>
						<Reveal delay={0.08}>
							<CellGrid className="mt-10 sm:grid-cols-2 lg:grid-cols-3">
								{projects.map((project) => (
									<Cell
										key={project.name}
										interactive
										className="flex flex-col p-6"
									>
										<IconChip>{project.icon}</IconChip>
										<h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground">
											{project.name}
										</h3>
										<p className="mt-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
											{project.kind}
										</p>
										<p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
											{project.body}
										</p>
										{/* Pinned to the bottom so links line up across a row. */}
										<div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4">
											{project.links.map((link) => (
												<a
													key={link.href}
													href={link.href}
													target="_blank"
													rel="noreferrer"
													className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground/80 transition-colors hover:text-foreground"
												>
													{link.label}
													<ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
												</a>
											))}
										</div>
									</Cell>
								))}
							</CellGrid>
						</Reveal>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<SectionHeading label="FAQ" title="Questions people ask me" />
						</Reveal>

						<div className="mt-10 space-y-10">
							{faqs.map((group) => (
								<Reveal key={group.group} delay={0.08}>
									<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
										{group.group}
									</p>
									<div className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border">
										{group.items.map((item) => (
											<details key={item.q} className="group">
												<summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-foreground outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover [&::-webkit-details-marker]:hidden">
													{item.q}
													<ChevronDown
														aria-hidden
														className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
													/>
												</summary>
												<p className="px-5 pb-5 text-[14px] leading-relaxed text-muted-foreground">
													{item.a}
												</p>
											</details>
										))}
									</div>
								</Reveal>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Chip in */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<Surface className="p-8 md:p-10">
								{/* PayPal's form runs far taller than the copy, so the copy
								    rides alongside it rather than floating mid-column. */}
								<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
									<div className="max-w-xl lg:sticky lg:top-24">
										<IconChip>
											<HeartHandshake className="h-4 w-4" />
										</IconChip>
										<h2 className="mt-4 text-2xl font-bold tracking-[-0.025em] text-foreground">
											Chip in towards the servers
										</h2>
										<p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
											Pepper is free to use, but not free to run — the audio
											nodes it streams through and the lyrics service behind it
											are servers I host. If Pepper has earned its place in your
											server and you&apos;d like to help keep it there, this is
											the way.
										</p>
										<p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
											It&apos;s entirely optional and unlocks nothing: every
											command stays free for everyone either way. Any amount
											helps, and PayPal emails you a receipt.
										</p>
									</div>

									<PayPalButton />
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
							title="Want to help build Pepper?"
							description="Pepper is open source. Contributions are welcome — or come and say hi in the support server."
							actions={
								<>
									<ActionLink href={repo('Pepper-Bot')} external>
										Contribute on GitHub
										<ArrowUpRight className="h-4 w-4" />
									</ActionLink>
									<ActionLink href={discordServerLink} variant="ghost" external>
										<MessageSquare className="h-4 w-4" />
										Join the support server
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

export default Creator;
