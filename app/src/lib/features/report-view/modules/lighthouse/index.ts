import { registerModule } from '../registry';
import LighthouseResult from './LighthouseResult.svelte';
import { LIGHTHOUSE_MODULE_TYPE, lighthouseResultSchema } from './schema';

registerModule({
	moduleType: LIGHTHOUSE_MODULE_TYPE,
	labelKey: 'modules.lighthouse.label',
	descriptionKey: 'modules.lighthouse.description',
	schema: lighthouseResultSchema,
	component: LighthouseResult
});
