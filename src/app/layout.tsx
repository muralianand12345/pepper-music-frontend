import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import RouteProgress from '@/components/layout/routeProgress';
import ThemeProvider from '@/components/layout/themeProvider';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Pepper | Stream Music Effortlessly on Discord',
	description:
		'Discover Pepper, your ultimate music companion on Discord. Play, manage, and enjoy music seamlessly with our powerful music bot. Add Pepper to your server today!',
	openGraph: {
		images: 'https://pepper.muralianand.in/images/brand/pepper-mascot-white.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<GoogleAnalytics gaId="G-NCWY5GH7E9" />
			{/* Without JS the reveal class never resolves; show those sections. */}
			<noscript>
				<style>
					{'.reveal{opacity:1 !important;transform:none !important}'}
				</style>
			</noscript>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem={false}
					disableTransitionOnChange
				>
					<RouteProgress />
					<Navbar />
					{children}
					<Footer />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
