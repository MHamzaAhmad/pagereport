<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();
</script>

<div class={cn('bg-muted animate-pulse rounded-[var(--radius-sm)]', className)}></div>
