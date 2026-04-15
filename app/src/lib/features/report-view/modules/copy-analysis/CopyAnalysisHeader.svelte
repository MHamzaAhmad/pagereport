<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Info } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import type { BadgeVariants } from '$lib/components/ui/Badge.svelte';
	import type { CopyFraming } from './schema';

	type Props = {
		overallScore: number;
		verdict: string;
		framing: CopyFraming;
	};
	let { overallScore, verdict, framing }: Props = $props();

	const scoreTone: BadgeVariants['tone'] = $derived(
		overallScore >= 75 ? 'success' : overallScore >= 50 ? 'warning' : 'danger'
	);
	const strengthKey = $derived(
		overallScore >= 75 ? 'strong' : overallScore >= 50 ? 'needsWork' : 'weak'
	);
	const framingTone: BadgeVariants['tone'] = $derived(
		framing === 'problem_solution'
			? 'success'
			: framing === 'mixed'
				? 'warning'
				: framing === 'product_first'
					? 'danger'
					: 'neutral'
	);
</script>

<section class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
	<div class="min-w-0 flex-1">
		<div class="mb-1 flex items-center gap-1.5">
			<h4 class="text-foreground text-sm font-semibold">
				{$_('modules.copyAnalysis.overall.scoreLabel')}
			</h4>
			<Tooltip content={$_('modules.copyAnalysis.overall.scoreTooltip')}>
				<Info size={14} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<div class="flex items-baseline gap-2">
			<span class="text-foreground text-3xl leading-none font-bold">{overallScore}</span>
			<span class="text-muted-foreground text-xs">/ 100</span>
			<Badge tone={scoreTone} class="ml-1">
				{$_(`modules.copyAnalysis.overall.strengthLabel.${strengthKey}`)}
			</Badge>
		</div>
		<p class="text-foreground mt-2 text-sm leading-relaxed">{verdict}</p>
	</div>

	<div class="flex flex-col items-start gap-1 sm:items-end">
		<div class="flex items-center gap-1.5">
			<span class="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
				{$_('modules.copyAnalysis.framing.label')}
			</span>
			<Tooltip content={$_('modules.copyAnalysis.framing.tooltip')}>
				<Info size={12} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<Badge tone={framingTone}>
			{$_(`modules.copyAnalysis.framing.${framing}`)}
		</Badge>
	</div>
</section>
