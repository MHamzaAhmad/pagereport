import type { TopPerformersResult } from './schema';

export const topPerformersPreviewSample: TopPerformersResult = {
	matchedCategories: ['dropshipping', 'ecommerce'],
	rationale:
		'Ranked against revenue-verified dropshipping brands selling in the same niche in the last 30 days.',
	pages: [
		{
			name: 'NovaGoods',
			website: 'https://novagoods.example',
			icon: null,
			description: 'Minimalist home accessories, DTC brand.',
			category: 'home',
			revenueLast30DaysCents: 4_820_000,
			mrrCents: 1_640_000,
			customers: 9_200,
			growth30d: 0.24
		},
		{
			name: 'PeakFit',
			website: 'https://peakfit.example',
			icon: null,
			description: 'Fitness gear and apparel.',
			category: 'fitness',
			revenueLast30DaysCents: 3_210_000,
			mrrCents: null,
			customers: 6_800,
			growth30d: 0.18
		},
		{
			name: 'Clayworks',
			website: 'https://clayworks.example',
			icon: null,
			description: 'Handmade ceramics, drop-ship fulfilled.',
			category: 'home',
			revenueLast30DaysCents: 1_950_000,
			mrrCents: null,
			customers: 4_100,
			growth30d: 0.12
		}
	]
};
