<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { CheckCircle, Info, Warning, XCircle } from 'phosphor-svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import type { CtaAuditCheck, CtaAuditCheckKey, CtaAuditResult, CtaAuditStatus } from './schema';
	import { CTA_AUDIT_CHECK_KEYS } from './schema';

	type Props = { checks: CtaAuditResult['checks'] };
	let { checks }: Props = $props();

	const rows = $derived(
		CTA_AUDIT_CHECK_KEYS.map((key) => ({
			key,
			check: checks[key]
		})) as readonly { key: CtaAuditCheckKey; check: CtaAuditCheck }[]
	);

	function statusColor(status: CtaAuditStatus): string {
		if (status === 'ok') return 'text-[var(--color-success)]';
		if (status === 'warning') return 'text-[var(--color-warning)]';
		return 'text-[var(--color-danger)]';
	}
</script>

<section>
	<h4 class="text-foreground mb-2 text-sm font-semibold">
		{$_('modules.ctaAudit.checks.heading')}
	</h4>
	<ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
		{#each rows as row (row.key)}
			<li class="border-border bg-muted/30 flex items-start gap-2 rounded-md border p-3">
				{#if row.check.status === 'ok'}
					<CheckCircle
						size={16}
						weight="fill"
						class={`mt-0.5 shrink-0 ${statusColor(row.check.status)}`}
					/>
				{:else if row.check.status === 'warning'}
					<Warning
						size={16}
						weight="fill"
						class={`mt-0.5 shrink-0 ${statusColor(row.check.status)}`}
					/>
				{:else}
					<XCircle
						size={16}
						weight="fill"
						class={`mt-0.5 shrink-0 ${statusColor(row.check.status)}`}
					/>
				{/if}
				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-1.5">
						<span class="text-foreground text-xs font-semibold">
							{$_(`modules.ctaAudit.checks.${row.key}.label`)}
						</span>
						<Tooltip content={$_(`modules.ctaAudit.checks.${row.key}.tooltip`)}>
							<Info size={12} class="text-muted-foreground" />
						</Tooltip>
					</div>
					<p class="text-muted-foreground mt-0.5 text-xs leading-relaxed">
						{row.check.note}
					</p>
				</div>
			</li>
		{/each}
	</ul>
</section>
