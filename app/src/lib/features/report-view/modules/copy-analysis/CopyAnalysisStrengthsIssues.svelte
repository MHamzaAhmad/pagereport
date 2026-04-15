<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { CheckCircle, XCircle } from 'phosphor-svelte';

	type Props = {
		strengths: readonly string[];
		criticalIssues: readonly string[];
	};
	let { strengths, criticalIssues }: Props = $props();
</script>

<section class="grid grid-cols-1 gap-3 sm:grid-cols-2">
	{#if strengths.length > 0}
		<div class="border-border rounded-md border p-3">
			<h4 class="text-foreground mb-2 text-sm font-semibold">
				{$_('modules.copyAnalysis.strengths.heading')}
			</h4>
			<ul class="space-y-1.5">
				{#each strengths as item (item)}
					<li class="flex items-start gap-2">
						<CheckCircle
							size={14}
							class="mt-0.5 shrink-0 text-[var(--color-success)]"
							weight="fill"
						/>
						<span class="text-foreground text-xs leading-relaxed">{item}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if criticalIssues.length > 0}
		<div class="border-border rounded-md border p-3">
			<h4 class="text-foreground mb-2 text-sm font-semibold">
				{$_('modules.copyAnalysis.criticalIssues.heading')}
			</h4>
			<ul class="space-y-1.5">
				{#each criticalIssues as item (item)}
					<li class="flex items-start gap-2">
						<XCircle size={14} class="mt-0.5 shrink-0 text-[var(--color-danger)]" weight="fill" />
						<span class="text-foreground text-xs leading-relaxed">{item}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>
