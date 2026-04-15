<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { ModuleRunStatus } from '$lib/types';
	import {
		CircleNotch,
		CheckCircle,
		WarningCircle,
		Clock,
		Hourglass,
		LockKey
	} from 'phosphor-svelte';

	type Props = { status: ModuleRunStatus };
	let { status }: Props = $props();

	const toneByStatus = {
		pending: 'neutral',
		awaiting_prerequisites: 'neutral',
		awaiting_payment: 'info',
		running: 'info',
		completed: 'success',
		failed: 'danger'
	} as const;
</script>

<Badge tone={toneByStatus[status]}>
	{#if status === 'pending'}
		<Clock size={12} weight="fill" />
	{:else if status === 'awaiting_prerequisites'}
		<Hourglass size={12} weight="fill" />
	{:else if status === 'awaiting_payment'}
		<LockKey size={12} weight="fill" />
	{:else if status === 'running'}
		<CircleNotch size={12} weight="bold" class="animate-spin" />
	{:else if status === 'completed'}
		<CheckCircle size={12} weight="fill" />
	{:else}
		<WarningCircle size={12} weight="fill" />
	{/if}
	{$_(`module.status.${status}`)}
</Badge>
