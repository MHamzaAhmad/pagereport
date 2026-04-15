<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { BadgeVariants } from '$lib/components/ui/Badge.svelte';
	import type { CtaAuditStatus } from './schema';

	type Props = {
		overallStatus: CtaAuditStatus;
		verdict: string;
	};
	let { overallStatus, verdict }: Props = $props();

	const tone: BadgeVariants['tone'] = $derived(
		overallStatus === 'ok' ? 'success' : overallStatus === 'warning' ? 'warning' : 'danger'
	);
</script>

<section class="flex flex-col gap-2">
	<div class="flex items-center gap-2">
		<h4 class="text-foreground text-sm font-semibold">
			{$_('modules.ctaAudit.overall.heading')}
		</h4>
		<Badge {tone}>
			{$_(`modules.ctaAudit.overall.status.${overallStatus}`)}
		</Badge>
	</div>
	<p class="text-foreground text-sm leading-relaxed">{verdict}</p>
</section>
