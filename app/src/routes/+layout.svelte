<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-full">
	{@render children()}
</div>
