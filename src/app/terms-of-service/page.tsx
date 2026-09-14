import { Metadata, NextPage } from 'next';
import Link from 'next/link';
import {
	AlertTriangle,
	Ban,
	Code2,
	Gavel,
	Handshake,
	Heart,
	MessageSquare,
	RefreshCw,
	ScrollText,
	ServerCog,
	ShieldAlert,
	Sparkles,
	UserCheck,
	Wallet,
} from 'lucide-react';

import LegalPage, {
	LegalHighlight,
	LegalSection,
} from '@/components/shared/legal/legalPage';
import { Bullets, Note, Prose, Term } from '@/components/shared/legal/parts';
import { discordServerLink, privacyLink } from '@/constants';

interface Props {}

export const metadata: Metadata = {
	title: 'Terms of Service | Use Guidelines for Pepper Music Bot',
	description:
		'The Terms of Service for Pepper Music Bot — eligibility, acceptable use, server admin responsibilities, connected accounts, disclaimers, liability and governing law.',
	keywords: [
		'Pepper Terms of Service',
		'Pepper bot TOS',
		'Discord bot terms',
		'Pepper user agreement',
		'Pepper bot rules',
		'Discord bot usage policy',
		'intellectual property Pepper bot',
		'user conduct Pepper Music Bot',
		'Pepper Discord compliance',
	],
};

const inlineLink =
	'font-medium text-foreground underline decoration-foreground/35 underline-offset-4 transition-colors hover:decoration-foreground';

const highlights: LegalHighlight[] = [
	{
		icon: <Wallet className="h-4 w-4" />,
		title: 'Free to use',
		body: 'Pepper charges nothing. There is no paid tier, subscription or in-bot purchase.',
	},
	{
		icon: <UserCheck className="h-4 w-4" />,
		title: '13+ and Discord’s rules',
		body: 'You must meet Discord’s minimum age and keep to their Terms while using Pepper.',
	},
	{
		icon: <ServerCog className="h-4 w-4" />,
		title: 'Admins are responsible',
		body: 'Whoever adds Pepper to a server is responsible for how it is used there.',
	},
	{
		icon: <AlertTriangle className="h-4 w-4" />,
		title: 'Provided as-is',
		body: 'No uptime guarantee. Pepper is a community project run on a best-effort basis.',
	},
];

