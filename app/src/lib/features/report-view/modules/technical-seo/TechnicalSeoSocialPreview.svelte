<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { ImageBroken } from 'phosphor-svelte';
	import type { TechnicalSeoMetadata } from './schema';

	type Props = { metadata: TechnicalSeoMetadata };
	let { metadata }: Props = $props();

	const previewImage = $derived(metadata.ogImage ?? metadata.twitterImage);
	const previewTitle = $derived(metadata.ogTitle ?? metadata.twitterTitle ?? metadata.title);
	const previewDescription = $derived(
		metadata.ogDescription ?? metadata.twitterDescription ?? metadata.metaDescription
	);
	const displayDomain = $derived(safeHost(metadata.ogUrl ?? metadata.canonical));

	function safeHost(value: string | null): string | null {
		if (!value) return null;
		try {
			return new URL(value).host;
		} catch {
			return null;
		}
	}
</script>

<section>
	<h4 class="text-foreground mb-1 text-sm font-semibold">
		{$_('modules.technicalSeo.socialPreview.heading')}
	</h4>
	<p class="text-muted-foreground mb-2 text-xs">
		{$_('modules.technicalSeo.socialPreview.subtitle')}
	</p>
	<div class="border-border w-full max-w-md overflow-hidden rounded-md border">
		{#if previewImage}
			<img
				src={previewImage}
				alt=""
				class="aspect-[1.91/1] w-full object-cover"
				loading="lazy"
				referrerpolicy="no-referrer"
				onerror={(e) => {
					(e.currentTarget as HTMLImageElement).style.display = 'none';
				}}
			/>
		{:else}
			<div
				class="flex aspect-[1.91/1] w-full flex-col items-center justify-center gap-1.5 border-b border-dashed border-[var(--color-danger)] bg-[color-mix(in_oklch,var(--color-danger)_6%,transparent)] p-4 text-center"
			>
				<ImageBroken size={28} class="text-[var(--color-danger)]" />
				<span class="text-xs font-medium text-[var(--color-danger)]">
					{$_('modules.technicalSeo.socialPreview.missingImage')}
				</span>
			</div>
		{/if}
		<div class="bg-muted/30 flex flex-col gap-0.5 px-3 py-2">
			{#if displayDomain}
				<span class="text-muted-foreground text-[10px] tracking-wide uppercase">
					{displayDomain}
				</span>
			{/if}
			<span class="text-foreground truncate text-sm font-semibold">
				{previewTitle ?? $_('modules.technicalSeo.socialPreview.missingTitle')}
			</span>
			<span class="text-muted-foreground line-clamp-2 text-xs">
				{previewDescription ?? $_('modules.technicalSeo.socialPreview.missingDescription')}
			</span>
		</div>
	</div>
</section>
