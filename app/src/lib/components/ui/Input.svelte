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
		'border-border bg-surface text-foreground placeholder:text-subtle hover:border-muted-foreground/40 focus:border-foreground h-11 w-full rounded-[var(--radius-md)] border px-3.5 text-sm transition-colors outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...rest}
/>
