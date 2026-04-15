<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
	import CopyAnalysisHeader from './CopyAnalysisHeader.svelte';
	import CopyAnalysisExtracted from './CopyAnalysisExtracted.svelte';
	import CopyAnalysisStoryBrand from './CopyAnalysisStoryBrand.svelte';
	import CopyAnalysisDimensions from './CopyAnalysisDimensions.svelte';
	import CopyAnalysisStrengthsIssues from './CopyAnalysisStrengthsIssues.svelte';
	import CopyAnalysisQuickWins from './CopyAnalysisQuickWins.svelte';
	import type { CopyAnalysisResult } from './schema';

	type Props = { result: CopyAnalysisResult };
	let { result }: Props = $props();
</script>

<div>
	<div class="mb-6">
		<CopyAnalysisHeader
			overallScore={result.overallScore}
			verdict={result.verdict}
			framing={result.framing}
		/>
	</div>
	<Collapsible title={$_('modules.copyAnalysis.extracted.heading')}>
		<CopyAnalysisExtracted extracted={result.extracted} />
	</Collapsible>
	<Collapsible title={$_('modules.copyAnalysis.storyBrand.heading')}>
		<CopyAnalysisStoryBrand storyBrand={result.storyBrand} />
	</Collapsible>
	<Collapsible title={$_('modules.copyAnalysis.dimensions.heading')}>
		<CopyAnalysisDimensions dimensions={result.dimensions} />
	</Collapsible>
	<Collapsible title={$_('modules.copyAnalysis.findings.heading')}>
		<CopyAnalysisStrengthsIssues
			strengths={result.strengths}
			criticalIssues={result.criticalIssues}
		/>
	</Collapsible>
	<Collapsible title={$_('modules.copyAnalysis.quickWins.heading')}>
		<CopyAnalysisQuickWins quickWins={result.quickWins} />
	</Collapsible>
</div>
