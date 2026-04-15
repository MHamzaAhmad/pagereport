<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Info } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import type { BadgeVariants } from '$lib/components/ui/Badge.svelte';

	type Props = {
		overallScore: number;
		verdict: string;
	};
	let { overallScore, verdict }: Props = $props();

	const scoreTone: BadgeVariants['tone'] = $derived(
		overallScore >= 75 ? 'success' : overallScore >= 50 ? 'warning' : 'danger'
	);
	const strengthKey = $derived(
		overallScore >= 75 ? 'strong' : overallScore >= 50 ? 'needsWork' : 'weak'
	);
</script>

<section class="flex flex-col gap-3">
	<div class="min-w-0">
		<div class="mb-1 flex items-center gap-1.5">
			<h4 class="text-foreground text-sm font-semibold">
				{$_('modules.trustSocialProofAudit.overall.scoreLabel')}
			</h4>
			<Tooltip content={$_('modules.trustSocialProofAudit.overall.scoreTooltip')}>
				<Info size={14} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<div class="flex items-baseline gap-2">
			<span class="text-foreground text-3xl leading-none font-bold">{overallScore}</span>
			<span class="text-muted-foreground text-xs">/ 100</span>
			<Badge tone={scoreTone} class="ml-1">
				{$_(`modules.trustSocialProofAudit.overall.strengthLabel.${strengthKey}`)}
			</Badge>
		</div>
		<p class="text-foreground mt-2 text-sm leading-relaxed">{verdict}</p>
	</div>
</section>
