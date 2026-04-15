<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { Sparkle } from 'phosphor-svelte';
</script>

<Tooltip content={$_('modules.tiers.paid.fromCacheTooltip')}>
	<Badge tone="success">
		<Sparkle size={12} weight="fill" />
		{$_('modules.tiers.paid.fromCacheBadge')}
	</Badge>
</Tooltip>
