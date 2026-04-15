<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Info } from 'phosphor-svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { cn } from '$lib/utils/cn';
	import { rateScore, type ScoreRating } from './formatLighthouseMetric';

	type Props = {
		score: number;
		labelKey: string;
		tooltipKey: string;
	};

	let { score, labelKey, tooltipKey }: Props = $props();

	const rating = $derived<ScoreRating>(rateScore(score));

	const ringClass = $derived(
		rating === 'good'
			? 'text-emerald-500'
			: rating === 'needs-improvement'
				? 'text-amber-500'
				: 'text-rose-500'
	);
	const textClass = $derived(
		rating === 'good'
			? 'text-emerald-600'
			: rating === 'needs-improvement'
				? 'text-amber-600'
				: 'text-rose-600'
	);

	const radius = 28;
	const circumference = 2 * Math.PI * radius;
	const offset = $derived(circumference * (1 - Math.max(0, Math.min(100, score)) / 100));
</script>

<div class="flex flex-col items-center gap-2">
	<div class="relative h-20 w-20">
		<svg viewBox="0 0 64 64" class="h-full w-full -rotate-90">
			<circle
				cx="32"
				cy="32"
				r={radius}
				fill="none"
				stroke="currentColor"
				stroke-width="5"
				class="text-muted/40"
			/>
			<circle
				cx="32"
				cy="32"
				r={radius}
				fill="none"
				stroke="currentColor"
				stroke-width="5"
				stroke-linecap="round"
				stroke-dasharray={circumference}
				stroke-dashoffset={offset}
				class={cn('transition-all duration-500', ringClass)}
			/>
		</svg>
		<div
			class={cn(
				'absolute inset-0 flex items-center justify-center text-lg font-semibold',
				textClass
			)}
		>
			{Math.round(score)}
		</div>
	</div>
	<div class="flex items-center gap-1">
		<span class="text-foreground text-xs font-medium">{$_(labelKey)}</span>
		<Tooltip content={$_(tooltipKey)}>
			<Info size={12} class="text-muted-foreground" />
		</Tooltip>
	</div>
</div>
