import { Metadata, NextPage } from 'next';
import Link from 'next/link';
import {
	Baby,
	Bell,
	BarChart3,
	Database,
	Eye,
	Globe,
	Lock,
	Music4,
	Scale,
	Share2,
	ShieldCheck,
	Trash2,
	UserCheck,
	MessageSquare,
} from 'lucide-react';

import LegalPage, {
	LegalHighlight,
	LegalSection,
} from '@/components/shared/legal/legalPage';
import {
	Bullets,
	DataTable,
	Note,
	Prose,
	Term,
} from '@/components/shared/legal/parts';
import { discordServerLink, termsLink } from '@/constants';

interface Props {}

export const metadata: Metadata = {
	title: 'Privacy Policy | How Pepper Music Bot Handles Your Data',
	description:
		'How Pepper Music Bot collects, uses, stores and deletes your data — Discord identifiers, listening history, connected Spotify accounts, public stats and your rights.',
	keywords: [
		'Pepper privacy policy',
		'Discord bot privacy policy',
		'data collection Discord bot',
		'Pepper bot data usage',
		'user privacy Discord',
		'Spotify Discord bot privacy',
		'Discord bot data deletion',
		'Lavalink bot privacy policy',
	],
};

const inlineLink =
	'font-medium text-foreground underline decoration-foreground/35 underline-offset-4 transition-colors hover:decoration-foreground';

const highlights: LegalHighlight[] = [
	{
		icon: <ShieldCheck className="h-4 w-4" />,
		title: 'We never sell your data',
		body: 'No advertising networks, no data brokers, no selling or renting of anything we hold.',
	},
	{
		icon: <Music4 className="h-4 w-4" />,
		title: 'Music data, not messages',
		body: 'Pepper stores the tracks you play. It does not read, store or scan your chat messages.',
	},
	{
		icon: <UserCheck className="h-4 w-4" />,
		title: 'Spotify stays optional',
		body: 'Linking Spotify is opt-in via /login, limited to reading playlists, and revoked with /logout.',
	},
	{
		icon: <Trash2 className="h-4 w-4" />,
		title: 'Deletion on request',
		body: 'Ask in our support server and we will erase your stored history and connections.',
	},
];

