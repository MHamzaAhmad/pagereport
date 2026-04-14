<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { ModuleRunStatus } from '$lib/types';
	import { CircleNotch, CheckCircle, WarningCircle, Clock } from 'phosphor-svelte';

	type Props = { status: ModuleRunStatus };
	let { status }: Props = $props();

	const toneByStatus = {
		pending: 'neutral',
		running: 'info',
		completed: 'success',
		failed: 'danger'
	} as const;
</script>

<Badge tone={toneByStatus[status]}>
	{#if status === 'pending'}
		<Clock size={12} weight="fill" />
	{:else if status === 'running'}
		<CircleNotch size={12} weight="bold" class="animate-spin" />
	{:else if status === 'completed'}
		<CheckCircle size={12} weight="fill" />
	{:else}
		<WarningCircle size={12} weight="fill" />
	{/if}
	{$_(`module.status.${status}`)}
</Badge>
