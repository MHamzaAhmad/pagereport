<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Lightning, XCircle } from 'phosphor-svelte';

	type Props = {
		issues: readonly string[];
		quickFixes: readonly string[];
	};
	let { issues, quickFixes }: Props = $props();
</script>

{#if issues.length > 0 || quickFixes.length > 0}
	<section class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#if issues.length > 0}
			<div class="border-border rounded-md border p-3">
				<h4 class="text-foreground mb-2 text-sm font-semibold">
					{$_('modules.ctaAudit.issues.heading')}
				</h4>
				<ul class="space-y-1.5">
					{#each issues as item (item)}
						<li class="flex items-start gap-2">
							<XCircle size={14} weight="fill" class="mt-0.5 shrink-0 text-[var(--color-danger)]" />
							<span class="text-foreground text-xs leading-relaxed">{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		{#if quickFixes.length > 0}
			<div class="border-border rounded-md border p-3">
				<h4 class="text-foreground mb-2 text-sm font-semibold">
					{$_('modules.ctaAudit.quickFixes.heading')}
				</h4>
				<ul class="space-y-1.5">
					{#each quickFixes as item (item)}
						<li class="flex items-start gap-2">
							<Lightning
								size={14}
								weight="fill"
								class="mt-0.5 shrink-0 text-[var(--color-success)]"
							/>
							<span class="text-foreground text-xs leading-relaxed">{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</section>
{/if}
