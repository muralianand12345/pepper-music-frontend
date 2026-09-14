import { FeedbackCategory } from '@/enums';
import { feedbackRatingLabels } from '@/constants';
import { FeedbackSubmission } from '@/types';

/**
 * Server-side Discord webhook client for the feedback form.
 * Never import this from a client component — it reads DISCORD_FEEDBACK_WEBHOOK_URL.
 *
 * Posts use Components V2 (`IS_COMPONENTS_V2`) rather than an embed: it gives us
 * a coloured container, real separators and a thumbnail without the embed
 * field grid. A Components V2 payload may not carry `content` or `embeds`.
 */

/** `MessageFlags.IS_COMPONENTS_V2` — https://discord.com/developers/docs/resources/message */
const COMPONENTS_V2_FLAG = 1 << 15;

/** Component type ids used below, from the Discord message components spec. */
const ComponentType = {
	SECTION: 9,
	TEXT_DISPLAY: 10,
	THUMBNAIL: 11,
	SEPARATOR: 14,
	CONTAINER: 17,
} as const;

const SeparatorSpacing = { SMALL: 1, LARGE: 2 } as const;

const categoryHeadings: Record<FeedbackCategory, string> = {
	[FeedbackCategory.BUG]: '🐞 Bug report',
	[FeedbackCategory.FEATURE]: '💡 Feature idea',
	[FeedbackCategory.AUDIO]: '🎧 Audio quality',
	[FeedbackCategory.GENERAL]: '💬 General feedback',
};

/** Red for a poor score, amber for the middle, green for a happy one. */
const accentColorFor = (rating: number): number => {
	if (rating <= 2) return 0xed4245;
	if (rating === 3) return 0xfee75c;
	return 0x57f287;
};

const starsFor = (rating: number): string =>
	'★'.repeat(rating) + '☆'.repeat(5 - rating);

/**
 * Keeps user text from rearranging the post: strips zero-width characters,
 * caps blank runs, and quotes every line so markdown stays inside the block.
 */
const asBlockquote = (message: string): string =>
	message
		.replace(/[\u200B-\u200D\uFEFF]/g, '')
		.replace(/\r\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.split('\n')
		.map((line) => `> ${line}`)
		.join('\n');

const resolveThumbnailUrl = (): string | null => {
	const base = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/+$/, '');
	return base?.startsWith('http') ? `${base}/images/pepperLogo.png` : null;
};

interface WebhookContext {
	/** Coarse origin hint for triage — never the raw address. */
	source?: string;
}

const buildComponents = (
	feedback: Required<Pick<FeedbackSubmission, 'rating' | 'category' | 'message'>> & {
		discordUsername?: string;
	},
	context: WebhookContext,
) => {
	const { rating, category, message, discordUsername } = feedback;
	const sentAt = Math.floor(Date.now() / 1000);

	const heading = {
		type: ComponentType.TEXT_DISPLAY,
		content: `## ${categoryHeadings[category]}\n${starsFor(rating)} **${rating}/5** · ${
			feedbackRatingLabels[rating] ?? 'Rated'
		}`,
	};

	const thumbnailUrl = resolveThumbnailUrl();

	const meta = [
		`**From** ${discordUsername ? `\`${discordUsername}\`` : '_anonymous_'}`,
		`**Sent** <t:${sentAt}:f> · <t:${sentAt}:R>`,
		`**Via** ${context.source ?? 'pepper.muralianand.in/feedback'}`,
	].join('\n');

	return [
		{
			type: ComponentType.CONTAINER,
			accent_color: accentColorFor(rating),
			components: [
				thumbnailUrl
					? {
							type: ComponentType.SECTION,
							components: [heading],
							accessory: {
								type: ComponentType.THUMBNAIL,
								media: { url: thumbnailUrl },
							},
						}
					: heading,
				{
					type: ComponentType.SEPARATOR,
					divider: true,
					spacing: SeparatorSpacing.SMALL,
				},
				{
					type: ComponentType.TEXT_DISPLAY,
					content: asBlockquote(message),
				},
				{
					type: ComponentType.SEPARATOR,
					divider: true,
					spacing: SeparatorSpacing.SMALL,
				},
				{ type: ComponentType.TEXT_DISPLAY, content: meta },
			],
		},
	];
};

/**
 * Delivers one submission to the feedback webhook. Resolves on success and
 * throws with the Discord response body attached so the route can log it.
 */
export const sendFeedbackWebhook = async (
	feedback: Required<Pick<FeedbackSubmission, 'rating' | 'category' | 'message'>> & {
		discordUsername?: string;
	},
	context: WebhookContext = {},
): Promise<void> => {
	const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK_URL?.trim();
	if (!webhookUrl) throw new Error('DISCORD_FEEDBACK_WEBHOOK_URL is not configured');

	let endpoint: URL;
	try {
		endpoint = new URL(webhookUrl);
	} catch {
		throw new Error('DISCORD_FEEDBACK_WEBHOOK_URL is not a valid URL');
	}
	endpoint.searchParams.set('wait', 'true');
	// Required, and easy to miss: a webhook created from Server Settings is not
	// application-owned, so Discord silently DROPS `components` without this.
	// Combined with IS_COMPONENTS_V2 (which forbids content/embeds) that leaves
	// an empty message and the request fails with 400.
	endpoint.searchParams.set('with_components', 'true');

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		cache: 'no-store',
		body: JSON.stringify({
			username: 'Pepper Feedback',
			flags: COMPONENTS_V2_FLAG,
			// Belt and braces alongside the blockquote: nothing in a submission pings.
			allowed_mentions: { parse: [] },
			components: buildComponents(feedback, context),
		}),
	});

	if (!response.ok) {
		const detail = await response.text().catch(() => '');
		throw new Error(
			`Discord webhook responded with ${response.status}${detail ? `: ${detail}` : ''}`,
		);
	}
};
