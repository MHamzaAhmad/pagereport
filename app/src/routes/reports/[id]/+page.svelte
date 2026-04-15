<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { page } from '$app/state';
	import ReportPage from '$lib/features/report-view/ReportPage.svelte';
</script>

<svelte:head>
	<title>{$_('seo.reportTitle')}</title>
	<meta name="description" content={$_('seo.reportDescription')} />
	<meta name="robots" content="noindex, nofollow" />
	<meta property="og:title" content={$_('seo.reportTitle')} />
	<meta property="og:description" content={$_('seo.reportDescription')} />
	<meta name="twitter:title" content={$_('seo.reportTitle')} />
	<meta name="twitter:description" content={$_('seo.reportDescription')} />
</svelte:head>

<ReportPage reportId={page.params.id} />
