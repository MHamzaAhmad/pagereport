import { registerModule } from '../registry';
import { trustSocialProofAuditPreviewSample } from './preview';
import { TRUST_SOCIAL_PROOF_AUDIT_MODULE_TYPE, trustSocialProofAuditResultSchema } from './schema';
import TrustSocialProofAuditResult from './TrustSocialProofAuditResult.svelte';

registerModule({
	moduleType: TRUST_SOCIAL_PROOF_AUDIT_MODULE_TYPE,
	tier: 'paid',
	labelKey: 'modules.trustSocialProofAudit.label',
	descriptionKey: 'modules.trustSocialProofAudit.description',
	paidHookKey: 'modules.trustSocialProofAudit.paidHook',
	priority: 50,
	schema: trustSocialProofAuditResultSchema,
	component: TrustSocialProofAuditResult,
	previewSample: trustSocialProofAuditPreviewSample
});
