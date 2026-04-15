<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
	import VibeCodedAuditHeader from './VibeCodedAuditHeader.svelte';
	import VibeCodedAuditSignals from './VibeCodedAuditSignals.svelte';
	import type { VibeCodedAuditResult } from './schema';

	type Props = { result: VibeCodedAuditResult };
	let { result }: Props = $props();
</script>

<div>
	<div class="mb-6">
		<VibeCodedAuditHeader
			verdict={result.verdict}
			confidenceScore={result.confidenceScore}
			summary={result.summary}
		/>
	</div>
	<Collapsible title={$_('modules.vibeCodedAudit.signalsHeading')}>
		<VibeCodedAuditSignals signals={result.signals} />
	</Collapsible>
</div>
