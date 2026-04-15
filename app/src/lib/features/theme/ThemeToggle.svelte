<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Moon, Sun } from 'phosphor-svelte';
	import { theme } from '$lib/stores';

	type Props = { variant?: 'icon' | 'inline' };
	let { variant = 'icon' }: Props = $props();

	let button: HTMLButtonElement | null = $state(null);

	function handleClick() {
		const rect = button?.getBoundingClientRect();
		const origin = rect
			? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
			: undefined;
		theme.toggle(origin);
	}

	const isDark = $derived(theme.current === 'dark');
	const label = $derived(isDark ? $_('theme.toggleToLight') : $_('theme.toggleToDark'));
	const nextLabel = $derived(isDark ? $_('theme.light') : $_('theme.dark'));
</script>

{#if variant === 'inline'}
	<button
		bind:this={button}
		type="button"
		onclick={handleClick}
		aria-label={label}
		title={label}
		class="text-subtle hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
	>
		{#if isDark}
			<Sun size={14} weight="regular" />
		{:else}
			<Moon size={14} weight="regular" />
		{/if}
		<span>{nextLabel}</span>
	</button>
{:else}
	<button
		bind:this={button}
		type="button"
		onclick={handleClick}
		aria-label={label}
		title={label}
		class="text-muted-foreground hover:text-foreground hover:bg-muted relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] transition-colors"
	>
		<span
			class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out"
			class:opacity-0={isDark}
			class:opacity-100={!isDark}
			class:rotate-90={isDark}
			class:scale-50={isDark}
			aria-hidden="true"
		>
			<Sun size={18} weight="regular" />
		</span>
		<span
			class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out"
			class:opacity-100={isDark}
			class:opacity-0={!isDark}
			class:-rotate-90={!isDark}
			class:scale-50={!isDark}
			aria-hidden="true"
		>
			<Moon size={18} weight="regular" />
		</span>
	</button>
{/if}
