import { registerModule } from '../registry';
import VibeCodedAuditResult from './VibeCodedAuditResult.svelte';
import { VIBE_CODED_AUDIT_MODULE_TYPE, vibeCodedAuditResultSchema } from './schema';

registerModule({
	moduleType: VIBE_CODED_AUDIT_MODULE_TYPE,
	labelKey: 'modules.vibeCodedAudit.label',
	descriptionKey: 'modules.vibeCodedAudit.description',
	schema: vibeCodedAuditResultSchema,
	component: VibeCodedAuditResult
});
