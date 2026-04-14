<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { ReportWithModulesResponse } from '$lib/types';
	import { Link as LinkIcon, Clock } from 'phosphor-svelte';

	type Props = { report: ReportWithModulesResponse };
	let { report }: Props = $props();

	const formattedDate = $derived(new Date(report.createdAt).toLocaleString());
</script>

<header class="space-y-2">
	<p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
		{$_('report.header.title')}
	</p>
	<h1 class="text-foreground flex items-center gap-2 text-xl font-semibold break-all sm:text-2xl">
		<LinkIcon size={20} weight="bold" class="text-muted-foreground shrink-0" />
		<span class="min-w-0">{report.url}</span>
	</h1>
	<p class="text-muted-foreground flex items-center gap-1.5 text-xs">
		<Clock size={12} />
		{$_('report.header.createdAt')}: {formattedDate}
	</p>
</header>
