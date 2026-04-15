<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Eye, EyeSlash, LinkBreak, LinkSimple } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { BadgeVariants } from '$lib/components/ui/Badge.svelte';
	import type { CtaAuditPrimaryCta } from './schema';

	type Props = { primaryCta: CtaAuditPrimaryCta };
	let { primaryCta }: Props = $props();

	const hrefTone: BadgeVariants['tone'] = $derived(
		primaryCta.hrefStatus === 'valid'
			? 'success'
			: primaryCta.hrefStatus === 'mailto_tel'
				? 'warning'
				: 'danger'
	);
</script>

<section class="border-border rounded-md border p-3">
	<h4 class="text-muted-foreground mb-2 text-[11px] font-semibold tracking-wide uppercase">
		{$_('modules.ctaAudit.primary.heading')}
	</h4>
	{#if primaryCta.detected}
		<div class="flex flex-col gap-2">
			<div>
				<p class="text-muted-foreground text-[11px]">
					{$_('modules.ctaAudit.primary.textLabel')}
				</p>
				<p class="text-foreground text-sm font-medium break-words">
					{primaryCta.text ?? $_('modules.ctaAudit.primary.textMissing')}
				</p>
			</div>
			<div>
				<p class="text-muted-foreground text-[11px]">
					{$_('modules.ctaAudit.primary.hrefLabel')}
				</p>
				<p class="text-foreground font-mono text-xs break-all">
					{primaryCta.href ?? $_('modules.ctaAudit.primary.hrefMissing')}
				</p>
			</div>
			<div class="flex flex-wrap items-center gap-2 pt-1">
				<Badge tone={primaryCta.visibleAboveFold ? 'success' : 'danger'}>
					{#if primaryCta.visibleAboveFold}
						<Eye size={12} weight="fill" />
						{$_('modules.ctaAudit.primary.visible')}
					{:else}
						<EyeSlash size={12} weight="fill" />
						{$_('modules.ctaAudit.primary.notVisible')}
					{/if}
				</Badge>
				<Badge tone={hrefTone}>
					{#if primaryCta.hrefStatus === 'valid'}
						<LinkSimple size={12} weight="fill" />
					{:else}
						<LinkBreak size={12} weight="fill" />
					{/if}
					{$_(`modules.ctaAudit.primary.hrefStatus.${primaryCta.hrefStatus}`)}
				</Badge>
			</div>
		</div>
	{:else}
		<p class="text-muted-foreground text-sm italic">
			{$_('modules.ctaAudit.primary.notDetected')}
		</p>
	{/if}
</section>
