<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { TechnicalSeoMetadata } from './schema';

	type Props = { metadata: TechnicalSeoMetadata };
	let { metadata }: Props = $props();
</script>

<section>
	<h4 class="text-foreground mb-2 text-sm font-semibold">
		{$_('modules.technicalSeo.structuredData.heading')}
	</h4>
	{#if metadata.jsonLdBlockCount === 0}
		<p class="text-muted-foreground text-xs">
			{$_('modules.technicalSeo.structuredData.empty')}
		</p>
	{:else}
		<div class="border-border flex flex-col gap-1 rounded-md border p-3">
			<p class="text-foreground text-xs font-semibold">
				{metadata.jsonLdBlockCount === 1
					? $_('modules.technicalSeo.structuredData.blockCountOne')
					: $_('modules.technicalSeo.structuredData.blockCountOther', {
							values: { count: metadata.jsonLdBlockCount }
						})}
			</p>
			{#if metadata.jsonLdTypes.length > 0}
				<p class="text-muted-foreground text-xs">
					{$_('modules.technicalSeo.structuredData.typesLabel')}:
					{metadata.jsonLdTypes.join(', ')}
				</p>
			{/if}
		</div>
	{/if}
</section>
