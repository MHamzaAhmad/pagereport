<script lang="ts">
	import TopPerformerList from './TopPerformerList.svelte';
	import TopPerformersHeader from './TopPerformersHeader.svelte';
	import type { TopPerformersResult } from './schema';

	type Props = { result: TopPerformersResult };
	let { result }: Props = $props();
</script>

<div class="space-y-5">
	<TopPerformersHeader matchedCategories={result.matchedCategories} rationale={result.rationale} />
	<TopPerformerList pages={result.pages} />
</div>
