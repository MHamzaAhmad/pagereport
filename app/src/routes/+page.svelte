<script lang="ts">
	import { _ } from 'svelte-i18n';
	import ReportUrlForm from '$lib/features/report-input/ReportUrlForm.svelte';
</script>

<main class="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12 sm:py-20">
	<div class="mb-8 space-y-3">
		<p class="text-primary text-xs font-semibold tracking-wide uppercase">
			{$_('app.name')}
		</p>
		<h1 class="text-foreground text-3xl leading-tight font-bold sm:text-4xl">
			{$_('home.title')}
		</h1>
		<p class="text-muted-foreground text-base">
			{$_('home.subtitle')}
		</p>
	</div>

	<ReportUrlForm />
</main>
