<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onDestroy, untrack } from 'svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import HeroForm from '$lib/features/report-input/HeroForm.svelte';
	import TopBar from './TopBar.svelte';
	import Footer from './Footer.svelte';
	import ReportOverview from './ReportOverview.svelte';
	import ModuleList from './ModuleList.svelte';
	import PrerequisiteList from './PrerequisiteList.svelte';
	import { ReportState } from '$lib/stores';
	import { WarningCircle } from 'phosphor-svelte';

	type Props = { reportId?: string };
	let { reportId }: Props = $props();

	const state = new ReportState();

	$effect(() => {
		const id = reportId;
		untrack(() => {
			if (id) void state.load(id);
			else state.stop();
		});
	});

	onDestroy(() => state.stop());
</script>

{#if reportId}
	<TopBar />
	<main class="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:pt-14">
		{#if state.isLoading && !state.report}
			<div class="space-y-6">
				<Skeleton class="h-6 w-32" />
				<Skeleton class="h-12 w-3/4" />
				<Skeleton class="h-4 w-40" />
				<div class="space-y-4 pt-8">
					<Skeleton class="h-48 w-full" />
					<Skeleton class="h-48 w-full" />
				</div>
			</div>
		{:else if state.error && !state.report}
			<Alert tone="danger">
				<WarningCircle size={18} weight="fill" />
				<p>{$_('report.loadError')}: {state.error}</p>
			</Alert>
		{:else if state.report}
			<div class="space-y-16">
				<ReportOverview report={state.report} />
				<PrerequisiteList prerequisites={state.report.prerequisites} />
				<ModuleList runs={state.report.moduleRuns} />
			</div>
		{/if}
	</main>
	<Footer />
{:else}
	<div class="flex min-h-screen flex-col">
		<main class="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16 sm:py-24">
			<div class="mb-10 space-y-5">
				<p class="text-subtle text-[10px] font-medium tracking-[0.18em] uppercase">
					{$_('app.name')}
				</p>
				<h1 class="text-foreground font-serif text-5xl leading-[1.05] sm:text-6xl">
					{$_('home.title')}
				</h1>
				<p class="text-muted-foreground max-w-lg text-base leading-relaxed">
					{$_('home.subtitle')}
				</p>
			</div>
			<HeroForm />
		</main>
		<Footer />
	</div>
{/if}
