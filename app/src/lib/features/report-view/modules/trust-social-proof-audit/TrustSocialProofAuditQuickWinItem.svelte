<script lang="ts">
	import { Lightning } from 'phosphor-svelte';
	import type { TrustQuickWin } from './schema';

	type Props = { quickWin: TrustQuickWin; index: number };
	let { quickWin, index }: Props = $props();
</script>

<li class="border-border flex gap-3 rounded-md border p-3">
	<div
		class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--color-success)_18%,transparent)] text-[var(--color-success)]"
	>
		<Lightning size={12} weight="fill" />
	</div>
	<div class="min-w-0 flex-1">
		<div class="text-foreground text-xs font-semibold">
			{index + 1}. {quickWin.title}
		</div>
		<p class="text-muted-foreground mt-0.5 text-xs leading-relaxed">
			{quickWin.detail}
		</p>
	</div>
</li>
