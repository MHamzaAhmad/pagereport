<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { WarningCircle } from 'phosphor-svelte';

	type Props = { message: string | null };
	let { message }: Props = $props();
</script>

<Alert tone="danger">
	<WarningCircle size={18} weight="fill" />
	<div class="space-y-1">
		<p class="font-medium">{$_('module.failed.title')}</p>
		<p class="text-xs opacity-90">{message ?? $_('module.failed.defaultMessage')}</p>
	</div>
</Alert>
