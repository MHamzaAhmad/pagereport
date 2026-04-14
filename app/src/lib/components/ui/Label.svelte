<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	type Props = HTMLLabelAttributes & {
		class?: string;
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<label class={cn('text-foreground mb-1.5 block text-sm font-medium', className)} {...rest}>
	{@render children()}
</label>
