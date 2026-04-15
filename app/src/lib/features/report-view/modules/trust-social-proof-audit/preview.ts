import type { TrustSocialProofAuditResult } from './schema';

export const trustSocialProofAuditPreviewSample: TrustSocialProofAuditResult = {
	overallScore: 58,
	verdict: 'Reviews and ratings are strong, but trust badges and guarantees are absent.',
	signals: {
		testimonials: {
			present: true,
			count: 4,
			hasNames: true,
			hasPhotos: false,
			examples: [
				'"I was sceptical at first but I saw results within two weeks." — Sarah L.',
				'"Finally, a tool that just works." — Marco R.'
			]
		},
		reviewsRatings: {
			present: true,
			averageRating: 4.6,
			reviewCount: 318,
			source: 'Trustpilot'
		},
		trustBadges: {
			ssl: true,
			paymentLogos: false,
			securityCertifications: false,
			detectedBadges: []
		},
		guarantees: {
			moneyBack: false,
			freeOrFastShipping: true,
			warranty: false,
			details: ['Free shipping on orders over $50']
		},
		socialProof: {
			customerLogos: false,
			pressMentions: false,
			userCounts: true,
			influencerOrExpert: false,
			notes: ['"Join 4,200+ store owners" appears in the hero.']
		},
		urgencyScarcity: {
			present: false,
			type: 'none',
			feelsAuthentic: true
		}
	},
	gaps: [
		'No money-back guarantee communicated anywhere on the page.',
		'No payment provider logos near the CTA.',
		'Testimonials are missing photos — reduces believability.'
	],
	redFlags: ['No security badges despite collecting payment details.'],
	quickWins: [
		{
			title: 'Add a money-back guarantee',
			detail: 'A 30-day guarantee next to the CTA typically lifts conversion 5–15%.'
		},
		{
			title: 'Show payment logos',
			detail: 'Visa / Mastercard / PayPal logos reassure first-time buyers.'
		}
	]
};
