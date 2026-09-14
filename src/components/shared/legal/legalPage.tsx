'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { discordServerLink } from '@/constants';
import { Cell, CellGrid } from '@/components/shared/page/parts';

export interface LegalSection {
	id: string;
	title: string;
	icon: ReactNode;
	content: ReactNode;
}

export interface LegalHighlight {
	icon: ReactNode;
	title: string;
	body: string;
}

interface Props {
	eyebrow: string;
	title: string;
	summary: string;
	updated: string;
	effective: string;
	highlights: LegalHighlight[];
	sections: LegalSection[];
	related: { label: string; href: string; description: string };
	agreement: string;
}

const LegalPage = ({
	eyebrow,
	title,
	summary,
	updated,
	effective,
	highlights,
	sections,
	related,
	agreement,
}: Props) => {
	const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
	const [progress, setProgress] = useState(0);
	const [showTopButton, setShowTopButton] = useState(false);
	const articleRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		let frame = 0;

		const update = () => {
			frame = 0;
			const article = articleRef.current;
			if (!article) return;

			const start = article.offsetTop;
			const distance = article.offsetHeight - window.innerHeight * 0.6;
			const scrolled = window.scrollY - start;

			setProgress(
				distance <= 0
					? 100
					: Math.min(100, Math.max(0, (scrolled / distance) * 100))
			);
			setShowTopButton(window.scrollY > 600);

			// The section whose heading last passed the reading line is the active one.
			const line = 140;
			let current = sections[0]?.id ?? '';
			for (const section of sections) {
				const element = document.getElementById(section.id);
				if (element && element.getBoundingClientRect().top <= line)
					current = section.id;
			}
			setActiveId(current);
		};

		const onScroll = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		return () => {
			if (frame) window.cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, [sections]);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	return (
		<section className="relative bg-background text-foreground">
			{/* Reading progress */}
			<div className="sticky top-[var(--header-height)] z-40 h-0.5 w-full bg-surface-hover">
				<div
					className="h-full bg-primary transition-[width] duration-150 ease-out"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Hero */}
			<div className="relative overflow-hidden border-b border-border">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-[min(48rem,90%)] rounded-full bg-glow blur-3xl"
				/>
				<div className="container relative mx-auto px-4 py-14 md:py-20">
					<div className="mx-auto max-w-5xl">
						<span className="inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70">
							{eyebrow}
						</span>
						<h1 className="mt-5 text-balance text-4xl font-bold tracking-[-0.03em] md:text-5xl">
							{title}
						</h1>
						<p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
							{summary}
						</p>

						<dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
							<div>
								<dt className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
									Last updated
								</dt>
								<dd className="mt-1 text-sm text-foreground">{updated}</dd>
							</div>
							<div>
								<dt className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
									Effective
								</dt>
								<dd className="mt-1 text-sm text-foreground">{effective}</dd>
							</div>
							<div>
								<dt className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
									Applies to
								</dt>
								<dd className="mt-1 text-sm text-foreground">
									Pepper bot &amp; pepper.muralianand.in
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>

			{/* Highlights */}
			<div className="border-b border-border">
				<div className="container mx-auto px-4 py-10">
					<CellGrid className="mx-auto max-w-5xl sm:grid-cols-2 lg:grid-cols-4">
						{highlights.map((highlight) => (
							<Cell key={highlight.title} interactive className="p-5">
								<div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
									{highlight.icon}
								</div>
								<h2 className="mt-4 text-sm font-semibold tracking-[-0.01em] text-foreground">
									{highlight.title}
								</h2>
								<p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
									{highlight.body}
								</p>
							</Cell>
						))}
					</CellGrid>
				</div>
			</div>

			{/* Body */}
			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
					{/* Table of contents */}
					<aside className="lg:sticky lg:top-10 lg:self-start">
						<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
							On this page
						</p>
						<nav className="mt-4 border-l border-border">
							{sections.map((section, index) => (
								<a
									key={section.id}
									href={`#${section.id}`}
									className={cn(
										'-ml-px flex items-baseline gap-2.5 border-l py-1.5 pl-4 text-sm transition-colors',
										activeId === section.id
											? 'border-foreground font-medium text-foreground'
											: 'border-transparent text-muted-foreground/85 hover:border-foreground/30 hover:text-foreground/80'
									)}
								>
									<span className="text-[11px] tabular-nums text-foreground/55">
										{String(index + 1).padStart(2, '0')}
									</span>
									<span>{section.title}</span>
								</a>
							))}
						</nav>
					</aside>

					{/* Sections */}
					<div ref={articleRef} className="min-w-0 space-y-12">
						{sections.map((section, index) => (
							<article
								key={section.id}
								id={section.id}
								className="scroll-mt-24 border-b border-border pb-12 last:border-0 last:pb-0"
							>
								<div className="mb-5 flex items-center gap-3">
									<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
										{section.icon}
									</span>
									<div>
										<span className="block font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
											Section {String(index + 1).padStart(2, '0')}
										</span>
										<h2 className="text-xl font-bold tracking-[-0.02em] text-foreground">
											{section.title}
										</h2>
									</div>
								</div>
								{section.content}
							</article>
						))}

						{/* Footer actions */}
						<div className="grid gap-4 sm:grid-cols-2">
							<Link
								href={related.href}
								className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-foreground/25 hover:bg-surface-hover"
							>
								<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
									Read next
								</p>
								<p className="mt-2 flex items-center gap-2 text-base font-semibold text-foreground">
									{related.label}
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</p>
								<p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
									{related.description}
								</p>
							</Link>

							<Link
								href={discordServerLink}
								target="_blank"
								rel="noreferrer"
								className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-foreground/25 hover:bg-surface-hover"
							>
								<p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
									Questions?
								</p>
								<p className="mt-2 flex items-center gap-2 text-base font-semibold text-foreground">
									Ask on Discord
									<MessageSquare className="h-4 w-4" />
								</p>
								<p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
									Our support server is the fastest way to reach the team about
									anything on this page.
								</p>
							</Link>
						</div>

						<div className="rounded-lg bg-primary p-6 text-center">
							<p className="text-sm leading-relaxed text-primary-foreground">
								{agreement}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Back to top */}
			<button
				type="button"
				onClick={scrollToTop}
				aria-label="Back to top"
				className={cn(
					'fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-all hover:bg-primary hover:text-primary-foreground',
					showTopButton
						? 'translate-y-0 opacity-100'
						: 'pointer-events-none translate-y-3 opacity-0'
				)}
			>
				<ArrowUp className="h-4 w-4" />
			</button>
		</section>
	);
};

export default LegalPage;