const sections: LegalSection[] = [
	{
		id: 'acceptance',
		title: 'Acceptance of these terms',
		icon: <Handshake className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					These Terms of Service (the &quot;Terms&quot;) govern your use of the{' '}
					<Term>Pepper music bot</Term> (the &quot;Bot&quot;) and the website at{' '}
					<Term>pepper.muralianand.in</Term>. By adding Pepper to a Discord server,
					issuing any of its commands, or using the website, you agree to these
					Terms. If you do not agree, stop using the Bot.
				</p>
				<p>
					These Terms work alongside our{' '}
					<Link href={privacyLink} className={inlineLink}>
						Privacy Policy
					</Link>
					, which explains how we handle your information, and alongside
					Discord&apos;s own Terms of Service and Community Guidelines, which
					continue to apply to everything you do on Discord.
				</p>
			</Prose>
		),
	},
	{
		id: 'eligibility',
		title: 'Eligibility',
		icon: <UserCheck className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					You may use Pepper only if you are at least 13 years old, or older
					where your country sets a higher minimum age for using Discord, and
					you are not barred from using the service under applicable law.
				</p>
				<p>
					If you use Pepper on behalf of an organisation or community, you
					confirm you have the authority to accept these Terms for it.
				</p>
			</Prose>
		),
	},
	{
		id: 'the-service',
		title: 'What Pepper provides',
		icon: <Sparkles className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Pepper is a Discord music bot. It searches for tracks, streams audio
					into voice channels, manages queues and filters, offers autoplay
					recommendations, shows listening statistics and lyrics, and can be
					localised into the languages it supports.
				</p>
				<Note title="No YouTube">
					Pepper does not stream from YouTube or YouTube Music — YouTube's terms
					of service do not permit it. If you give it a YouTube link, Pepper
					resolves the same track on Spotify and plays that instead; a link that
					does not point at music will not play at all.
				</Note>
				<Note title="No paid plans">
					Pepper is free. Some features — such as linking a Spotify account with{' '}
					<Term>/login</Term>, unlimited playlist queueing, and room for 5 custom
					playlists of 50 songs each with <Term>/playlist</Term> instead of 1
					playlist of 10 — are unlocked by joining our{' '}
					<Link
						href={discordServerLink}
						target="_blank"
						rel="noreferrer"
						className={inlineLink}
					>
						support server
					</Link>
					. That is free too. We do not sell subscriptions and will never ask
					you for payment details.
				</Note>
				<p>
					Features may be added, changed, limited or withdrawn at any time as
					the project evolves, and voice, search or lyric functionality may
					depend on third-party services outside our control.
				</p>
			</Prose>
		),
	},
	{
		id: 'connected-accounts',
		title: 'Connected accounts',
		icon: <RefreshCw className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					You may optionally link a Spotify account using <Term>/login</Term>.
					By doing so you authorise Pepper to read your Spotify playlists on
					your behalf, so that you can queue them through the Bot.
				</p>
				<Bullets
					items={[
						'Only link accounts that belong to you.',
						'Your linked account remains subject to that platform’s own terms — we are not affiliated with Spotify.',
						<>
							You can disconnect at any time with <Term>/logout</Term>, or
							revoke access directly from your Spotify account settings.
						</>,
					]}
				/>
			</Prose>
		),
	},
	{
		id: 'acceptable-use',
		title: 'Acceptable use',
		icon: <Ban className="h-4 w-4" />,
		content: (
			<Prose>
				<p>When using Pepper, you agree not to:</p>
				<Bullets
					items={[
						'Use the Bot for anything unlawful, or in a way that infringes copyright or other rights.',
						'Harass, threaten, defame or endanger anyone, or play content intended to harm or distress others.',
						'Give a playlist a name that is abusive, hateful or impersonates someone — public playlist names are shown on our website, and we may make private or remove any playlist that breaks these rules.',
						'Abuse, spam or automate commands in a way that degrades the service for others, or attempt to bypass cooldowns, DJ restrictions or usage limits.',
						'Probe, scan, reverse-engineer or attack the Bot, its API, its audio nodes or any connected system, or attempt to access data that is not yours.',
						'Resell, rent or commercially exploit access to the Bot, or present it as your own service.',
						'Use the Bot to circumvent restrictions or licensing on any music platform.',
					]}
				/>
				<p>
					You are responsible for the content you queue and for the consequences
					of your commands in the servers you use Pepper in.
				</p>
			</Prose>
		),
	},
	{
		id: 'server-responsibilities',
		title: 'Server administrator responsibilities',
		icon: <ServerCog className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					If you add Pepper to a server or manage one where it runs, you agree
					that:
				</p>
				<Bullets
					items={[
						'You have permission to add bots to that server and to grant the permissions Pepper requests.',
						<>
							You will make your members aware that playback activity is
							recorded as described in our{' '}
							<Link href={privacyLink} className={inlineLink}>
								Privacy Policy
							</Link>
							, including that server and user listening statistics may appear
							in aggregate on our public statistics page.
						</>,
						'You are responsible for configuring the DJ role and moderating how your community uses the Bot.',
						'Removing Pepper from your server stops further collection of that server’s data; you may ask us to delete what was already stored.',
					]}
				/>
			</Prose>
		),
	},
	{
		id: 'content-and-third-parties',
		title: 'Music content and third-party services',
		icon: <ScrollText className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Pepper does not host, own or license any music. It resolves the
					queries you provide and streams audio from third-party sources through
					audio nodes. All rights in that content belong to the respective
					owners, and your use of it must comply with the terms of the platform
					it comes from and with applicable copyright law.
				</p>
				<p>
					Lyrics, artwork and metadata are supplied by third parties and may be
					inaccurate, incomplete or unavailable. We do not warrant any of it. If
					you believe content accessible through Pepper infringes your rights,
					contact us and we will act on valid reports.
				</p>
			</Prose>
		),
	},
	{
		id: 'availability',
		title: 'Availability and changes',
		icon: <RefreshCw className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Pepper is offered on a best-effort basis with no uptime guarantee. It
					may be unavailable during maintenance, deployments, outages at Discord
					or our audio providers, or for reasons outside our control. Queues,
					settings and history may be lost during such events.
				</p>
				<p>
					We may modify, suspend or discontinue the Bot, any feature, or the
					website at any time, with or without notice. Where a change materially
					affects users, we will try to announce it in our support server first.
				</p>
			</Prose>
		),
	},
	{
		id: 'intellectual-property',
		title: 'Intellectual property',
		icon: <Code2 className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					The Pepper name, logo, website design and branding belong to us. These
					Terms grant you a limited, revocable, non-exclusive and
					non-transferable right to use the hosted Bot as intended — nothing
					more.
				</p>
				<p>
					The Bot&apos;s software, content and associated intellectual property
					are owned by or licensed to us. You may not reproduce, modify,
					distribute, sell or otherwise exploit any part of it without our prior
					written permission.
				</p>
			</Prose>
		),
	},
	{
		id: 'feedback',
		title: 'Feedback and contributions',
		icon: <Heart className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					If you send us ideas, bug reports or suggestions — through{' '}
					<Term>/feedback</Term> or our support server — you grant us the right
					to use them to improve Pepper without obligation,
					compensation or confidentiality. Do not send us anything you consider
					confidential or that you are not free to share.
				</p>
			</Prose>
		),
	},
	{
		id: 'suspension',
		title: 'Suspension and termination',
		icon: <ShieldAlert className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					We may restrict, suspend or permanently block your access — or a
					server&apos;s access — to Pepper at any time, without prior notice,
					if we reasonably believe these Terms have been breached, if the Bot is
					being abused, or if it is necessary to protect the service or its
					users.
				</p>
				<p>
					You can stop using Pepper at any time by removing it from your server
					or ceasing to use its commands. Sections that by their nature should
					survive — intellectual property, disclaimers, liability, governing law
					— continue to apply after your access ends.
				</p>
			</Prose>
		),
	},
	{
		id: 'disclaimers',
		title: 'Disclaimers',
		icon: <AlertTriangle className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Pepper is provided <Term>&quot;as is&quot;</Term> and{' '}
					<Term>&quot;as available&quot;</Term>, without warranties of any kind,
					whether express, implied or statutory, including any implied
					warranties of merchantability, fitness for a particular purpose,
					accuracy or non-infringement.
				</p>
				<p>
					We do not warrant that the Bot will be uninterrupted, timely, secure
					or error-free, that recommendations, statistics or lyrics will be
					accurate, or that stored data will never be lost. Pepper is an
					independent project and is not affiliated with or endorsed by Discord,
					Spotify or any other platform.
				</p>
			</Prose>
		),
	},
	{
		id: 'liability',
		title: 'Limitation of liability',
		icon: <Gavel className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					To the maximum extent permitted by law, we will not be liable for any
					indirect, incidental, special, consequential or punitive damages, or
					for any loss of data, revenue, profits, goodwill or opportunity,
					arising out of or connected with your use of — or inability to use —
					Pepper, even if we have been advised of the possibility.
				</p>
				<p>
					Because Pepper is provided free of charge, our total aggregate
					liability to you for all claims relating to the Bot is limited to the
					greater of the amount you paid us to use it (which is nothing) or INR
					1,000. Nothing in these Terms excludes liability that cannot lawfully
					be excluded.
				</p>
				<p>
					You agree to indemnify and hold us harmless from claims, damages and
					costs arising from your misuse of the Bot or your breach of these
					Terms or of any third party&apos;s rights.
				</p>
			</Prose>
		),
	},
	{
		id: 'governing-law',
		title: 'Governing law and disputes',
		icon: <Gavel className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					These Terms are governed by the laws of India, without regard to
					conflict-of-law rules. Any dispute arising out of or relating to these
					Terms or to Pepper is subject to the exclusive jurisdiction of the
					courts located in Tamil Nadu, India.
				</p>
				<p>
					If any provision of these Terms is found unenforceable, the rest
					remains in force. Our failure to enforce a provision is not a waiver
					of it.
				</p>
			</Prose>
		),
	},
	{
		id: 'changes',
		title: 'Changes to these terms',
		icon: <RefreshCw className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					We may revise these Terms as Pepper changes. The &quot;last
					updated&quot; date at the top of this page always reflects the current
					version, and significant changes will be announced in our support
					server. Continuing to use Pepper after the revised Terms are posted
					means you accept them.
				</p>
			</Prose>
		),
	},
	{
		id: 'contact',
		title: 'Contact us',
		icon: <MessageSquare className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					For questions about these Terms, reports of misuse, or copyright
					concerns, reach us in our{' '}
					<Link
						href={discordServerLink}
						target="_blank"
						rel="noreferrer"
						className={inlineLink}
					>
						official Discord server
					</Link>
					.
				</p>
			</Prose>
		),
	},
];

const TermsOfService: NextPage<Props> = ({}) => {
	return (
		<LegalPage
			eyebrow="Legal"
			title="Terms of Service"
			summary="The agreement between you and Pepper: who can use the Bot, how it may be used, what we promise, and what we do not."
			updated="September 14, 2026"
			effective="September 14, 2026"
			highlights={highlights}
			sections={sections}
			related={{
				label: 'Privacy Policy',
				href: privacyLink,
				description:
					'What Pepper stores, who else sees it, and how to have it deleted.',
			}}
			agreement="By using Pepper, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them."
		/>
	);
};

export default TermsOfService;
