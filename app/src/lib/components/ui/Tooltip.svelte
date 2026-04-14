<script lang="ts">
	import { Tooltip as BitsTooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	type Props = {
		content: string;
		class?: string;
		children: Snippet;
	};

	let { content, class: className, children }: Props = $props();
</script>

<BitsTooltip.Provider delayDuration={200}>
	<BitsTooltip.Root>
		<BitsTooltip.Trigger class="inline-flex cursor-help">
			{@render children()}
		</BitsTooltip.Trigger>
		<BitsTooltip.Portal>
			<BitsTooltip.Content
				sideOffset={6}
				class={cn(
					'border-border bg-foreground text-primary-foreground z-50 max-w-xs rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs shadow-md',
					className
				)}
			>
				{content}
			</BitsTooltip.Content>
		</BitsTooltip.Portal>
	</BitsTooltip.Root>
</BitsTooltip.Provider>
