<script lang="ts">
	import CtaAuditHeader from './CtaAuditHeader.svelte';
	import CtaAuditPrimary from './CtaAuditPrimary.svelte';
	import CtaAuditChecks from './CtaAuditChecks.svelte';
	import CtaAuditIssuesFixes from './CtaAuditIssuesFixes.svelte';
	import type { CtaAuditResult } from './schema';

	type Props = { result: CtaAuditResult };
	let { result }: Props = $props();
</script>

<div class="space-y-5">
	<CtaAuditHeader overallStatus={result.overallStatus} verdict={result.verdict} />
	<CtaAuditPrimary primaryCta={result.primaryCta} />
	<CtaAuditChecks checks={result.checks} />
	<CtaAuditIssuesFixes issues={result.issues} quickFixes={result.quickFixes} />
</div>
