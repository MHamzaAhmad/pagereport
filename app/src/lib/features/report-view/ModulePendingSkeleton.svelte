<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import type { ModuleRunStatus } from '$lib/types';

	type Props = { status: Extract<ModuleRunStatus, 'pending' | 'running'> };
	let { status }: Props = $props();
</script>

<div class="space-y-3">
	<p class="text-muted-foreground text-xs">
		{status === 'running' ? $_('module.runningHint') : $_('module.pendingHint')}
	</p>
	<Skeleton class="h-4 w-full" />
	<Skeleton class="h-4 w-5/6" />
	<Skeleton class="h-4 w-4/6" />
</div>
