<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Info, TrendUp } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';

	type Props = {
		matchedCategories: readonly string[];
		rationale: string;
	};
	let { matchedCategories, rationale }: Props = $props();
</script>

<header class="space-y-3">
	<div class="flex items-start gap-2">
		<TrendUp size={20} class="text-primary mt-0.5 shrink-0" />
		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-1.5">
				<h4 class="text-foreground text-sm font-semibold">
					{$_('modules.topPerformers.header.title')}
				</h4>
				<Tooltip content={$_('modules.topPerformers.header.tooltip')}>
					<Info size={14} class="text-muted-foreground" />
				</Tooltip>
			</div>
			<p class="text-muted-foreground mt-0.5 text-xs leading-relaxed">
				{$_('modules.topPerformers.header.subtitle')}
			</p>
		</div>
	</div>

	<div class="space-y-2">
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-muted-foreground text-xs font-medium">
				{$_('modules.topPerformers.matchedCategories.label')}
			</span>
			{#each matchedCategories as category (category)}
				<Badge tone="info">{category}</Badge>
			{/each}
		</div>
		<p class="text-foreground text-xs leading-relaxed">
			<span class="text-muted-foreground font-medium">
				{$_('modules.topPerformers.rationale.label')}:
			</span>
			{rationale}
		</p>
	</div>
</header>
