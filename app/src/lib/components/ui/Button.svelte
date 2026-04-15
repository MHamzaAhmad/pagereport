<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex items-center justify-center gap-2 font-medium tracking-tight whitespace-nowrap transition-[background,color,border-color,opacity] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50',
		variants: {
			variant: {
				primary: 'bg-foreground text-bg hover:bg-foreground/90',
				secondary: 'border-border bg-transparent text-foreground hover:bg-muted border',
				ghost: 'text-muted-foreground hover:text-foreground bg-transparent',
				danger: 'bg-danger text-danger-foreground hover:brightness-110'
			},
			size: {
				sm: 'h-8 rounded-[var(--radius-sm)] px-3 text-xs',
				md: 'h-10 rounded-[var(--radius-md)] px-4 text-sm',
				lg: 'h-12 rounded-[var(--radius-md)] px-6 text-sm'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md'
		}
	});

	export type ButtonVariants = VariantProps<typeof buttonVariants>;
</script>

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	type Props = HTMLButtonAttributes & {
		variant?: ButtonVariants['variant'];
		size?: ButtonVariants['size'];
		class?: string;
		children: Snippet;
	};

	let {
		variant = 'primary',
		size = 'md',
		class: className,
		children,
		type = 'button',
		...rest
	}: Props = $props();
</script>

<button {type} class={cn(buttonVariants({ variant, size }), className)} {...rest}>
	{@render children()}
</button>
