<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Info } from 'phosphor-svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { cn } from '$lib/utils/cn';
	import type { CwvRating } from './formatLighthouseMetric';

	type Props = {
		labelKey: string;
		tooltipKey: string;
		value: string;
		rating: CwvRating;
	};

	let { labelKey, tooltipKey, value, rating }: Props = $props();

	const ratingClass = $derived(
		rating === 'good'
			? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700'
			: rating === 'needs-improvement'
				? 'border-amber-500/30 bg-amber-500/5 text-amber-700'
				: rating === 'poor'
					? 'border-rose-500/30 bg-rose-500/5 text-rose-700'
					: 'border-border bg-muted/30 text-muted-foreground'
	);
</script>

<div class={cn('flex flex-col gap-1 rounded-md border px-3 py-2', ratingClass)}>
	<div class="flex items-center gap-1">
		<span class="text-[11px] font-semibold tracking-wide uppercase">{$_(labelKey)}</span>
		<Tooltip content={$_(tooltipKey)}>
			<Info size={11} class="opacity-70" />
		</Tooltip>
	</div>
	<span class="text-base font-semibold tabular-nums">{value}</span>
</div>
