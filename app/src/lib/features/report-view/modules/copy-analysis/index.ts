import { registerModule } from '../registry';
import CopyAnalysisResult from './CopyAnalysisResult.svelte';
import { copyAnalysisPreviewSample } from './preview';
import { COPY_ANALYSIS_MODULE_TYPE, copyAnalysisResultSchema } from './schema';

registerModule({
	moduleType: COPY_ANALYSIS_MODULE_TYPE,
	tier: 'paid',
	labelKey: 'modules.copyAnalysis.label',
	descriptionKey: 'modules.copyAnalysis.description',
	paidHookKey: 'modules.copyAnalysis.paidHook',
	priority: 40,
	schema: copyAnalysisResultSchema,
	component: CopyAnalysisResult,
	previewSample: copyAnalysisPreviewSample
});
