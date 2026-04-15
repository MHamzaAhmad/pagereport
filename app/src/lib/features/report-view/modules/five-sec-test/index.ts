import { registerModule } from '../registry';
import FiveSecTestResult from './FiveSecTestResult.svelte';
import { FIVE_SEC_TEST_MODULE_TYPE, fiveSecTestResultSchema } from './schema';

registerModule({
	moduleType: FIVE_SEC_TEST_MODULE_TYPE,
	tier: 'free',
	labelKey: 'modules.fiveSecTest.label',
	descriptionKey: 'modules.fiveSecTest.description',
	priority: 20,
	schema: fiveSecTestResultSchema,
	component: FiveSecTestResult
});
