import { registerModule } from '../registry';
import TechnicalSeoResult from './TechnicalSeoResult.svelte';
import { TECHNICAL_SEO_MODULE_TYPE, technicalSeoResultSchema } from './schema';

registerModule({
	moduleType: TECHNICAL_SEO_MODULE_TYPE,
	labelKey: 'modules.technicalSeo.label',
	descriptionKey: 'modules.technicalSeo.description',
	priority: 60,
	schema: technicalSeoResultSchema,
	component: TechnicalSeoResult
});
