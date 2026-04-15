<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from '$lib/components/ui/Button.svelte';
	import { purchasesApi } from '$lib/api';
	import { ApiError } from '$lib/api/errors';
	import { CircleNotch, LockKeyOpen } from 'phosphor-svelte';

	type Props = { reportId: string; lockedCount: number };
	let { reportId, lockedCount }: Props = $props();

	let loading = $state(false);
	let errorMessage = $state<string | null>(null);

	async function unlock() {
		if (loading) return;
		loading = true;
		errorMessage = null;
		try {
			const { url } = await purchasesApi.createCheckout(reportId);
			window.location.href = url;
		} catch (err) {
			loading = false;
			if (err instanceof ApiError) {
				errorMessage = err.message;
			} else {
				errorMessage = $_('modules.tiers.paid.checkoutError');
			}
		}
	}
</script>

<div
	class="border-border bg-muted/40 flex flex-col gap-3 rounded-[var(--radius-lg)] border p-5 sm:flex-row sm:items-center sm:justify-between"
>
	<div class="min-w-0">
		<h3 class="text-foreground font-serif text-xl leading-tight sm:text-2xl">
			{$_('modules.tiers.paid.bundleTitle', { values: { count: lockedCount } })}
		</h3>
		<p class="text-muted-foreground mt-1 text-sm">
			{$_('modules.tiers.paid.bundleSubtitle')}
		</p>
		{#if errorMessage}
			<p class="text-danger mt-2 text-xs">{errorMessage}</p>
		{/if}
	</div>
	<div class="shrink-0">
		<Button size="lg" onclick={unlock} disabled={loading}>
			{#if loading}
				<CircleNotch size={16} weight="bold" class="animate-spin" />
				{$_('modules.tiers.paid.unlockCtaLoading')}
			{:else}
				<LockKeyOpen size={16} weight="fill" />
				{$_('modules.tiers.paid.unlockCta')}
			{/if}
		</Button>
	</div>
</div>
