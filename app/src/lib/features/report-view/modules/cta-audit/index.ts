import { registerModule } from '../registry';
import CtaAuditResult from './CtaAuditResult.svelte';
import { CTA_AUDIT_MODULE_TYPE, ctaAuditResultSchema } from './schema';

registerModule({
	moduleType: CTA_AUDIT_MODULE_TYPE,
	labelKey: 'modules.ctaAudit.label',
	descriptionKey: 'modules.ctaAudit.description',
	schema: ctaAuditResultSchema,
	component: CtaAuditResult
});