const sections: LegalSection[] = [
	{
		id: 'overview',
		title: 'Overview & scope',
		icon: <Eye className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					This Privacy Policy explains what information the{' '}
					<Term>Pepper music bot</Term> (the &quot;Bot&quot;) and the website at{' '}
					<Term>pepper.mrbotz.com</Term> collect, why we collect it, how long we
					keep it, and the choices you have. It applies to everyone who uses
					Pepper in a Discord server, links an account to it, or browses the
					website.
				</p>
				<p>
					Pepper is an independent project. It is not affiliated with, endorsed
					by, or operated by Discord, Spotify, Apple, SoundCloud, Deezer or any
					other platform it can play from. Your use of those platforms remains
					governed by their own policies.
				</p>
				<Note title="In short">
					Pepper stores what it needs to play music, keep your queue and
					preferences working, power recommendations and your{' '}
					<Term>/chart</Term> statistics, and keep the service running. Nothing
					more.
				</Note>
			</Prose>
		),
	},
	{
		id: 'information-we-collect',
		title: 'Information we collect',
		icon: <Database className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Pepper has no sign-up form. Everything below is collected as a
					by-product of using the Bot&apos;s commands inside Discord.
				</p>
				<DataTable
					rows={[
						{
							label: 'Discord identifiers',
							detail:
								'Your user ID, username, discriminator and avatar URL, stored alongside tracks you request.',
							purpose:
								'To attribute queued tracks to the right person, apply per-user settings and cooldowns, and show who requested what.',
						},
						{
							label: 'Server identifiers',
							detail:
								'Guild ID, the DJ role ID you configure, and the server language preference.',
							purpose:
								'To keep per-server settings, permissions and localisation working across restarts.',
						},
						{
							label: 'Listening history',
							detail:
								'Track title, artist, duration, ISRC, source platform, artwork URL, track link, play count and the time it was played — recorded per user and per server.',
							purpose:
								'To power the /chart command, queue features and aggregate statistics.',
						},
						{
							label: 'Custom playlists',
							detail:
								'If you use /playlist: each playlist’s name, share code, owner, visibility, songs (track details plus who added each one and when), play count and when it was last played. A transfer offer records who it was sent to and expires after 24 hours; songs offered to pick from while adding are held for 10 minutes.',
							purpose:
								'To save, play, share and transfer the playlists you build, and to rank public playlists on our statistics page.',
						},
						{
							label: 'Connected Spotify account',
							detail:
								'If you run /login: an OAuth access token, a refresh token and your Spotify display name.',
							purpose:
								'To read your own Spotify playlists so you can queue them with Pepper.',
						},
						{
							label: 'Server metadata',
							detail:
								'When Pepper is added to or removed from a server: server ID, name, icon, owner, approximate member count and creation date.',
							purpose:
								'Operational logging, abuse handling and capacity planning.',
						},
						{
							label: 'Feedback submissions',
							detail:
								'The text you submit through /feedback, along with your Discord tag, user ID and the server you sent it from.',
							purpose:
								'To reply to you, reproduce bugs and act on suggestions.',
						},
						{
							label: 'Technical logs',
							detail:
								'Command names, errors, playback failures and timing data, kept in short-lived operational logs.',
							purpose:
								'To detect outages, fix bugs and protect the service from abuse.',
						},
						{
							label: 'Website analytics',
							detail:
								'Google Analytics collects standard usage data (pages viewed, approximate region, device and browser) when you visit our website.',
							purpose:
								'To understand which pages are useful. The website has no login and stores no personal account data.',
						},
					]}
				/>
				<Note title="What Pepper does not collect">
					Pepper does not read, store or analyse the content of your messages,
					does not record voice channels, does not collect email addresses,
					phone numbers or payment details, and does not track your activity
					outside Discord and this website.
				</Note>
			</Prose>
		),
	},
	{
		id: 'how-we-use-data',
		title: 'How we use your information',
		icon: <BarChart3 className="h-4 w-4" />,
		content: (
			<Prose>
				<p>We use the information described above only to:</p>
				<Bullets
					items={[
						<>
							<Term>Run the Bot</Term> — resolve searches, queue and play
							tracks, apply filters, loops and volume, and restore state after
							a restart or node failover.
						</>,
						<>
							<Term>Continue playback</Term> — when the queue empties, autoplay
							picks the next track from the audio platform's own
							recommendations for what is playing. It does not read your stored
							listening history.
						</>,
						<>
							<Term>Show your statistics</Term> — the <Term>/chart</Term>{' '}
							command reports your own top tracks, artists and listening time,
							plus the same for the server you run it in.
						</>,
						<>
							<Term>Localise responses</Term> — your saved language preference
							selects one of Pepper&apos;s supported translations.
						</>,
						<>
							<Term>Enforce permissions</Term> — the DJ role and command
							cooldowns depend on stored identifiers.
						</>,
						<>
							<Term>Maintain and improve the service</Term> — diagnosing bugs,
							investigating abuse and planning capacity.
						</>,
						<>
							<Term>Publish aggregate statistics</Term> — see the section on
							public statistics below.
						</>,
					]}
				/>
				<p>
					We do not use your data to build advertising profiles, and we do not
					make automated decisions that have legal or similarly significant
					effects on you.
				</p>
			</Prose>
		),
	},
	{
		id: 'spotify',
		title: 'Linking a Spotify account',
		icon: <Music4 className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Linking Spotify is entirely optional. Pepper works fully without it.
					When you run <Term>/login spotify</Term>, you are sent to
					Spotify&apos;s own authorisation page — Pepper never sees your Spotify
					password.
				</p>
				<Bullets
					items={[
						<>
							<Term>Scope requested:</Term>{' '}
							<Term>playlist-read-private</Term> and{' '}
							<Term>playlist-read-collaborative</Term> — permission to read
							your playlists, and nothing else.
						</>,
						<>
							<Term>What Pepper cannot do:</Term> it cannot modify or delete
							your playlists, cannot follow or unfollow anything, cannot post
							to your account, and cannot see your Spotify listening activity
							or account details beyond your display name.
						</>,
						<>
							<Term>What is stored:</Term> the access and refresh tokens
							Spotify issues, and your Spotify display name, held so the link
							survives restarts without asking you to sign in again.
						</>,
						<>
							<Term>How to revoke:</Term> run <Term>/logout</Term> and the
							stored tokens are deleted immediately. You can also revoke access
							at any time from your Spotify account&apos;s{' '}
							<Term>Apps</Term> settings page.
						</>,
					]}
				/>
			</Prose>
		),
	},
	{
		id: 'public-statistics',
		title: 'Public statistics page',
		icon: <Globe className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Our website publishes aggregate statistics about Pepper — total tracks
					played, popular songs and artists, active servers and a live view of
					what is currently playing across the network.
				</p>
				<Note title="Worth knowing">
					The &quot;top requesters&quot; leaderboard shows{' '}
					<Term>Discord usernames and avatars</Term> of the people who have
					played the most tracks. Bot accounts are excluded. If you would rather
					not appear there, ask us in the support server and we will exclude
					you.
				</Note>
				<Note title="Public playlists">
					A playlist you make public with <Term>/playlist visibility</Term> can
					appear on the statistics page once it has been played — its{' '}
					<Term>name, share code, song and play counts</Term>, and your Discord
					username and avatar as its owner. Private playlists are only counted;
					nothing else about them is published. Make a playlist private again
					and it drops off the page within a few minutes.
				</Note>
				<p>
					Server-level statistics are keyed by server ID and reflect what was
					played by that community. Private message content, member lists and
					voice activity are never part of these statistics.
				</p>
			</Prose>
		),
	},
	{
		id: 'third-parties',
		title: 'Third-party services',
		icon: <Share2 className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Pepper relies on a small number of external services to work. Each one
					receives only what it needs:
				</p>
				<Bullets
					items={[
						<>
							<Term>Discord</Term> — the platform Pepper runs on. All
							interactions pass through Discord and are subject to their
							privacy policy.
						</>,
						<>
							<Term>Music platforms</Term> — our audio servers fetch the track
							itself from the source platform. Those platforms see a request
							from our infrastructure, not from you.
						</>,
						<>
							<Term>Spotify</Term> — contacted only when you have linked an
							account, and only to read your playlists.
						</>,
						<>
							<Term>Database and hosting providers</Term> — store the data
							described in this policy on our behalf under their own security
							commitments.
						</>,
						<>
							<Term>Google Analytics</Term> — website usage measurement only.
							It is not used inside the Bot.
						</>,
					]}
				/>
				<Note title="Run by us, not by third parties">
					The audio (Lavalink) servers Pepper streams through and the lyrics
					service behind <Term>/lyrics</Term> are hosted by us. Those parts of the
					service pass nothing to an outside company: <Term>/lyrics</Term> sends
					only a track link to our own service, with no user identifier attached.
				</Note>
				<p>
					We do not sell, rent or trade your information. We disclose it only to
					these service providers, or where required to comply with a valid
					legal obligation, or to investigate abuse and protect the safety and
					integrity of the service.
				</p>
			</Prose>
		),
	},
	{
		id: 'retention-deletion',
		title: 'Retention & deletion',
		icon: <Trash2 className="h-4 w-4" />,
		content: (
			<Prose>
				<Bullets
					items={[
						<>
							<Term>Listening history and preferences</Term> are kept while you
							continue to use Pepper, because they power <Term>/chart</Term> and
							the statistics on this site.
						</>,
						<>
							<Term>Spotify tokens</Term> are deleted immediately when you run{' '}
							<Term>/logout</Term>.
						</>,
						<>
							<Term>Custom playlists</Term> are kept until you delete them with{' '}
							<Term>/playlist delete</Term>, which erases the playlist and its
							songs immediately.
						</>,
						<>
							<Term>Technical logs</Term> are short-lived and rotate out
							automatically.
						</>,
						<>
							<Term>Server data</Term> may be removed once Pepper is no longer
							in that server.
						</>,
					]}
				/>
				<p>
					To request deletion of your personal data, contact us in our{' '}
					<Link
						href={discordServerLink}
						target="_blank"
						rel="noreferrer"
						className={inlineLink}
					>
						official Discord server
					</Link>
					. We will verify that the request comes from the account in question
					and action it, keeping only what we are legally required to retain.
				</p>
			</Prose>
		),
	},
	{
		id: 'your-rights',
		title: 'Your choices and rights',
		icon: <Scale className="h-4 w-4" />,
		content: (
			<Prose>
				<p>Depending on where you live, you may have the right to:</p>
				<Bullets
					items={[
						'Access a copy of the personal data we hold about you.',
						'Ask us to correct information that is inaccurate.',
						'Ask us to delete your data.',
						'Withdraw a connection you previously authorised, such as Spotify.',
						'Object to, or ask us to restrict, certain processing.',
					]}
				/>
				<p>
					You can exercise all of these by contacting us in the support server.
					You can also limit what Pepper records simply by not using it — no
					data is collected about a member who never issues a command and whose
					tracks are never queued.
				</p>
			</Prose>
		),
	},
	{
		id: 'security',
		title: 'How we protect your data',
		icon: <Lock className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Access to Pepper&apos;s database is restricted to the maintainers who
					operate it. Traffic between Pepper, Discord and our providers uses
					encrypted connections, and the statistics API that powers our website
					is protected by a server-side key that is never exposed to browsers.
				</p>
				<p>
					No system is perfectly secure. We cannot guarantee absolute security,
					and you share information with Pepper at your own discretion. If we
					ever become aware of a breach affecting your data, we will inform
					affected users through our support server and, where required, the
					relevant authorities.
				</p>
			</Prose>
		),
	},
	{
		id: 'international',
		title: 'Where your data is processed',
		icon: <Globe className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Pepper is operated from India and uses hosting and audio infrastructure
					in several countries. By using the Bot, you understand that your
					information may be transferred to and processed in countries other
					than your own, which may have different data protection rules. We take
					reasonable steps to ensure it remains protected as described here.
				</p>
			</Prose>
		),
	},
	{
		id: 'children',
		title: "Children's privacy",
		icon: <Baby className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					Pepper is not directed at children. Discord requires users to be at
					least 13 years old, or older where local law sets a higher minimum,
					and the same applies to Pepper. We do not knowingly collect
					information from anyone below that age. If you believe a child has
					provided us with personal information, contact us and we will delete
					it promptly.
				</p>
			</Prose>
		),
	},
	{
		id: 'changes',
		title: 'Changes to this policy',
		icon: <Bell className="h-4 w-4" />,
		content: (
			<Prose>
				<p>
					We may update this Policy as Pepper evolves. The &quot;last
					updated&quot; date at the top of this page always reflects the current
					version, and material changes will be announced in our support server.
					Continuing to use Pepper after an update means you accept the revised
					Policy.
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
					Questions about this Policy, a data request, or something that looks
					wrong? Reach us in our{' '}
					<Link
						href={discordServerLink}
						target="_blank"
						rel="noreferrer"
						className={inlineLink}
					>
						official Discord server
					</Link>
					. We aim to respond to privacy requests within 30 days.
				</p>
			</Prose>
		),
	},
];

const PrivacyPolicy: NextPage<Props> = ({}) => {
	return (
		<LegalPage
			eyebrow="Legal"
			title="Privacy Policy"
			summary="What Pepper stores when you play music on Discord, why it stores it, who else sees it, and how to have it removed."
			updated="September 14, 2026"
			effective="September 14, 2026"
			highlights={highlights}
			sections={sections}
			related={{
				label: 'Terms of Service',
				href: termsLink,
				description:
					'The rules for using Pepper, what we promise, and what we do not.',
			}}
			agreement="By using Pepper, you acknowledge that you have read and understood this Privacy Policy and consent to the handling of information described in it."
		/>
	);
};

export default PrivacyPolicy;
