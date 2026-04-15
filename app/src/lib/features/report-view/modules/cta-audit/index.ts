import { registerModule } from '../registry';
import CtaAuditResult from './CtaAuditResult.svelte';
import { ctaAuditPreviewSample } from './preview';
import { CTA_AUDIT_MODULE_TYPE, ctaAuditResultSchema } from './schema';

registerModule({
	moduleType: CTA_AUDIT_MODULE_TYPE,
	tier: 'paid',
	labelKey: 'modules.ctaAudit.label',
	descriptionKey: 'modules.ctaAudit.description',
	paidHookKey: 'modules.ctaAudit.paidHook',
	priority: 30,
	schema: ctaAuditResultSchema,
	component: CtaAuditResult,
	previewSample: ctaAuditPreviewSample
});
