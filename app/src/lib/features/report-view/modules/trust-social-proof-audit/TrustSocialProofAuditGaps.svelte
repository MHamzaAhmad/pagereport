<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Warning, MinusCircle } from 'phosphor-svelte';

	type Props = {
		gaps: readonly string[];
		redFlags: readonly string[];
	};
	let { gaps, redFlags }: Props = $props();
</script>

{#if gaps.length > 0 || redFlags.length > 0}
	<section class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#if gaps.length > 0}
			<div class="border-border rounded-md border p-3">
				<h4 class="text-foreground mb-2 text-sm font-semibold">
					{$_('modules.trustSocialProofAudit.gaps.heading')}
				</h4>
				<ul class="space-y-1.5">
					{#each gaps as item (item)}
						<li class="flex items-start gap-2">
							<MinusCircle size={14} class="text-muted-foreground mt-0.5 shrink-0" weight="fill" />
							<span class="text-foreground text-xs leading-relaxed">{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if redFlags.length > 0}
			<div
				class="rounded-md border border-[color-mix(in_oklch,var(--color-danger)_30%,var(--border))] bg-[color-mix(in_oklch,var(--color-danger)_5%,transparent)] p-3"
			>
				<h4 class="text-foreground mb-2 text-sm font-semibold">
					{$_('modules.trustSocialProofAudit.redFlags.heading')}
				</h4>
				<ul class="space-y-1.5">
					{#each redFlags as item (item)}
						<li class="flex items-start gap-2">
							<Warning size={14} class="mt-0.5 shrink-0 text-[var(--color-danger)]" weight="fill" />
							<span class="text-foreground text-xs leading-relaxed">{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</section>
{/if}
