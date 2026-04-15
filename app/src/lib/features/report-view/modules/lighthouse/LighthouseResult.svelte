<script lang="ts">
	import { _ } from 'svelte-i18n';
	import LighthouseCategoryScore from './LighthouseCategoryScore.svelte';
	import LighthouseCoreWebVitals from './LighthouseCoreWebVitals.svelte';
	import LighthouseDeviceTabs from './LighthouseDeviceTabs.svelte';
	import LighthouseOpportunityList from './LighthouseOpportunityList.svelte';
	import type { LighthouseFormFactor, LighthouseResult } from './schema';

	type Props = { result: LighthouseResult };
	let { result }: Props = $props();

	let device = $state<LighthouseFormFactor>('mobile');
	const active = $derived(device === 'mobile' ? result.mobile : result.desktop);
</script>

<div class="space-y-5">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="min-w-0">
			<h4 class="text-foreground text-sm font-semibold">
				{$_('modules.lighthouse.scoresHeading')}
			</h4>
			<p class="text-muted-foreground mt-0.5 truncate text-xs" title={active.finalUrl}>
				{$_('modules.lighthouse.opportunities.finalUrlLabel')}: {active.finalUrl}
			</p>
		</div>
		<LighthouseDeviceTabs
			value={device}
			onChange={(next: LighthouseFormFactor) => (device = next)}
		/>
	</div>

	<div class="grid grid-cols-3 gap-2 sm:gap-4">
		<LighthouseCategoryScore
			score={active.scores.performance}
			labelKey="modules.lighthouse.categories.performance.label"
			tooltipKey="modules.lighthouse.categories.performance.tooltip"
		/>
		<LighthouseCategoryScore
			score={active.scores.seo}
			labelKey="modules.lighthouse.categories.seo.label"
			tooltipKey="modules.lighthouse.categories.seo.tooltip"
		/>
		<LighthouseCategoryScore
			score={active.scores.accessibility}
			labelKey="modules.lighthouse.categories.accessibility.label"
			tooltipKey="modules.lighthouse.categories.accessibility.tooltip"
		/>
	</div>

	<LighthouseCoreWebVitals cwv={active.coreWebVitals} />

	<LighthouseOpportunityList opportunities={[...active.opportunities]} />
</div>
