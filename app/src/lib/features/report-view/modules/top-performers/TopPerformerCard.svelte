<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { ArrowUpRight, TrendDown, TrendUp } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { TopPerformerPage } from './schema';
	import { formatGrowth, formatMonthlyRevenue } from './revenue-format';

	type Props = { page: TopPerformerPage };
	let { page }: Props = $props();

	const revenueDisplay = $derived(
		formatMonthlyRevenue(page.mrrCents ?? page.revenueLast30DaysCents)
	);
	const growthDisplay = $derived(formatGrowth(page.growth30d));
	const growthPositive = $derived(page.growth30d !== null && page.growth30d >= 0);
</script>

<a
	href={page.website}
	target="_blank"
	rel="external noopener noreferrer"
	class="bg-surface border-border hover:border-primary/40 hover:bg-surface/80 group flex h-full flex-col gap-3 rounded-[var(--radius-md)] border p-4 shadow-sm transition-colors"
>
	<div class="flex items-start gap-3">
		{#if page.icon}
			<img
				src={page.icon}
				alt=""
				class="bg-muted size-10 shrink-0 rounded-md object-cover"
				loading="lazy"
			/>
		{:else}
			<div
				class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold"
			>
				{page.name.charAt(0).toUpperCase()}
			</div>
		{/if}
		<div class="min-w-0 flex-1">
			<div class="flex items-start justify-between gap-2">
				<h5 class="text-foreground truncate text-sm font-semibold">
					{page.name}
				</h5>
				<ArrowUpRight
					size={16}
					class="text-muted-foreground group-hover:text-primary shrink-0 transition-colors"
				/>
			</div>
			<Badge tone="neutral" class="mt-1">{page.category}</Badge>
		</div>
	</div>

	<p class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
		{page.description}
	</p>

	<div class="mt-auto flex items-center justify-between gap-2 pt-1">
		<div class="min-w-0">
			<div class="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
				{$_('modules.topPerformers.page.revenue.label')}
			</div>
			<div class="text-foreground text-sm font-semibold">{revenueDisplay}</div>
		</div>
		{#if growthDisplay}
			<Badge tone={growthPositive ? 'success' : 'danger'}>
				{#if growthPositive}
					<TrendUp size={12} />
				{:else}
					<TrendDown size={12} />
				{/if}
				{growthDisplay}
			</Badge>
		{/if}
	</div>
</a>
