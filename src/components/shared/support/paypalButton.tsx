'use client';

import { useRef, useState } from 'react';
import Script from 'next/script';
import { ArrowUpRight } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import {
	paypalClientId,
	paypalCurrency,
	paypalHostedButtonId,
	paypalPaymentLink,
} from '@/constants';

declare global {
	interface Window {
		paypal?: {
			HostedButtons: (options: { hostedButtonId: string }) => {
				render: (selector: string) => Promise<void>;
			};
		};
	}
}

const sdkUrl = `https://www.paypal.com/sdk/js?${new URLSearchParams({
	'client-id': paypalClientId,
	components: 'hosted-buttons',
	'disable-funding': 'venmo',
	currency: paypalCurrency,
})}`;

const containerId = `paypal-container-${paypalHostedButtonId}`;

/**
 * PayPal's hosted button, rendered the React way.
 *
 * PayPal's own snippet renders on `DOMContentLoaded`, which has long since
 * fired by the time a client-side navigation reaches this component, so the
 * button would only ever appear on a hard load. `next/script` loads the SDK
 * once per session and calls `onReady` on every mount after that instead.
 *
 * The SDK is a frequent casualty of ad and tracker blockers. When it fails to
 * load or render, the same hosted button is offered as a plain payment link,
 * which checks out on paypal.com and needs no script at all.
 */
const PayPalButton = ({ className }: { className?: string }) => {
	const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>(
		'loading'
	);
	// StrictMode replays effects, and `onReady` with them; a second render into
	// the same container would stack a second set of buttons under the first.
	const rendered = useRef(false);

	const render = () => {
		if (rendered.current || !window.paypal) return;
		rendered.current = true;

		window.paypal
			.HostedButtons({ hostedButtonId: paypalHostedButtonId })
			.render(`#${containerId}`)
			.then(() => setStatus('ready'))
			.catch(() => setStatus('failed'));
	};

	return (
		<div className={className}>
			<Script
				src={sdkUrl}
				crossOrigin="anonymous"
				strategy="afterInteractive"
				onReady={render}
				onError={() => setStatus('failed')}
			/>

			{status === 'failed' ? (
				<a
					href={paypalPaymentLink}
					target="_blank"
					rel="noreferrer"
					className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] text-primary-foreground outline-none transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					Chip in on PayPal
					<ArrowUpRight className="h-4 w-4" />
				</a>
			) : (
				// PayPal draws its form into the page, styled for a light one: its
				// text inherits our colour and its fields follow `color-scheme`. Pin
				// both, so in dark theme it does not turn white-on-white.
				<div className="rounded-lg border border-border bg-white p-4 text-neutral-900 [color-scheme:light]">
					{/* Roughly the form PayPal draws — title, blurb, amount, note,
					    two buttons — so the panel does not jump when it lands. */}
					{status === 'loading' && (
						<div aria-hidden className="space-y-3 py-4">
							<Skeleton className="h-4 w-1/2 bg-black/[0.06]" />
							<Skeleton className="h-3 bg-black/[0.06]" />
							<Skeleton className="h-3 w-4/5 bg-black/[0.06]" />
							<Skeleton className="!mt-5 h-12 bg-black/[0.06]" />
							<Skeleton className="h-28 bg-black/[0.06]" />
							<Skeleton className="!mt-5 h-10 bg-black/[0.06]" />
							<Skeleton className="h-10 bg-black/[0.06]" />
						</div>
					)}
					<div id={containerId} />
				</div>
			)}

			<p className="mt-3 text-center font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
				Processed by PayPal · {paypalCurrency}
			</p>
		</div>
	);
};

export default PayPalButton;
