<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { CheckCircle, XCircle, Info } from 'phosphor-svelte';
	import type { SVGAttributes } from 'svelte/elements';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';

	type IconProps = Omit<SVGAttributes<SVGSVGElement>, 'color' | 'size' | 'weight' | 'mirrored'> & {
		color?: string;
		size?: number | string;
		weight?: 'bold' | 'duotone' | 'fill' | 'light' | 'thin' | 'regular';
		mirrored?: boolean;
	};

	type Props = {
		labelKey: string;
		tooltipKey: string;
		present: boolean;
		icon: Component<IconProps>;
		children: Snippet;
	};

	let { labelKey, tooltipKey, present, icon: Icon, children }: Props = $props();
</script>

<article class="border-border flex flex-col gap-2 rounded-md border p-3">
	<header class="flex items-start justify-between gap-2">
		<div class="flex min-w-0 items-center gap-1.5">
			<Icon size={16} class="text-muted-foreground shrink-0" weight="regular" />
			<h5 class="text-foreground truncate text-xs font-semibold">
				{$_(labelKey)}
			</h5>
			<Tooltip content={$_(tooltipKey)}>
				<Info size={12} class="text-muted-foreground shrink-0" />
			</Tooltip>
		</div>
		{#if present}
			<CheckCircle size={16} class="shrink-0 text-[var(--color-success)]" weight="fill" />
		{:else}
			<XCircle size={16} class="text-muted-foreground shrink-0" weight="fill" />
		{/if}
	</header>

	<div class="text-muted-foreground text-xs leading-relaxed">
		{@render children()}
	</div>
</article>
