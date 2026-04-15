import type { CtaAuditResult } from './schema';

export const ctaAuditPreviewSample: CtaAuditResult = {
	overallStatus: 'warning',
	verdict: 'Primary CTA is present but below the fold and visually weak.',
	primaryCta: {
		detected: true,
		text: 'Get started',
		href: 'https://example.com/signup',
		visibleAboveFold: false,
		hrefStatus: 'valid'
	},
	secondaryCtaCount: 3,
	checks: {
		hasPrimaryCta: { status: 'ok', note: 'Primary CTA detected on the page.' },
		aboveTheFold: {
			status: 'warning',
			note: 'Primary CTA sits below the hero image on mobile.'
		},
		hrefWorks: { status: 'ok', note: 'CTA links to a valid sign-up page.' },
		visuallyProminent: {
			status: 'warning',
			note: 'Button contrast is low against the background.'
		}
	},
	issues: [
		'Primary CTA is not visible above the fold on mobile.',
		'Button contrast fails the 4.5:1 accessibility ratio.',
		'Three secondary CTAs compete for attention in the hero.'
	],
	quickFixes: [
		'Move the primary button above the fold on mobile.',
		'Increase button contrast to meet WCAG AA.',
		'Demote two of the three secondary CTAs to text links.'
	]
};
