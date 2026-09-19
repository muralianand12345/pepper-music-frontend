'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import { showToast } from '@/utils/toast';

/** PayPal's transaction ID, copied in one click so it can be pasted into a support ticket. */
const TransactionReference = ({
	id,
	className,
}: {
	id: string;
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
			await navigator.clipboard.writeText(id);
			setCopied(true);
			showToast('Transaction ID copied', 'Include it if you ever open a ticket about this payment.');
		} catch {
			// No clipboard outside a secure context, or permission was refused.
			showToast('Could not copy the ID', 'It is also on the receipt PayPal emailed you.', {
				type: 'error',
			});
		}
	};

	return (
		<div className={cn('flex flex-wrap items-center gap-3', className)}>
			<span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
				PayPal transaction
			</span>
			<button
				type="button"
				onClick={copy}
				title="Copy transaction ID"
				aria-label={`Copy PayPal transaction ID ${id}`}
				className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-[12px] tracking-[0.08em] text-foreground/80 outline-none transition-colors hover:border-foreground/25 hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
			>
				{copied ? (
					<Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
				) : (
					<Copy className="h-3.5 w-3.5 text-muted-foreground" />
				)}
				{id}
			</button>
		</div>
	);
};

export default TransactionReference;
