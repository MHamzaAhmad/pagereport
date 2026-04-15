<script lang="ts">
	import { page } from '$app/state';
	import ReportPage from '$lib/features/report-view/ReportPage.svelte';
</script>

<ReportPage reportId={page.params.id} />
