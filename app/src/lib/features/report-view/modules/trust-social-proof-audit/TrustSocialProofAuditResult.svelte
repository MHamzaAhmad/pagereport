<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
	import TrustSocialProofAuditHeader from './TrustSocialProofAuditHeader.svelte';
	import TrustSocialProofAuditSignals from './TrustSocialProofAuditSignals.svelte';
	import TrustSocialProofAuditGaps from './TrustSocialProofAuditGaps.svelte';
	import TrustSocialProofAuditQuickWins from './TrustSocialProofAuditQuickWins.svelte';
	import type { TrustSocialProofAuditResult } from './schema';

	type Props = { result: TrustSocialProofAuditResult };
	let { result }: Props = $props();
</script>

<div>
	<div class="mb-6">
		<TrustSocialProofAuditHeader overallScore={result.overallScore} verdict={result.verdict} />
	</div>
	<Collapsible title={$_('modules.trustSocialProofAudit.signals.heading')}>
		<TrustSocialProofAuditSignals
			testimonials={result.signals.testimonials}
			reviewsRatings={result.signals.reviewsRatings}
			trustBadges={result.signals.trustBadges}
			guarantees={result.signals.guarantees}
			socialProof={result.signals.socialProof}
			urgencyScarcity={result.signals.urgencyScarcity}
		/>
	</Collapsible>
	<Collapsible title={$_('modules.trustSocialProofAudit.gapsRedFlags.heading')}>
		<TrustSocialProofAuditGaps gaps={result.gaps} redFlags={result.redFlags} />
	</Collapsible>
	<Collapsible title={$_('modules.trustSocialProofAudit.quickWins.heading')}>
		<TrustSocialProofAuditQuickWins quickWins={result.quickWins} />
	</Collapsible>
</div>
