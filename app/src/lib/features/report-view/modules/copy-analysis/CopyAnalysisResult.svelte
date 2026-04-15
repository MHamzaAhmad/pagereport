<script lang="ts">
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

<div class="space-y-6">
	<CopyAnalysisHeader
		overallScore={result.overallScore}
		verdict={result.verdict}
		framing={result.framing}
	/>
	<CopyAnalysisExtracted extracted={result.extracted} />
	<CopyAnalysisStoryBrand storyBrand={result.storyBrand} />
	<CopyAnalysisDimensions dimensions={result.dimensions} />
	<CopyAnalysisStrengthsIssues
		strengths={result.strengths}
		criticalIssues={result.criticalIssues}
	/>
	<CopyAnalysisQuickWins quickWins={result.quickWins} />
</div>
