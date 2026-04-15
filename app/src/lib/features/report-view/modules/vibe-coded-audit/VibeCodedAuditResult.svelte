<script lang="ts">
	import VibeCodedAuditHeader from './VibeCodedAuditHeader.svelte';
	import VibeCodedAuditSignals from './VibeCodedAuditSignals.svelte';
	import type { VibeCodedAuditResult } from './schema';

	type Props = { result: VibeCodedAuditResult };
	let { result }: Props = $props();
</script>

<div class="space-y-5">
	<VibeCodedAuditHeader
		verdict={result.verdict}
		confidenceScore={result.confidenceScore}
		summary={result.summary}
	/>
	<VibeCodedAuditSignals signals={result.signals} />
</div>
