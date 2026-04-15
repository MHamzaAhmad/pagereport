<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { ReportWithModulesResponse } from '$lib/types';
	import { Clock } from 'phosphor-svelte';

	type Props = { report: ReportWithModulesResponse };
	let { report }: Props = $props();

	const formattedDate = $derived(
		new Date(report.createdAt).toLocaleString(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		})
	);
</script>

<section class="space-y-3">
	<p class="text-subtle text-[10px] font-medium tracking-[0.18em] uppercase">
		{$_('report.overview.reportFor')}
	</p>
	<h1 class="text-foreground font-serif text-4xl leading-[1.1] break-all sm:text-5xl">
		{report.url}
	</h1>
	<p class="text-muted-foreground flex items-center gap-1.5 text-xs">
		<Clock size={12} />
		<span class="tabular-nums">{formattedDate}</span>
	</p>
</section>
