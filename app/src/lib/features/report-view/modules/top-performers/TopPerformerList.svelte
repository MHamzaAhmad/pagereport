<script lang="ts">
	import { _ } from 'svelte-i18n';
	import TopPerformerCard from './TopPerformerCard.svelte';
	import type { TopPerformerPage } from './schema';

	type Props = { pages: readonly TopPerformerPage[] };
	let { pages }: Props = $props();
</script>

{#if pages.length === 0}
	<p class="text-muted-foreground text-sm leading-relaxed">
		{$_('modules.topPerformers.pages.empty')}
	</p>
{:else}
	<ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#each pages as page (page.website)}
			<li class="h-full">
				<TopPerformerCard {page} />
			</li>
		{/each}
	</ul>
{/if}
