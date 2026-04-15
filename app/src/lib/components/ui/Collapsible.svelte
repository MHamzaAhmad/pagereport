<script lang="ts">
	import { Collapsible as BitsCollapsible } from 'bits-ui';
	import { untrack, type Snippet } from 'svelte';
	import { CaretDown } from 'phosphor-svelte';
	import { cn } from '$lib/utils/cn';

	type Props = {
		title: string;
		description?: string;
		defaultOpen?: boolean;
		class?: string;
		children: Snippet;
	};

	let { title, description, defaultOpen = false, class: className, children }: Props = $props();

	let open = $state(untrack(() => defaultOpen));
</script>

<BitsCollapsible.Root bind:open class={cn('border-border border-t', className)}>
	<BitsCollapsible.Trigger
		class="hover:text-foreground text-muted-foreground group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors"
	>
		<span class="min-w-0 flex-1">
			<span class="text-foreground block text-sm font-medium">{title}</span>
			{#if description}
				<span class="text-muted-foreground mt-0.5 block text-xs">{description}</span>
			{/if}
		</span>
		<CaretDown
			size={16}
			weight="bold"
			class={cn('text-subtle shrink-0 transition-transform duration-200', open && 'rotate-180')}
		/>
	</BitsCollapsible.Trigger>
	<BitsCollapsible.Content class="overflow-hidden">
		<div class="pb-6">
			{@render children()}
		</div>
	</BitsCollapsible.Content>
</BitsCollapsible.Root>
