<script lang="ts">
	import { _ } from 'svelte-i18n';
	import TrustSocialProofAuditQuickWinItem from './TrustSocialProofAuditQuickWinItem.svelte';
	import type { TrustQuickWin } from './schema';

	type Props = { quickWins: readonly TrustQuickWin[] };
	let { quickWins }: Props = $props();
</script>

<section>
	<div class="mb-1">
		<h4 class="text-foreground text-sm font-semibold">
			{$_('modules.trustSocialProofAudit.quickWins.heading')}
		</h4>
		<p class="text-muted-foreground text-xs">
			{$_('modules.trustSocialProofAudit.quickWins.subtitle')}
		</p>
	</div>

	{#if quickWins.length === 0}
		<p class="text-muted-foreground mt-3 text-xs italic">
			{$_('modules.trustSocialProofAudit.quickWins.empty')}
		</p>
	{:else}
		<ul class="mt-3 space-y-2">
			{#each quickWins as quickWin, index (index)}
				<TrustSocialProofAuditQuickWinItem {quickWin} {index} />
			{/each}
		</ul>
	{/if}
</section>
