import { registerModule } from '../registry';
import TopPerformersResult from './TopPerformersResult.svelte';
import { TOP_PERFORMERS_MODULE_TYPE, topPerformersResultSchema } from './schema';

registerModule({
	moduleType: TOP_PERFORMERS_MODULE_TYPE,
	labelKey: 'modules.topPerformers.label',
	descriptionKey: 'modules.topPerformers.description',
	priority: 80,
	schema: topPerformersResultSchema,
	component: TopPerformersResult
});
