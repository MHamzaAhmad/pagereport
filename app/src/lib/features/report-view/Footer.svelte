<script lang="ts">
	import { _ } from 'svelte-i18n';
	import ThemeToggle from '$lib/features/theme/ThemeToggle.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="text-subtle flex items-center justify-center gap-2 px-4 py-6 text-xs">
	<span>{$_('footer.rights', { values: { year } })}</span>
	<span aria-hidden="true">•</span>
	<a href="mailto:support@pagereport.app" class="hover:text-foreground transition-colors">
		{$_('footer.support')}
	</a>
	<span aria-hidden="true">•</span>
	<ThemeToggle variant="inline" />
</footer>
