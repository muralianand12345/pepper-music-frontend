import { Metadata, NextPage } from 'next';
import Link from 'next/link';
import {
	ArrowRight,
	ArrowUpRight,
	ChevronDown,
	GitPullRequest,
	HeartHandshake,
	MessageSquare,
	MessageSquareWarning,
	UserPlus,
} from 'lucide-react';

import {
	Cell,
	CellGrid,
	Eyebrow,
	IconChip,
	Rule,
	SectionHeading,
} from '@/components/shared/page/parts';
import Reveal from '@/components/shared/reveal';
import PayPalButton from '@/components/shared/support/paypalButton';
import UpkeepGrid from '@/components/shared/support/upkeepGrid';
import {
	discordServerLink,
	feedbackLink,
	inviteLink,
	paypalCurrency,
} from '@/constants';

export const metadata: Metadata = {
	title: 'Donate | Help keep Pepper free for everyone',
	description:
		'Pepper is a free Discord music bot with no premium tier. Donations help cover the audio nodes and lyrics service it runs on — any amount, through PayPal.',
	keywords: [
		'donate to Pepper',
		'support Pepper Discord bot',
		'free Discord music bot',
		'Pepper bot donation',
	],
};

const repoLink = 'https://github.com/muralianand12345/Pepper-Bot';

const inlineLink =
	'text-foreground/80 underline decoration-foreground/35 underline-offset-4 transition-colors hover:decoration-foreground';

const promises = [
	{ label: 'Unlocks', value: 'Nothing extra' },
	{ label: 'Amount', value: 'Whatever you choose' },
	{ label: 'Paid through', value: 'PayPal or card' },
];

const faqs: { q: string; a: React.ReactNode }[] = [
	{
		q: 'Does donating unlock anything?',
		a: 'No. Every command stays free for everyone, and donating does not change what Pepper does in your server. It is a thank-you, not a purchase.',
	},
	{
		q: 'Do I need a PayPal account?',
		a: 'No. Choose Checkout under the PayPal button to pay by debit or credit card as a guest, wherever PayPal offers that in your country.',
	},
	{
		q: `I am not in New Zealand — can I still donate?`,
		a: `Yes. Donations are taken in ${paypalCurrency}, and PayPal or your card provider converts from your own currency. PayPal shows you the exact amount before you confirm.`,
	},
	{
		q: 'What do you see about me?',
		a: 'PayPal handles the payment, so your card and bank details never reach us. PayPal shares your name, email address, the amount, and the Discord username you enter with the account receiving the donation.',
	},
	{
		q: 'Is my donation tax-deductible?',
		a: 'No. Pepper is a personal project, not a registered charity.',
	},
	{
		q: 'Something went wrong with my payment. What now?',
		a: (
			<>
				Open a ticket in the{' '}
				<a href={discordServerLink} target="_blank" rel="noreferrer" className={inlineLink}>
					support server
				</a>{' '}
				with the transaction ID from your PayPal receipt, and we will look
				into it.
			</>
		),
	},
];

const otherWays = [
	{
		icon: <GitPullRequest className="h-4 w-4" />,
		title: 'Contribute code',
		body: 'Pepper is open source. Fix a bug or build a feature and open a pull request.',
		href: repoLink,
		external: true,
	},
	{
		icon: <MessageSquareWarning className="h-4 w-4" />,
		title: 'Send feedback',
		body: 'Bug reports and ideas shape what ships next. It takes a minute.',
		href: feedbackLink,
		external: false,
	},
	{
		icon: <UserPlus className="h-4 w-4" />,
		title: 'Invite Pepper',
		body: 'Add it to another server that could use a music bot.',
		href: inviteLink,
		external: true,
	},
	{
		icon: <MessageSquare className="h-4 w-4" />,
		title: 'Join the community',
		body: 'Hang out in the support server and help people get set up.',
		href: discordServerLink,
		external: true,
	},
];

const DonatePage: NextPage = () => {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Hero. The form lives up here: it is what the page is for, and it
			    should not sit below a scroll of reasons to use it. */}
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
					{/* PayPal's form runs far taller than the copy, so on desktop the
					    copy rides alongside it rather than floating mid-column. */}
					<div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
						<div className="lg:sticky lg:top-28">
							<div className="rise" style={{ animationDelay: '40ms' }}>
								<Eyebrow>
									<HeartHandshake className="h-3 w-3" />
									Donate
								</Eyebrow>
							</div>

							<h1
								className="rise mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.035em] md:text-[3.5rem]"
								style={{ animationDelay: '100ms' }}
							>
								Keep Pepper free for everyone.
							</h1>

							<p
								className="rise mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg"
								style={{ animationDelay: '180ms' }}
							>
								Pepper has no premium tier and nothing behind a paywall. It is
								free to use, but not free to run — the audio nodes and lyrics
								service behind it are servers we host. If Pepper has earned its
								place in your server, a donation helps keep it there.
							</p>

							<div
								className="rise mt-9"
								style={{ animationDelay: '260ms' }}
							>
								<CellGrid className="sm:grid-cols-3">
									{promises.map((item) => (
										<Cell key={item.label} className="px-5 py-4">
											<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
												{item.label}
											</p>
											<p className="mt-2 text-[14px] font-semibold tracking-[-0.01em] text-foreground">
												{item.value}
											</p>
										</Cell>
									))}
								</CellGrid>
							</div>
						</div>

						<div className="rise" style={{ animationDelay: '220ms' }}>
							<PayPalButton />
						</div>
					</div>
				</div>
			</section>

			{/* Where it goes */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<Rule label="Where it goes" />
						</Reveal>
						<Reveal delay={0.04}>
							<SectionHeading
								className="mt-10"
								title="What your donation keeps running"
								description="Pepper is not run for profit. Donations go into the infrastructure that keeps it free for every server that invites it."
							/>
						</Reveal>
						<Reveal delay={0.08}>
							<UpkeepGrid className="mt-10" />
						</Reveal>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<SectionHeading label="FAQ" title="Before you donate" />
						</Reveal>
						<Reveal delay={0.08}>
							<div className="mt-10 divide-y divide-border overflow-hidden rounded-lg border border-border">
								{faqs.map((item) => (
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
					</div>
				</div>
			</section>

			{/* Other ways to help */}
			<section className="container mx-auto px-4 py-16 md:py-20">
				<div className="mx-auto max-w-5xl">
					<Reveal>
						<SectionHeading
							label="No money needed"
							title="Other ways to help"
							description="A donation is one way to back Pepper. These cost nothing and help just as much."
						/>
					</Reveal>
					<Reveal delay={0.08}>
						<CellGrid className="mt-10 sm:grid-cols-2 lg:grid-cols-4">
							{otherWays.map((way) => (
								<Link
									key={way.title}
									href={way.href}
									{...(way.external
										? { target: '_blank', rel: 'noreferrer' }
										: {})}
									className="group flex flex-col bg-background p-6 outline-none transition-colors duration-200 hover:bg-surface-hover focus-visible:bg-surface-hover"
								>
									<div className="flex items-start justify-between">
										<IconChip>{way.icon}</IconChip>
										{way.external ? (
											<ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
										) : (
											<ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
										)}
									</div>
									<h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground">
										{way.title}
									</h3>
									<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
										{way.body}
									</p>
								</Link>
							))}
						</CellGrid>
					</Reveal>
				</div>
			</section>
		</div>
	);
};

export default DonatePage;
