import { registerPrerequisite } from '../registry';
import PageIntelligenceResult from './PageIntelligenceResult.svelte';
import { PAGE_INTELLIGENCE_PREREQ_TYPE, pageIntelligenceResultSchema } from './schema';

registerPrerequisite({
	prerequisiteType: PAGE_INTELLIGENCE_PREREQ_TYPE,
	labelKey: 'prerequisites.pageIntelligence.label',
	descriptionKey: 'prerequisites.pageIntelligence.description',
	schema: pageIntelligenceResultSchema,
	component: PageIntelligenceResult
});
