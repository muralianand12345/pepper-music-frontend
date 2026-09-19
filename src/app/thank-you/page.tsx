import { Metadata } from 'next';
import {
	ArrowRight,
	HeartHandshake,
	LifeBuoy,
	Mail,
	MessageSquare,
	Radio,
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
} from '@/components/shared/page/parts';
import Reveal from '@/components/shared/reveal';
import UpkeepGrid from '@/components/shared/support/upkeepGrid';
import Celebration from '@/components/shared/thanks/celebration';
import TransactionReference from '@/components/shared/thanks/transactionReference';
import { discordServerLink, featursLink, inviteLink } from '@/constants';

/**
 * Where PayPal sends people after they pay — this page's URL is the auto-return
 * URL on the PayPal payment link. It is linked from nowhere on the site and kept
 * out of the index and the sitemap.
 *
 * With auto-return on, PayPal appends Payment Data Transfer fields to the URL.
 * Only two are read, and neither is trusted: anyone can type this address, so
 * the page never claims an amount, and it grants nothing. `tx` is shown so the
 * payer can quote it in a ticket; `st` only softens the copy when PayPal is
 * still clearing the payment.
 */
export const metadata: Metadata = {
	title: 'Thank you | Pepper',
	description:
		'Thank you for supporting Pepper, the free Discord music bot. Your support keeps it free for everyone.',
	robots: { index: false, follow: false },
};

// PayPal transaction IDs are 17 uppercase alphanumerics. Anything else is
// dropped rather than echoed back, so the page cannot be made to display text.
const TRANSACTION_ID = /^[A-Z0-9]{17}$/;

const first = (value: string | string[] | undefined) =>
	Array.isArray(value) ? value[0] : value;

const nextSteps = [
	{
		icon: <Mail className="h-4 w-4" />,
		title: 'Check your inbox',
		body: 'PayPal has emailed a receipt to the address on your PayPal account. The transaction ID on it is how we find your payment.',
	},
	{
		icon: <MessageSquare className="h-4 w-4" />,
		title: 'Say hi, if you like',
		body: 'Drop into the support server and let us know. It is always good to hear from the people keeping Pepper going.',
	},
	{
		icon: <LifeBuoy className="h-4 w-4" />,
		title: 'Something look wrong?',
		body: 'Charged twice, or the wrong amount? Open a ticket in the support server with your transaction ID and we will look into it.',
	},
];

const ThankYouPage = async ({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
	const params = await searchParams;
	const tx = first(params.tx)?.trim().toUpperCase();
	const transactionId = tx && TRANSACTION_ID.test(tx) ? tx : null;
	const pending = first(params.st)?.toLowerCase() === 'pending';

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Hero. Animates on load, like the home page's — it is already in view. */}
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
					<div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
						<div className="order-2 lg:order-1">
							<div className="rise" style={{ animationDelay: '40ms' }}>
								<Eyebrow>
									<HeartHandshake className="h-3 w-3" />
									{pending ? 'Payment processing' : 'Thank you'}
								</Eyebrow>
							</div>

							<h1
								className="rise mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-[-0.035em] md:text-[3.5rem]"
								style={{ animationDelay: '100ms' }}
							>
								You just kept the music playing.
							</h1>

							<p
								className="rise mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg"
								style={{ animationDelay: '180ms' }}
							>
								Pepper has no premium tier and nothing behind a paywall, so it
								runs on people who chip in — and today, that is you.{' '}
								{pending
									? 'PayPal is still clearing the payment and will email you once it has gone through.'
									: 'PayPal has emailed your receipt, so there is nothing else you need to do.'}
							</p>

							{transactionId && (
								<div className="rise mt-6" style={{ animationDelay: '220ms' }}>
									<TransactionReference id={transactionId} />
								</div>
							)}

							<div
								className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
								style={{ animationDelay: '260ms' }}
							>
								<ActionLink href={discordServerLink} external>
									<MessageSquare className="h-4 w-4" />
									Join the support server
								</ActionLink>
								<ActionLink href="/stats" variant="ghost">
									<Radio className="h-4 w-4" />
									See what is playing now
								</ActionLink>
							</div>
						</div>

						{/* Mascot first on a phone: the celebration is the message, and it
						    should not be scrolled past to reach it. */}
						<div
							className="rise order-1 mx-auto w-full max-w-[13rem] sm:max-w-[16rem] lg:order-2 lg:max-w-[20rem]"
							style={{ animationDelay: '60ms' }}
						>
							<Celebration />
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
								title="What you are helping keep running"
								description="Pepper is not run for profit. Support like yours goes into the infrastructure that keeps it free for every server that invites it."
							/>
						</Reveal>
						<Reveal delay={0.08}>
							<UpkeepGrid className="mt-10" />
						</Reveal>
					</div>
				</div>
			</section>

			{/* What happens next */}
			<section className="border-b border-border">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="mx-auto max-w-5xl">
						<Reveal>
							<SectionHeading label="What happens next" title="Not much — and that is the point" />
						</Reveal>
						<Reveal delay={0.08}>
							<CellGrid className="mt-10 md:grid-cols-3">
								{nextSteps.map((step, index) => (
									<Cell key={step.title} className="flex flex-col p-6">
										<div className="flex items-center justify-between">
											<IconChip>{step.icon}</IconChip>
											<span className="font-mono text-[11px] font-medium tabular-nums tracking-[0.18em] text-muted-foreground">
												{String(index + 1).padStart(2, '0')}
											</span>
										</div>
										<h3 className="mt-4 text-base font-semibold tracking-[-0.01em] text-foreground">
											{step.title}
										</h3>
										<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
											{step.body}
										</p>
									</Cell>
								))}
							</CellGrid>
						</Reveal>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="container mx-auto px-4 py-16 md:py-20">
				<div className="mx-auto max-w-5xl">
					<Reveal>
						<CtaBand
							title="Now, back to the music."
							description="Queue something up — or bring Pepper to another server that could use it."
							actions={
								<>
									<ActionLink href={inviteLink} external>
										Add Pepper to Discord
										<ArrowRight className="h-4 w-4" />
									</ActionLink>
									<ActionLink href={featursLink} variant="ghost">
										Explore the commands
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

export default ThankYouPage;
