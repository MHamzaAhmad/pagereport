<script lang="ts">
	import { _ } from 'svelte-i18n';
	import LighthouseOpportunityItem from './LighthouseOpportunityItem.svelte';
	import type { LighthouseOpportunity } from './schema';

	type Props = { opportunities: LighthouseOpportunity[] };
	let { opportunities }: Props = $props();
</script>

<section class="space-y-2">
	<div>
		<h4 class="text-foreground text-sm font-semibold">
			{$_('modules.lighthouse.opportunities.heading')}
		</h4>
		<p class="text-muted-foreground text-xs">
			{$_('modules.lighthouse.opportunities.subtitle')}
		</p>
	</div>
	{#if opportunities.length === 0}
		<p class="text-muted-foreground text-sm italic">
			{$_('modules.lighthouse.opportunities.empty')}
		</p>
	{:else}
		<ul class="space-y-1.5">
			{#each opportunities as opportunity (opportunity.id)}
				<LighthouseOpportunityItem {opportunity} />
			{/each}
		</ul>
	{/if}
</section>
