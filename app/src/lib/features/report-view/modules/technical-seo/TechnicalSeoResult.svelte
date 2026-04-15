<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
	import TechnicalSeoHeader from './TechnicalSeoHeader.svelte';
	import TechnicalSeoCheckSection from './TechnicalSeoCheckSection.svelte';
	import TechnicalSeoSocialPreview from './TechnicalSeoSocialPreview.svelte';
	import TechnicalSeoStructuredData from './TechnicalSeoStructuredData.svelte';
	import TechnicalSeoIssuesFixes from './TechnicalSeoIssuesFixes.svelte';
	import {
		TECHNICAL_SEO_CORE_CHECK_KEYS,
		TECHNICAL_SEO_OG_CHECK_KEYS,
		TECHNICAL_SEO_TWITTER_CHECK_KEYS,
		type TechnicalSeoResult
	} from './schema';

	type Props = { result: TechnicalSeoResult };
	let { result }: Props = $props();

	const coreRows = $derived(
		TECHNICAL_SEO_CORE_CHECK_KEYS.map((key) => ({ key, check: result.checks.core[key] }))
	);
	const ogRows = $derived(
		TECHNICAL_SEO_OG_CHECK_KEYS.map((key) => ({ key, check: result.checks.openGraph[key] }))
	);
	const twitterRows = $derived(
		TECHNICAL_SEO_TWITTER_CHECK_KEYS.map((key) => ({
			key,
			check: result.checks.twitter[key]
		}))
	);
</script>

<div>
	<div class="mb-6">
		<TechnicalSeoHeader
			overallStatus={result.overallStatus}
			overallScore={result.overallScore}
			verdict={result.verdict}
		/>
	</div>

	<Collapsible title={$_('modules.technicalSeo.socialPreview.heading')}>
		<TechnicalSeoSocialPreview metadata={result.metadata} />
	</Collapsible>
	<Collapsible title={$_('modules.technicalSeo.sections.core')}>
		<TechnicalSeoCheckSection rows={coreRows} />
	</Collapsible>
	<Collapsible title={$_('modules.technicalSeo.sections.openGraph')}>
		<TechnicalSeoCheckSection rows={ogRows} />
	</Collapsible>
	<Collapsible title={$_('modules.technicalSeo.sections.twitter')}>
		<TechnicalSeoCheckSection rows={twitterRows} />
	</Collapsible>
	<Collapsible title={$_('modules.technicalSeo.structuredData.heading')}>
		<TechnicalSeoStructuredData metadata={result.metadata} />
	</Collapsible>
	<Collapsible title={$_('modules.technicalSeo.issuesFixes.heading')}>
		<TechnicalSeoIssuesFixes issues={result.issues} quickWins={result.quickWins} />
	</Collapsible>
</div>
