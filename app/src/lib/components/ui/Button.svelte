<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
		variants: {
			variant: {
				primary: 'bg-primary text-primary-foreground hover:brightness-110',
				secondary: 'bg-muted text-foreground hover:bg-border',
				ghost: 'hover:bg-muted text-foreground',
				danger: 'bg-danger text-danger-foreground hover:brightness-110'
			},
			size: {
				sm: 'h-8 rounded-[var(--radius-sm)] px-3 text-sm',
				md: 'h-10 rounded-[var(--radius-md)] px-4 text-sm',
				lg: 'h-12 rounded-[var(--radius-md)] px-6 text-base'
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
