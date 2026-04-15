<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type Props = {
		label?: string;
		class?: string;
	};

	let { label, class: className }: Props = $props();
</script>

{#if label}
	<div class={cn('flex items-center gap-4', className)}>
		<span class="text-subtle text-[10px] font-medium tracking-[0.18em] uppercase">{label}</span>
		<span class="bg-border h-px flex-1"></span>
	</div>
{:else}
	<div class={cn('bg-border h-px w-full', className)}></div>
{/if}
