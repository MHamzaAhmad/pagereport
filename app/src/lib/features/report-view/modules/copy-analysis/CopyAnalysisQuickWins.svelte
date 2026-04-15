<script lang="ts">
	import { _ } from 'svelte-i18n';
	import CopyAnalysisQuickWinItem from './CopyAnalysisQuickWinItem.svelte';
	import type { CopyAnalysisQuickWin } from './schema';

	type Props = { quickWins: readonly CopyAnalysisQuickWin[] };
	let { quickWins }: Props = $props();
</script>

<section>
	<div class="mb-1">
		<h4 class="text-foreground text-sm font-semibold">
			{$_('modules.copyAnalysis.quickWins.heading')}
		</h4>
		<p class="text-muted-foreground text-xs">
			{$_('modules.copyAnalysis.quickWins.subtitle')}
		</p>
	</div>

	{#if quickWins.length === 0}
		<p class="text-muted-foreground mt-3 text-xs italic">
			{$_('modules.copyAnalysis.quickWins.empty')}
		</p>
	{:else}
		<ul class="mt-3 space-y-2">
			{#each quickWins as quickWin, index (index)}
				<CopyAnalysisQuickWinItem {quickWin} />
			{/each}
		</ul>
	{/if}
</section>
