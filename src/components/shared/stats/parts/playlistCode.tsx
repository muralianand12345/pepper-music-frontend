'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import { showToast } from '@/utils/toast';

/** A public playlist's share code, copied in one click so it can go straight into `/play`. */
const PlaylistCode = ({
	code,
	name,
	className,
}: {
	code: string;
	name: string;
	className?: string;
}) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timer);
	}, [copied]);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			showToast('Share code copied', `Paste it into /play to queue “${name}”.`);
		} catch {
			// No clipboard outside a secure context, or permission was refused.
			showToast('Could not copy the code', `Type ${code} into /play instead.`, {
				type: 'error',
			});
		}
	};

	return (
		<button
			type="button"
			onClick={copy}
			title="Copy share code"
			aria-label={`Copy share code ${code} for ${name}`}
			className={cn(
				'inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-[12px] tracking-[0.08em] text-foreground/80 outline-none transition-colors hover:border-foreground/25 hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
				className
			)}
		>
			{copied ? (
				<Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
			) : (
				<Copy className="h-3.5 w-3.5 text-muted-foreground" />
			)}
			{code}
		</button>
	);
};

export default PlaylistCode;
