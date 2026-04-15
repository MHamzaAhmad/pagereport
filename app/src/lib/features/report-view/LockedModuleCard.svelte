<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { LockKey, Info } from 'phosphor-svelte';
	import type { AnyModuleRenderer } from './modules';

	type Props = { renderer: AnyModuleRenderer };
	let { renderer }: Props = $props();

	const RendererComponent = $derived(renderer.component);
</script>

<section class="border-border relative border-t py-10 first:border-t-0 first:pt-0">
	<header class="mb-6 flex items-start justify-between gap-4">
		<div class="min-w-0">
			<h2 class="text-foreground font-serif text-3xl leading-tight sm:text-4xl">
				{$_(renderer.labelKey)}
			</h2>
			{#if renderer.paidHookKey}
				<p class="text-foreground/80 mt-2 max-w-xl text-sm leading-relaxed font-medium">
					{$_(renderer.paidHookKey)}
				</p>
			{:else}
				<p class="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
					{$_(renderer.descriptionKey)}
				</p>
			{/if}
			<div class="mt-3 flex items-center gap-2">
				<Tooltip content={$_('modules.tiers.paid.cacheHintTooltip')}>
					<span class="text-muted-foreground inline-flex items-center gap-1 text-xs">
						<Info size={12} weight="fill" />
						{$_('modules.tiers.paid.cacheHint')}
					</span>
				</Tooltip>
			</div>
		</div>
		<div class="shrink-0 pt-2">
			<Badge tone="info">
				<LockKey size={12} weight="fill" />
				{$_('modules.tiers.paid.readyToUnlock')}
			</Badge>
		</div>
	</header>

	<div class="relative">
		{#if renderer.previewSample !== undefined}
			<div
				class="pointer-events-none max-h-[360px] overflow-hidden blur-md select-none"
				aria-hidden="true"
			>
				<RendererComponent result={renderer.previewSample} />
			</div>
		{:else}
			<div
				class="bg-muted pointer-events-none h-48 w-full rounded-[var(--radius-md)] blur-md"
				aria-hidden="true"
			></div>
		{/if}
		<div
			class="from-bg via-bg/80 pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent"
		></div>
	</div>
</section>
