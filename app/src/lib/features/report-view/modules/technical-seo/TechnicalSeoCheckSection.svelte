<script lang="ts">
	import TechnicalSeoCheckRow from './TechnicalSeoCheckRow.svelte';
	import type { TechnicalSeoCheck } from './schema';

	type Props = {
		heading: string;
		rows: readonly { key: string; check: TechnicalSeoCheck }[];
	};
	let { heading, rows }: Props = $props();
</script>

<section>
	<h4 class="text-foreground mb-2 text-sm font-semibold">{heading}</h4>
	<ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
		{#each rows as row (row.key)}
			<TechnicalSeoCheckRow checkKey={row.key} check={row.check} />
		{/each}
	</ul>
</section>
