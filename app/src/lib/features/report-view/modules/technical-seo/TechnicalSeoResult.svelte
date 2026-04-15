<script lang="ts">
	import { _ } from 'svelte-i18n';
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

<div class="space-y-5">
	<TechnicalSeoHeader
		overallStatus={result.overallStatus}
		overallScore={result.overallScore}
		verdict={result.verdict}
	/>
	<TechnicalSeoSocialPreview metadata={result.metadata} />
	<TechnicalSeoCheckSection heading={$_('modules.technicalSeo.sections.core')} rows={coreRows} />
	<TechnicalSeoCheckSection heading={$_('modules.technicalSeo.sections.openGraph')} rows={ogRows} />
	<TechnicalSeoCheckSection
		heading={$_('modules.technicalSeo.sections.twitter')}
		rows={twitterRows}
	/>
	<TechnicalSeoStructuredData metadata={result.metadata} />
	<TechnicalSeoIssuesFixes issues={result.issues} quickWins={result.quickWins} />
</div>
