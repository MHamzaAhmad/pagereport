<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { BadgeVariants } from '$lib/components/ui/Badge.svelte';
	import type { TechnicalSeoStatus } from './schema';

	type Props = {
		overallStatus: TechnicalSeoStatus;
		overallScore: number;
		verdict: string;
	};
	let { overallStatus, overallScore, verdict }: Props = $props();

	const tone: BadgeVariants['tone'] = $derived(
		overallStatus === 'ok' ? 'success' : overallStatus === 'warning' ? 'warning' : 'danger'
	);
</script>

<section class="flex flex-col gap-2">
	<div class="flex flex-wrap items-center gap-2">
		<h4 class="text-foreground text-sm font-semibold">
			{$_('modules.technicalSeo.overall.heading')}
		</h4>
		<Badge {tone}>
			{$_(`modules.technicalSeo.overall.status.${overallStatus}`)}
		</Badge>
		<Badge tone="info">
			{$_('modules.technicalSeo.overall.score')}: {overallScore}/100
		</Badge>
	</div>
	<p class="text-foreground text-sm leading-relaxed">{verdict}</p>
</section>
