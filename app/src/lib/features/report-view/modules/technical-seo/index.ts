import { registerModule } from '../registry';
import { technicalSeoPreviewSample } from './preview';
import { TECHNICAL_SEO_MODULE_TYPE, technicalSeoResultSchema } from './schema';
import TechnicalSeoResult from './TechnicalSeoResult.svelte';

registerModule({
	moduleType: TECHNICAL_SEO_MODULE_TYPE,
	tier: 'paid',
	labelKey: 'modules.technicalSeo.label',
	descriptionKey: 'modules.technicalSeo.description',
	paidHookKey: 'modules.technicalSeo.paidHook',
	priority: 60,
	schema: technicalSeoResultSchema,
	component: TechnicalSeoResult,
	previewSample: technicalSeoPreviewSample
});
