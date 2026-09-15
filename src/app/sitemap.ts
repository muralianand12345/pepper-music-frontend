import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/bot-features`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/stats`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/about-us`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.7,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/creator`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.6,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/feedback`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.5,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/terms-of-service`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.5,
		},
		{
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/images`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.5,
		},
	];
}
