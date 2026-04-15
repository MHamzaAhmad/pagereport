<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
	import CtaAuditHeader from './CtaAuditHeader.svelte';
	import CtaAuditPrimary from './CtaAuditPrimary.svelte';
	import CtaAuditChecks from './CtaAuditChecks.svelte';
	import CtaAuditIssuesFixes from './CtaAuditIssuesFixes.svelte';
	import type { CtaAuditResult } from './schema';

	type Props = { result: CtaAuditResult };
	let { result }: Props = $props();
</script>

<div>
	<div class="mb-6">
		<CtaAuditHeader overallStatus={result.overallStatus} verdict={result.verdict} />
	</div>
	<Collapsible title={$_('modules.ctaAudit.primary.heading')}>
		<CtaAuditPrimary primaryCta={result.primaryCta} />
	</Collapsible>
	<Collapsible title={$_('modules.ctaAudit.checks.heading')}>
		<CtaAuditChecks checks={result.checks} />
	</Collapsible>
	<Collapsible title={$_('modules.ctaAudit.issuesFixes.heading')}>
		<CtaAuditIssuesFixes issues={result.issues} quickFixes={result.quickFixes} />
	</Collapsible>
</div>
