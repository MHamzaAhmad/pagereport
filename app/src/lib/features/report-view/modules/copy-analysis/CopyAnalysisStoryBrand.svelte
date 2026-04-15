<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { CheckCircle, WarningCircle, XCircle, Info } from 'phosphor-svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { STORY_BRAND_KEYS, type CopyAnalysisStoryBrand, type StoryBrandKey } from './schema';

	type Props = { storyBrand: CopyAnalysisStoryBrand };
	let { storyBrand }: Props = $props();

	const rows = $derived(
		STORY_BRAND_KEYS.map((key: StoryBrandKey) => ({ key, check: storyBrand[key] }))
	);
</script>

<section>
	<div class="mb-1">
		<h4 class="text-foreground text-sm font-semibold">
			{$_('modules.copyAnalysis.storyBrand.heading')}
		</h4>
		<p class="text-muted-foreground text-xs">
			{$_('modules.copyAnalysis.storyBrand.subtitle')}
		</p>
	</div>

	<ul class="mt-3 space-y-2">
		{#each rows as row (row.key)}
			<li class="border-border flex items-start gap-3 rounded-md border px-3 py-2">
				{#if row.check.score === 2}
					<CheckCircle
						size={18}
						class="mt-0.5 shrink-0 text-[var(--color-success)]"
						weight="fill"
					/>
				{:else if row.check.score === 1}
					<WarningCircle
						size={18}
						class="mt-0.5 shrink-0 text-[var(--color-warning)]"
						weight="fill"
					/>
				{:else}
					<XCircle size={18} class="mt-0.5 shrink-0 text-[var(--color-danger)]" weight="fill" />
				{/if}

				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-1.5">
						<span class="text-foreground text-sm font-medium">
							{$_(`modules.copyAnalysis.storyBrand.${row.key}.label`)}
						</span>
						<Tooltip content={$_(`modules.copyAnalysis.storyBrand.${row.key}.tooltip`)}>
							<Info size={12} class="text-muted-foreground" />
						</Tooltip>
						<span class="text-muted-foreground text-[11px]">
							· {$_(`modules.copyAnalysis.storyBrand.score.${row.check.score}`)}
						</span>
					</div>
					{#if row.check.evidence}
						<p class="text-muted-foreground mt-0.5 text-xs leading-relaxed">
							{row.check.evidence}
						</p>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</section>
