<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { CopyAnalysisExtracted } from './schema';

	type Props = { extracted: CopyAnalysisExtracted };
	let { extracted }: Props = $props();

	const rows = $derived([
		{ key: 'headline', value: extracted.headline },
		{ key: 'subheadline', value: extracted.subheadline },
		{ key: 'valueProp', value: extracted.valueProp },
		{ key: 'cta', value: extracted.primaryCtaText }
	] as const);
</script>

<section>
	<div class="mb-1">
		<h4 class="text-foreground text-sm font-semibold">
			{$_('modules.copyAnalysis.extracted.heading')}
		</h4>
		<p class="text-muted-foreground text-xs">
			{$_('modules.copyAnalysis.extracted.subtitle')}
		</p>
	</div>

	<dl class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
		{#each rows as row (row.key)}
			<div class="border-border bg-muted/30 rounded-md border px-3 py-2">
				<dt class="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
					{$_(`modules.copyAnalysis.extracted.${row.key}`)}
				</dt>
				<dd
					class={row.value
						? 'text-foreground mt-0.5 text-sm leading-snug'
						: 'text-muted-foreground mt-0.5 text-sm leading-snug italic'}
				>
					{row.value ?? $_('modules.copyAnalysis.extracted.missing')}
				</dd>
			</div>
		{/each}
	</dl>
</section>
