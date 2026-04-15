<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { DeviceMobile, Desktop } from 'phosphor-svelte';
	import { cn } from '$lib/utils/cn';
	import type { LighthouseFormFactor } from './schema';

	type Props = {
		value: LighthouseFormFactor;
		onChange: (value: LighthouseFormFactor) => void;
	};

	let { value, onChange }: Props = $props();
</script>

<div
	class="border-border bg-muted/30 inline-flex rounded-md border p-0.5"
	role="tablist"
	aria-label={$_('modules.lighthouse.device.tooltip')}
>
	<button
		type="button"
		role="tab"
		aria-selected={value === 'mobile'}
		onclick={() => onChange('mobile')}
		class={cn(
			'inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors',
			value === 'mobile'
				? 'bg-background text-foreground shadow-sm'
				: 'text-muted-foreground hover:text-foreground'
		)}
	>
		<DeviceMobile size={14} />
		{$_('modules.lighthouse.device.mobile')}
	</button>
	<button
		type="button"
		role="tab"
		aria-selected={value === 'desktop'}
		onclick={() => onChange('desktop')}
		class={cn(
			'inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors',
			value === 'desktop'
				? 'bg-background text-foreground shadow-sm'
				: 'text-muted-foreground hover:text-foreground'
		)}
	>
		<Desktop size={14} />
		{$_('modules.lighthouse.device.desktop')}
	</button>
</div>
