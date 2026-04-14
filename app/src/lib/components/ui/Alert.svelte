<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const alertVariants = tv({
		base: 'flex items-start gap-3 rounded-[var(--radius-md)] border p-4 text-sm',
		variants: {
			tone: {
				info: 'border-border bg-muted text-foreground',
				danger:
					'border-[color-mix(in_oklch,var(--color-danger)_35%,transparent)] bg-[color-mix(in_oklch,var(--color-danger)_8%,transparent)] text-[var(--color-danger)]'
			}
		},
		defaultVariants: {
			tone: 'info'
		}
	});

	export type AlertVariants = VariantProps<typeof alertVariants>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	type Props = {
		tone?: AlertVariants['tone'];
		class?: string;
		children: Snippet;
	};

	let { tone = 'info', class: className, children }: Props = $props();
</script>

<div role="alert" class={cn(alertVariants({ tone }), className)}>
	{@render children()}
</div>
