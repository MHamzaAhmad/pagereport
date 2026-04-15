<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
	import TopPerformerList from './TopPerformerList.svelte';
	import TopPerformersHeader from './TopPerformersHeader.svelte';
	import type { TopPerformersResult } from './schema';

	type Props = { result: TopPerformersResult };
	let { result }: Props = $props();
</script>

<div>
	<div class="mb-6">
		<TopPerformersHeader
			matchedCategories={result.matchedCategories}
			rationale={result.rationale}
		/>
	</div>
	<Collapsible title={$_('modules.topPerformers.pagesHeading')}>
		<TopPerformerList pages={result.pages} />
	</Collapsible>
</div>
