<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const badgeVariants = tv({
		base: 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
		variants: {
			tone: {
				neutral: 'bg-muted text-muted-foreground',
				info: 'bg-primary/10 text-primary',
				success:
					'bg-[color-mix(in_oklch,var(--color-success)_18%,transparent)] text-[var(--color-success)]',
				warning:
					'bg-[color-mix(in_oklch,var(--color-warning)_20%,transparent)] text-[oklch(0.45_0.12_85)]',
				danger:
					'bg-[color-mix(in_oklch,var(--color-danger)_15%,transparent)] text-[var(--color-danger)]'
			}
		},
		defaultVariants: {
			tone: 'neutral'
		}
	});

	export type BadgeVariants = VariantProps<typeof badgeVariants>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	type Props = {
		tone?: BadgeVariants['tone'];
		class?: string;
		children: Snippet;
	};

	let { tone = 'neutral', class: className, children }: Props = $props();
</script>

<span class={cn(badgeVariants({ tone }), className)}>
	{@render children()}
</span>
