import { registerModule } from '../registry';
import TrustSocialProofAuditResult from './TrustSocialProofAuditResult.svelte';
import { TRUST_SOCIAL_PROOF_AUDIT_MODULE_TYPE, trustSocialProofAuditResultSchema } from './schema';

registerModule({
	moduleType: TRUST_SOCIAL_PROOF_AUDIT_MODULE_TYPE,
	labelKey: 'modules.trustSocialProofAudit.label',
	descriptionKey: 'modules.trustSocialProofAudit.description',
	schema: trustSocialProofAuditResultSchema,
	component: TrustSocialProofAuditResult
});
