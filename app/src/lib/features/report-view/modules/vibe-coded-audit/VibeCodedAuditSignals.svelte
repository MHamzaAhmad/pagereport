<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Circle } from 'phosphor-svelte';
	import type { VibeCodedSignal, VibeCodedSeverity } from './schema';

	type Props = { signals: readonly VibeCodedSignal[] };
	let { signals }: Props = $props();

	function severityColor(severity: VibeCodedSeverity): string {
		if (severity === 'high') return 'text-[var(--color-danger)]';
		if (severity === 'medium') return 'text-[var(--color-warning)]';
		return 'text-muted-foreground';
	}
</script>

{#if signals.length > 0}
	<section>
		<h4 class="text-foreground mb-2 text-sm font-semibold">
			{$_('modules.vibeCodedAudit.signalsHeading')}
		</h4>
		<ul class="grid grid-cols-1 gap-2 md:grid-cols-2">
			{#each signals as signal (signal.pattern + signal.observation)}
				<li class="border-border bg-muted/30 flex items-start gap-2 rounded-md border p-3">
					<Circle
						size={10}
						weight="fill"
						class={`mt-1.5 shrink-0 ${severityColor(signal.severity)}`}
					/>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-1.5">
							<span class="text-foreground text-xs font-semibold">
								{$_(`modules.vibeCodedAudit.patterns.${signal.pattern}`)}
							</span>
							<span class="text-muted-foreground text-[10px] tracking-wide uppercase">
								{$_(`modules.vibeCodedAudit.severity.${signal.severity}`)}
							</span>
						</div>
						<p class="text-muted-foreground mt-0.5 text-xs leading-relaxed">
							{signal.observation}
						</p>
					</div>
				</li>
			{/each}
		</ul>
	</section>
{/if}
