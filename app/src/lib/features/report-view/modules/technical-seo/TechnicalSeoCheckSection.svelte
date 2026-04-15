<script lang="ts">
	import TechnicalSeoCheckRow from './TechnicalSeoCheckRow.svelte';
	import type { TechnicalSeoCheck } from './schema';

	type Props = {
		rows: readonly { key: string; check: TechnicalSeoCheck }[];
	};
	let { rows }: Props = $props();
</script>

<ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
	{#each rows as row (row.key)}
		<TechnicalSeoCheckRow checkKey={row.key} check={row.check} />
	{/each}
</ul>
