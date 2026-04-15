import type { TechnicalSeoResult } from './schema';

const ok = (note: string) => ({ status: 'ok' as const, note });
const warn = (note: string) => ({ status: 'warning' as const, note });
const crit = (note: string) => ({ status: 'critical' as const, note });

export const technicalSeoPreviewSample: TechnicalSeoResult = {
	overallStatus: 'warning',
	overallScore: 68,
	verdict: 'Core tags are present but Open Graph and structured data are incomplete.',
	metadata: {
		title: 'Smart Store — The easiest way to run your shop',
		titleLength: 46,
		metaDescription: 'Built for dropshippers who want more sales with less hassle.',
		metaDescriptionLength: 62,
		canonical: 'https://example.com/',
		viewport: 'width=device-width, initial-scale=1',
		robots: 'index, follow',
		lang: 'en',
		favicon: '/favicon.ico',
		charset: 'utf-8',
		ogTitle: 'Smart Store',
		ogDescription: null,
		ogImage: null,
		ogUrl: 'https://example.com/',
		ogType: 'website',
		twitterCard: 'summary_large_image',
		twitterTitle: null,
		twitterDescription: null,
		twitterImage: null,
		jsonLdBlockCount: 0,
		jsonLdTypes: []
	},
	checks: {
		core: {
			title: ok('Title is present and under 60 characters.'),
			metaDescription: ok('Description is present and compelling.'),
			canonical: ok('Canonical URL is set correctly.'),
			viewport: ok('Viewport is configured for mobile.'),
			robots: ok('Robots directive allows indexing.'),
			lang: ok('Language attribute is set.'),
			favicon: ok('Favicon is declared.'),
			charset: ok('Charset is declared.')
		},
		openGraph: {
			ogTitle: ok('og:title present.'),
			ogDescription: crit('og:description missing — social shares will look empty.'),
			ogImage: crit('og:image missing — previews will be text-only.'),
			ogUrl: ok('og:url present.'),
			ogType: ok('og:type present.')
		},
		twitter: {
			twitterCard: ok('twitter:card declared.'),
			twitterTitle: warn('twitter:title missing — falls back to og:title.'),
			twitterDescription: warn('twitter:description missing.'),
			twitterImage: warn('twitter:image missing.')
		},
		structuredData: {
			jsonLd: warn('No JSON-LD blocks detected.')
		}
	},
	issues: [
		'Missing og:image and og:description — social shares will render as text only.',
		'No JSON-LD structured data — Google cannot build rich results for this page.',
		'Twitter card tags are incomplete.'
	],
	quickWins: [
		'Add og:image and og:description.',
		'Add Product or Organization JSON-LD.',
		'Mirror Twitter tags to match Open Graph.'
	]
};
