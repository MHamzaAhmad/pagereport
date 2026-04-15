<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';

	let { children }: { children: Snippet } = $props();

	const canonicalUrl = $derived(`${page.url.origin}${page.url.pathname}`);
</script>

<svelte:head>
	<title>{$_('seo.defaultTitle')}</title>
	<meta name="description" content={$_('seo.defaultDescription')} />
	<meta name="keywords" content={$_('seo.keywords')} />
	<meta name="robots" content="index, follow" />
	<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#161616" media="(prefers-color-scheme: dark)" />
	<link rel="icon" href={favicon} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={$_('seo.siteName')} />
	<meta property="og:title" content={$_('seo.defaultTitle')} />
	<meta property="og:description" content={$_('seo.defaultDescription')} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={$_('seo.defaultTitle')} />
	<meta name="twitter:description" content={$_('seo.defaultDescription')} />
</svelte:head>

<div class="min-h-full">
	{@render children()}
</div>
