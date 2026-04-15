import type { CopyAnalysisResult } from './schema';

export const copyAnalysisPreviewSample: CopyAnalysisResult = {
	overallScore: 62,
	verdict: 'Clear pain framing, but the headline buries the benefit and the CTA is generic.',
	framing: 'problem_solution',
	extracted: {
		headline: 'The smartest way to run your store',
		subheadline: 'Built for dropshippers who want more sales, less hassle.',
		valueProp: 'AI-powered optimization that turns visitors into buyers.',
		primaryCtaText: 'Get started'
	},
	storyBrand: {
		userIsHero: {
			score: 1,
			evidence: 'Copy references "you" but centres the product in most sections.'
		},
		painNamed: { score: 2, evidence: 'Pain is clearly articulated in the opening paragraph.' },
		stakesClear: { score: 1, evidence: 'Stakes are implied but never concretely quantified.' },
		guideRole: { score: 1, evidence: 'Brand positions itself as the solution, not the guide.' },
		planClear: { score: 1, evidence: 'Three-step plan exists but steps are vague.' }
	},
	dimensions: [
		{
			key: 'headline_clarity',
			score: 3,
			severity: 'warning',
			finding: 'Headline leads with a cleverism instead of the concrete outcome.',
			suggestion: 'Lead with the measurable benefit in under 10 words.',
			exampleRewrite: 'Turn more store visitors into paying customers — automatically.'
		},
		{
			key: 'value_prop',
			score: 4,
			severity: 'ok',
			finding: 'Value prop is articulated but buried below the fold.',
			suggestion: 'Promote it to the hero subheadline.',
			exampleRewrite: null
		},
		{
			key: 'problem_framing',
			score: 4,
			severity: 'ok',
			finding: 'Problem is named early and resonates with the target reader.',
			suggestion: 'Add one concrete example of the pain.',
			exampleRewrite: null
		},
		{
			key: 'cta_strength',
			score: 2,
			severity: 'critical',
			finding: 'Primary CTA is "Get started" — generic and low-commitment.',
			suggestion: 'Use an outcome-driven verb phrase.',
			exampleRewrite: 'Find my conversion leaks'
		},
		{
			key: 'proof',
			score: 2,
			severity: 'warning',
			finding: 'No social proof or logos above the fold.',
			suggestion: 'Add one testimonial or customer count near the CTA.',
			exampleRewrite: null
		},
		{
			key: 'reader_centricity',
			score: 3,
			severity: 'warning',
			finding: 'Copy shifts between "we" and "you" inconsistently.',
			suggestion: 'Rewrite in second-person throughout.',
			exampleRewrite: null
		},
		{
			key: 'specificity',
			score: 2,
			severity: 'warning',
			finding: 'Claims are vague — "more sales, less hassle".',
			suggestion: 'Quantify outcomes with real numbers where possible.',
			exampleRewrite: null
		},
		{
			key: 'objection_handling',
			score: 2,
			severity: 'warning',
			finding: 'Pricing and onboarding concerns are not addressed.',
			suggestion: 'Add a FAQ or "what you get" block.',
			exampleRewrite: null
		}
	],
	strengths: [
		'Pain is clearly named and resonates with the target reader.',
		'Tone matches the audience and feels confident.',
		'Section rhythm keeps the reader moving down the page.'
	],
	criticalIssues: [
		'Primary CTA is generic and low-commitment.',
		'No proof elements above the fold.',
		'Headline buries the concrete benefit.'
	],
	quickWins: [
		{
			currentText: 'Get started',
			rewrite: 'Find my conversion leaks',
			rationale: 'Outcome-driven CTAs convert 2–4× better than generic ones.',
			location: 'Hero primary button'
		},
		{
			currentText: 'Built for dropshippers who want more sales, less hassle.',
			rewrite: 'Join 4,200 dropshippers who lifted their conversion rate by an average of 38%.',
			rationale: 'Specific numbers and a peer-count anchor the claim.',
			location: 'Hero subheadline'
		}
	]
};
