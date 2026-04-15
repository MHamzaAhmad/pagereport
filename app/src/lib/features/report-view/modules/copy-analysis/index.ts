import { registerModule } from '../registry';
import CopyAnalysisResult from './CopyAnalysisResult.svelte';
import { COPY_ANALYSIS_MODULE_TYPE, copyAnalysisResultSchema } from './schema';

registerModule({
	moduleType: COPY_ANALYSIS_MODULE_TYPE,
	labelKey: 'modules.copyAnalysis.label',
	descriptionKey: 'modules.copyAnalysis.description',
	schema: copyAnalysisResultSchema,
	component: CopyAnalysisResult
});
