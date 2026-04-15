<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import type { ModuleRunStatus } from '$lib/types';

	type Props = {
		status: Extract<ModuleRunStatus, 'pending' | 'running' | 'awaiting_prerequisites'>;
	};
	let { status }: Props = $props();

	const hintKey = $derived.by(() => {
		if (status === 'running') return 'module.runningHint';
		if (status === 'awaiting_prerequisites') return 'module.awaitingPrerequisitesHint';
		return 'module.pendingHint';
	});
</script>

<div class="space-y-3">
	<p class="text-muted-foreground text-xs">
		{$_(hintKey)}
	</p>
	<Skeleton class="h-4 w-full" />
	<Skeleton class="h-4 w-5/6" />
	<Skeleton class="h-4 w-4/6" />
</div>
