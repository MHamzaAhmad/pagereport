<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	type Props = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	class={cn('bg-surface border-border rounded-[var(--radius-lg)] border p-5 shadow-sm', className)}
	{...rest}
>
	{@render children()}
</div>
