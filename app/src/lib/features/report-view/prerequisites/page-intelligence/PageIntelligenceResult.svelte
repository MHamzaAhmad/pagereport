<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { Info, Tag, Package, Target } from 'phosphor-svelte';
	import type { PageIntelligenceResult } from './schema';

	type Props = { result: PageIntelligenceResult };
	let { result }: Props = $props();
</script>

<div class="space-y-5">
	<section>
		<div class="mb-1 flex items-center gap-1.5">
			<Target size={14} weight="bold" class="text-muted-foreground" />
			<h4 class="text-foreground text-sm font-semibold">
				{$_('prerequisites.pageIntelligence.fields.niche.label')}
			</h4>
			<Tooltip content={$_('prerequisites.pageIntelligence.fields.niche.tooltip')}>
				<Info size={14} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<p class="text-foreground text-sm leading-relaxed font-medium">{result.niche}</p>
	</section>

	<section>
		<div class="mb-1 flex items-center gap-1.5">
			<h4 class="text-foreground text-sm font-semibold">
				{$_('prerequisites.pageIntelligence.fields.summary.label')}
			</h4>
			<Tooltip content={$_('prerequisites.pageIntelligence.fields.summary.tooltip')}>
				<Info size={14} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<p class="text-foreground text-sm leading-relaxed">{result.summary}</p>
	</section>

	<section>
		<div class="mb-2 flex items-center gap-1.5">
			<Tag size={14} weight="bold" class="text-muted-foreground" />
			<h4 class="text-foreground text-sm font-semibold">
				{$_('prerequisites.pageIntelligence.fields.keywords.label')}
			</h4>
			<Tooltip content={$_('prerequisites.pageIntelligence.fields.keywords.tooltip')}>
				<Info size={14} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<ul class="flex flex-wrap gap-1.5">
			{#each result.keywords as keyword (keyword)}
				<li
					class="bg-muted text-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
				>
					{keyword}
				</li>
			{/each}
		</ul>
	</section>

	{#if result.products.length > 0}
		<section>
			<div class="mb-2 flex items-center gap-1.5">
				<Package size={14} weight="bold" class="text-muted-foreground" />
				<h4 class="text-foreground text-sm font-semibold">
					{$_('prerequisites.pageIntelligence.fields.products.label')}
				</h4>
				<Tooltip content={$_('prerequisites.pageIntelligence.fields.products.tooltip')}>
					<Info size={14} class="text-muted-foreground" />
				</Tooltip>
			</div>
			<ul class="space-y-2">
				{#each result.products as product (product.name)}
					<li class="border-border rounded-md border p-2.5">
						<p class="text-foreground text-sm font-medium">{product.name}</p>
						{#if product.description}
							<p class="text-muted-foreground mt-0.5 text-xs leading-relaxed">
								{product.description}
							</p>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
