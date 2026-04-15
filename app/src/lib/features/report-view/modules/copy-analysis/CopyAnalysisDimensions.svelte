<script lang="ts">
	import { _ } from 'svelte-i18n';
	import CopyAnalysisDimensionCard from './CopyAnalysisDimensionCard.svelte';
	import type { CopyAnalysisDimension } from './schema';

	type Props = { dimensions: readonly CopyAnalysisDimension[] };
	let { dimensions }: Props = $props();
</script>

<section>
	<div class="mb-1">
		<h4 class="text-foreground text-sm font-semibold">
			{$_('modules.copyAnalysis.dimensions.heading')}
		</h4>
		<p class="text-muted-foreground text-xs">
			{$_('modules.copyAnalysis.dimensions.subtitle')}
		</p>
	</div>

	<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
		{#each dimensions as dimension (dimension.key)}
			<CopyAnalysisDimensionCard {dimension} />
		{/each}
	</div>
</section>
