<script lang="ts">
	import { _ } from 'svelte-i18n';
	import LighthouseMetricTile from './LighthouseMetricTile.svelte';
	import type { LighthouseCoreWebVitals } from './schema';
	import {
		formatCls,
		formatMilliseconds,
		rateCls,
		rateFcp,
		rateInp,
		rateLcp,
		rateSpeedIndex,
		rateTbt
	} from './formatLighthouseMetric';

	type Props = { cwv: LighthouseCoreWebVitals };
	let { cwv }: Props = $props();

	const fallback = $derived($_('modules.lighthouse.cwv.unavailable'));
</script>

<section class="space-y-2">
	<div>
		<h4 class="text-foreground text-sm font-semibold">
			{$_('modules.lighthouse.cwv.heading')}
		</h4>
		<p class="text-muted-foreground text-xs">{$_('modules.lighthouse.cwv.subtitle')}</p>
	</div>
	<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
		<LighthouseMetricTile
			labelKey="modules.lighthouse.cwv.lcp.label"
			tooltipKey="modules.lighthouse.cwv.lcp.tooltip"
			value={formatMilliseconds(cwv.lcpMs, fallback)}
			rating={rateLcp(cwv.lcpMs)}
		/>
		<LighthouseMetricTile
			labelKey="modules.lighthouse.cwv.cls.label"
			tooltipKey="modules.lighthouse.cwv.cls.tooltip"
			value={formatCls(cwv.cls, fallback)}
			rating={rateCls(cwv.cls)}
		/>
		<LighthouseMetricTile
			labelKey="modules.lighthouse.cwv.inp.label"
			tooltipKey="modules.lighthouse.cwv.inp.tooltip"
			value={formatMilliseconds(cwv.inpMs, fallback)}
			rating={rateInp(cwv.inpMs)}
		/>
		<LighthouseMetricTile
			labelKey="modules.lighthouse.cwv.fcp.label"
			tooltipKey="modules.lighthouse.cwv.fcp.tooltip"
			value={formatMilliseconds(cwv.fcpMs, fallback)}
			rating={rateFcp(cwv.fcpMs)}
		/>
		<LighthouseMetricTile
			labelKey="modules.lighthouse.cwv.tbt.label"
			tooltipKey="modules.lighthouse.cwv.tbt.tooltip"
			value={formatMilliseconds(cwv.tbtMs, fallback)}
			rating={rateTbt(cwv.tbtMs)}
		/>
		<LighthouseMetricTile
			labelKey="modules.lighthouse.cwv.speedIndex.label"
			tooltipKey="modules.lighthouse.cwv.speedIndex.tooltip"
			value={formatMilliseconds(cwv.speedIndexMs, fallback)}
			rating={rateSpeedIndex(cwv.speedIndexMs)}
		/>
	</div>
</section>
