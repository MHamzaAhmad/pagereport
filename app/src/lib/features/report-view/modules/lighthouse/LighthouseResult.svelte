<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
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

<div>
	<div class="mb-6 space-y-5">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<p class="text-muted-foreground min-w-0 truncate text-xs" title={active.finalUrl}>
				{$_('modules.lighthouse.opportunities.finalUrlLabel')}: {active.finalUrl}
			</p>
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
	</div>

	<Collapsible title={$_('modules.lighthouse.cwv.heading')}>
		<LighthouseCoreWebVitals cwv={active.coreWebVitals} />
	</Collapsible>
	<Collapsible title={$_('modules.lighthouse.opportunities.heading')}>
		<LighthouseOpportunityList opportunities={[...active.opportunities]} />
	</Collapsible>
</div>
