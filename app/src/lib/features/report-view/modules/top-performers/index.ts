import { registerModule } from '../registry';
import { topPerformersPreviewSample } from './preview';
import { TOP_PERFORMERS_MODULE_TYPE, topPerformersResultSchema } from './schema';
import TopPerformersResult from './TopPerformersResult.svelte';

registerModule({
	moduleType: TOP_PERFORMERS_MODULE_TYPE,
	tier: 'paid',
	labelKey: 'modules.topPerformers.label',
	descriptionKey: 'modules.topPerformers.description',
	paidHookKey: 'modules.topPerformers.paidHook',
	priority: 80,
	schema: topPerformersResultSchema,
	component: TopPerformersResult,
	previewSample: topPerformersPreviewSample
});
