<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type Props = Omit<HTMLInputAttributes, 'value'> & {
		class?: string;
		value?: string;
	};

	let { class: className, value = $bindable<string>(''), ...rest }: Props = $props();
</script>

<input
	bind:value
	class={cn(
		'border-border bg-surface text-foreground placeholder:text-muted-foreground h-10 w-full rounded-[var(--radius-md)] border px-3 text-sm transition-colors focus-visible:border-[var(--color-primary)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...rest}
/>
