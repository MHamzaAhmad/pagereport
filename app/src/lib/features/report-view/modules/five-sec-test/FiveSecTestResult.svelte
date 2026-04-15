<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { Info } from 'phosphor-svelte';
	import type { FiveSecTestResult } from './schema';

	type Props = { result: FiveSecTestResult };
	let { result }: Props = $props();
</script>

<div>
	<section class="mb-6">
		<div class="mb-1 flex items-center gap-1.5">
			<h4 class="text-foreground text-sm font-semibold">
				{$_('modules.fiveSecTest.fields.summary.label')}
			</h4>
			<Tooltip content={$_('modules.fiveSecTest.fields.summary.tooltip')}>
				<Info size={14} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<p class="text-foreground text-base leading-relaxed">{result.summary}</p>
	</section>

	<Collapsible title={$_('modules.fiveSecTest.fields.whatItsAbout.label')}>
		<p class="text-foreground text-sm leading-relaxed">{result.whatItsAbout}</p>
	</Collapsible>
	<Collapsible title={$_('modules.fiveSecTest.fields.primaryAction.label')}>
		<p class="text-foreground text-sm leading-relaxed">{result.primaryAction}</p>
	</Collapsible>
	<Collapsible title={$_('modules.fiveSecTest.fields.impressions.label')}>
		<ul class="text-foreground list-inside list-disc space-y-1 text-sm leading-relaxed">
			{#each result.impressions as impression (impression)}
				<li>{impression}</li>
			{/each}
		</ul>
	</Collapsible>
</div>
