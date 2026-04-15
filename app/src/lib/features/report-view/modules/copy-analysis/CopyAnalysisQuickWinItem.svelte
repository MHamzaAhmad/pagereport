<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { ArrowRight } from 'phosphor-svelte';
	import type { CopyAnalysisQuickWin } from './schema';

	type Props = { quickWin: CopyAnalysisQuickWin };
	let { quickWin }: Props = $props();
</script>

<li class="border-border rounded-md border p-3">
	{#if quickWin.location}
		<div class="text-muted-foreground mb-1.5 text-[11px] font-semibold tracking-wide uppercase">
			{$_('modules.copyAnalysis.quickWins.location')}: {quickWin.location}
		</div>
	{/if}

	<div class="space-y-2">
		<div>
			<div class="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
				{$_('modules.copyAnalysis.quickWins.before')}
			</div>
			<p
				class="text-muted-foreground mt-0.5 rounded bg-[color-mix(in_oklch,var(--color-danger)_8%,transparent)] px-2 py-1 text-xs leading-relaxed line-through"
			>
				{quickWin.currentText}
			</p>
		</div>

		<div class="flex items-center gap-1 text-[color:var(--color-success)]">
			<ArrowRight size={14} weight="bold" />
			<span class="text-[11px] font-semibold tracking-wide uppercase">
				{$_('modules.copyAnalysis.quickWins.after')}
			</span>
		</div>

		<p
			class="text-foreground rounded bg-[color-mix(in_oklch,var(--color-success)_10%,transparent)] px-2 py-1 text-xs leading-relaxed font-medium"
		>
			{quickWin.rewrite}
		</p>

		<p class="text-muted-foreground text-[11px] leading-relaxed">
			<span class="font-semibold tracking-wide uppercase"
				>{$_('modules.copyAnalysis.quickWins.rationale')}:</span
			>
			{quickWin.rationale}
		</p>
	</div>
</li>
