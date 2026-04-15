<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { CheckCircle, Info, Warning, XCircle } from 'phosphor-svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import type { TechnicalSeoCheck, TechnicalSeoStatus } from './schema';

	type Props = {
		checkKey: string;
		check: TechnicalSeoCheck;
	};
	let { checkKey, check }: Props = $props();

	function statusColor(status: TechnicalSeoStatus): string {
		if (status === 'ok') return 'text-[var(--color-success)]';
		if (status === 'warning') return 'text-[var(--color-warning)]';
		return 'text-[var(--color-danger)]';
	}
</script>

<li class="border-border bg-muted/30 flex items-start gap-2 rounded-md border p-3">
	{#if check.status === 'ok'}
		<CheckCircle size={16} weight="fill" class={`mt-0.5 shrink-0 ${statusColor(check.status)}`} />
	{:else if check.status === 'warning'}
		<Warning size={16} weight="fill" class={`mt-0.5 shrink-0 ${statusColor(check.status)}`} />
	{:else}
		<XCircle size={16} weight="fill" class={`mt-0.5 shrink-0 ${statusColor(check.status)}`} />
	{/if}
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-1.5">
			<span class="text-foreground text-xs font-semibold">
				{$_(`modules.technicalSeo.checks.${checkKey}.label`)}
			</span>
			<Tooltip content={$_(`modules.technicalSeo.checks.${checkKey}.tooltip`)}>
				<Info size={12} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<p class="text-muted-foreground mt-0.5 text-xs leading-relaxed break-words">
			{check.note}
		</p>
	</div>
</li>
