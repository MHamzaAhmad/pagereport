<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { CheckCircle, Sparkle, Warning } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import type { BadgeVariants } from '$lib/components/ui/Badge.svelte';
	import { Info } from 'phosphor-svelte';
	import type { VibeCodedVerdict } from './schema';

	type Props = {
		verdict: VibeCodedVerdict;
		confidenceScore: number;
		summary: string;
	};
	let { verdict, confidenceScore, summary }: Props = $props();

	const tone: BadgeVariants['tone'] = $derived(
		verdict === 'looks_custom'
			? 'success'
			: verdict === 'possibly_vibe_coded'
				? 'warning'
				: 'danger'
	);
</script>

<section class="flex flex-col gap-3">
	<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-center gap-2">
			{#if verdict === 'looks_custom'}
				<CheckCircle size={18} weight="fill" class="shrink-0 text-[var(--color-success)]" />
			{:else if verdict === 'possibly_vibe_coded'}
				<Warning size={18} weight="fill" class="shrink-0 text-[var(--color-warning)]" />
			{:else}
				<Sparkle size={18} weight="fill" class="shrink-0 text-[var(--color-danger)]" />
			{/if}
			<h4 class="text-foreground text-sm font-semibold">
				{$_('modules.vibeCodedAudit.summary.label')}
			</h4>
			<Tooltip content={$_('modules.vibeCodedAudit.summary.tooltip')}>
				<Info size={12} class="text-muted-foreground" />
			</Tooltip>
			<Badge {tone}>
				{$_(`modules.vibeCodedAudit.verdict.${verdict}`)}
			</Badge>
		</div>
		<div class="text-muted-foreground flex items-center gap-1.5 text-xs">
			<span>{$_('modules.vibeCodedAudit.confidence.label')}</span>
			<Tooltip content={$_('modules.vibeCodedAudit.confidence.tooltip')}>
				<Info size={12} class="text-muted-foreground" />
			</Tooltip>
			<span class="text-foreground font-semibold">{confidenceScore}%</span>
		</div>
	</div>
	<p class="text-foreground text-sm leading-relaxed">{summary}</p>
</section>
