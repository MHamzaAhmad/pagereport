<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Lightning } from 'phosphor-svelte';
	import { formatMilliseconds } from './formatLighthouseMetric';
	import type { LighthouseOpportunity } from './schema';

	type Props = { opportunity: LighthouseOpportunity };
	let { opportunity }: Props = $props();

	const savingsLabel = $derived.by(() => {
		if (opportunity.estimatedSavingsMs === null || opportunity.estimatedSavingsMs <= 0) return null;
		const formatted = formatMilliseconds(opportunity.estimatedSavingsMs, '');
		return $_('modules.lighthouse.opportunities.savingsLabel', {
			values: { value: formatted }
		});
	});
</script>

<li class="border-border flex gap-2 rounded-md border px-3 py-2">
	<Lightning size={16} class="mt-0.5 shrink-0 text-amber-500" weight="fill" />
	<div class="min-w-0 flex-1">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<p class="text-foreground text-sm font-medium">{opportunity.title}</p>
			{#if savingsLabel}
				<span
					class="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
				>
					{savingsLabel}
				</span>
			{/if}
		</div>
		{#if opportunity.description}
			<p class="text-muted-foreground mt-0.5 text-xs leading-relaxed">
				{opportunity.description}
			</p>
		{/if}
	</div>
</li>
