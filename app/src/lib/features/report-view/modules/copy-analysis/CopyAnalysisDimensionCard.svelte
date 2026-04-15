<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Info } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import type { BadgeVariants } from '$lib/components/ui/Badge.svelte';
	import type { CopyAnalysisDimension } from './schema';

	type Props = { dimension: CopyAnalysisDimension };
	let { dimension }: Props = $props();

	const tone: BadgeVariants['tone'] = $derived(
		dimension.severity === 'critical'
			? 'danger'
			: dimension.severity === 'warning'
				? 'warning'
				: dimension.severity === 'ok'
					? 'success'
					: 'info'
	);
</script>

<div class="border-border rounded-md border p-3">
	<div class="flex flex-wrap items-center justify-between gap-2">
		<div class="flex items-center gap-1.5">
			<span class="text-foreground text-sm font-semibold">
				{$_(`modules.copyAnalysis.dimensions.${dimension.key}.label`)}
			</span>
			<Tooltip content={$_(`modules.copyAnalysis.dimensions.${dimension.key}.tooltip`)}>
				<Info size={12} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-muted-foreground text-xs">{dimension.score} / 5</span>
			<Badge {tone}>
				{$_(`modules.copyAnalysis.dimensions.severity.${dimension.severity}`)}
			</Badge>
		</div>
	</div>

	<div class="mt-2 space-y-2">
		<div>
			<div class="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
				{$_('modules.copyAnalysis.dimensions.finding')}
			</div>
			<p class="text-foreground text-xs leading-relaxed">{dimension.finding}</p>
		</div>
		<div>
			<div class="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
				{$_('modules.copyAnalysis.dimensions.suggestion')}
			</div>
			<p class="text-foreground text-xs leading-relaxed">{dimension.suggestion}</p>
		</div>
		{#if dimension.exampleRewrite}
			<div>
				<div class="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
					{$_('modules.copyAnalysis.dimensions.exampleRewrite')}
				</div>
				<p
					class="text-foreground bg-muted/40 mt-0.5 rounded px-2 py-1 text-xs leading-relaxed italic"
				>
					"{dimension.exampleRewrite}"
				</p>
			</div>
		{/if}
	</div>
</div>
