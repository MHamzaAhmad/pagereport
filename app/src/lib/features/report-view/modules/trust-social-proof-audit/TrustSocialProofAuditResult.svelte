<script lang="ts">
	import TrustSocialProofAuditHeader from './TrustSocialProofAuditHeader.svelte';
	import TrustSocialProofAuditSignals from './TrustSocialProofAuditSignals.svelte';
	import TrustSocialProofAuditGaps from './TrustSocialProofAuditGaps.svelte';
	import TrustSocialProofAuditQuickWins from './TrustSocialProofAuditQuickWins.svelte';
	import type { TrustSocialProofAuditResult } from './schema';

	type Props = { result: TrustSocialProofAuditResult };
	let { result }: Props = $props();
</script>

<div class="space-y-6">
	<TrustSocialProofAuditHeader overallScore={result.overallScore} verdict={result.verdict} />
	<TrustSocialProofAuditSignals
		testimonials={result.signals.testimonials}
		reviewsRatings={result.signals.reviewsRatings}
		trustBadges={result.signals.trustBadges}
		guarantees={result.signals.guarantees}
		socialProof={result.signals.socialProof}
		urgencyScarcity={result.signals.urgencyScarcity}
	/>
	<TrustSocialProofAuditGaps gaps={result.gaps} redFlags={result.redFlags} />
	<TrustSocialProofAuditQuickWins quickWins={result.quickWins} />
</div>
