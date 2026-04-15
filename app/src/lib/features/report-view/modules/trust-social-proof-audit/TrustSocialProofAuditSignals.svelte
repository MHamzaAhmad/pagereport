<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { ChatCircleText, Star, ShieldCheck, SealCheck, Storefront, Clock } from 'phosphor-svelte';
	import TrustSocialProofAuditSignalCard from './TrustSocialProofAuditSignalCard.svelte';
	import type {
		TrustBadges,
		TrustGuarantees,
		TrustReviewsRatings,
		TrustSocialProof,
		TrustTestimonials,
		TrustUrgencyScarcity
	} from './schema';

	type Props = {
		testimonials: TrustTestimonials;
		reviewsRatings: TrustReviewsRatings;
		trustBadges: TrustBadges;
		guarantees: TrustGuarantees;
		socialProof: TrustSocialProof;
		urgencyScarcity: TrustUrgencyScarcity;
	};

	let {
		testimonials,
		reviewsRatings,
		trustBadges,
		guarantees,
		socialProof,
		urgencyScarcity
	}: Props = $props();

	const badgesPresent = $derived(
		trustBadges.ssl ||
			trustBadges.paymentLogos ||
			trustBadges.securityCertifications ||
			trustBadges.detectedBadges.length > 0
	);
	const guaranteesPresent = $derived(
		guarantees.moneyBack ||
			guarantees.freeOrFastShipping ||
			guarantees.warranty ||
			guarantees.details.length > 0
	);
	const socialProofPresent = $derived(
		socialProof.customerLogos ||
			socialProof.pressMentions ||
			socialProof.userCounts ||
			socialProof.influencerOrExpert ||
			socialProof.notes.length > 0
	);
</script>

<section>
	<h4 class="text-foreground mb-2 text-sm font-semibold">
		{$_('modules.trustSocialProofAudit.signals.heading')}
	</h4>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		<TrustSocialProofAuditSignalCard
			labelKey="modules.trustSocialProofAudit.signals.testimonials.label"
			tooltipKey="modules.trustSocialProofAudit.signals.testimonials.tooltip"
			present={testimonials.present}
			icon={ChatCircleText}
		>
			{#if testimonials.present}
				<p>
					{$_('modules.trustSocialProofAudit.signals.testimonials.count', {
						values: { count: testimonials.count }
					})}
					<span class="text-muted-foreground/80">
						· {testimonials.hasNames
							? $_('modules.trustSocialProofAudit.signals.testimonials.hasNames')
							: $_('modules.trustSocialProofAudit.signals.testimonials.anonymous')}
						· {testimonials.hasPhotos
							? $_('modules.trustSocialProofAudit.signals.testimonials.hasPhotos')
							: $_('modules.trustSocialProofAudit.signals.testimonials.noPhotos')}
					</span>
				</p>
				{#if testimonials.examples.length > 0}
					<ul class="mt-1.5 space-y-1">
						{#each testimonials.examples as quote (quote)}
							<li class="text-foreground/90 border-border border-l-2 pl-2 italic">
								“{quote}”
							</li>
						{/each}
					</ul>
				{/if}
			{:else}
				{$_('modules.trustSocialProofAudit.signals.testimonials.absent')}
			{/if}
		</TrustSocialProofAuditSignalCard>

		<TrustSocialProofAuditSignalCard
			labelKey="modules.trustSocialProofAudit.signals.reviews.label"
			tooltipKey="modules.trustSocialProofAudit.signals.reviews.tooltip"
			present={reviewsRatings.present}
			icon={Star}
		>
			{#if reviewsRatings.present}
				<p>
					{#if reviewsRatings.averageRating !== null}
						<span class="text-foreground font-semibold"
							>{reviewsRatings.averageRating.toFixed(1)}</span
						>
						<span class="text-muted-foreground/80">
							{$_('modules.trustSocialProofAudit.signals.reviews.ratingSuffix')}</span
						>
					{/if}
					{#if reviewsRatings.reviewCount !== null}
						<span class="text-muted-foreground/80">
							·
							{$_('modules.trustSocialProofAudit.signals.reviews.count', {
								values: { count: reviewsRatings.reviewCount }
							})}
						</span>
					{/if}
				</p>
				{#if reviewsRatings.source}
					<p class="text-muted-foreground/80 mt-1">
						{$_('modules.trustSocialProofAudit.signals.reviews.sourceLabel')}:
						<span class="text-foreground/90 font-medium">{reviewsRatings.source}</span>
					</p>
				{/if}
			{:else}
				{$_('modules.trustSocialProofAudit.signals.reviews.absent')}
			{/if}
		</TrustSocialProofAuditSignalCard>

		<TrustSocialProofAuditSignalCard
			labelKey="modules.trustSocialProofAudit.signals.badges.label"
			tooltipKey="modules.trustSocialProofAudit.signals.badges.tooltip"
			present={badgesPresent}
			icon={ShieldCheck}
		>
			{#if badgesPresent}
				<ul class="space-y-0.5">
					<li>
						{trustBadges.ssl ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.badges.ssl')}
					</li>
					<li>
						{trustBadges.paymentLogos ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.badges.paymentLogos')}
					</li>
					<li>
						{trustBadges.securityCertifications ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.badges.certifications')}
					</li>
				</ul>
				{#if trustBadges.detectedBadges.length > 0}
					<div class="mt-1.5 flex flex-wrap gap-1">
						{#each trustBadges.detectedBadges as badge (badge)}
							<span class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px]">
								{badge}
							</span>
						{/each}
					</div>
				{/if}
			{:else}
				{$_('modules.trustSocialProofAudit.signals.badges.absent')}
			{/if}
		</TrustSocialProofAuditSignalCard>

		<TrustSocialProofAuditSignalCard
			labelKey="modules.trustSocialProofAudit.signals.guarantees.label"
			tooltipKey="modules.trustSocialProofAudit.signals.guarantees.tooltip"
			present={guaranteesPresent}
			icon={SealCheck}
		>
			{#if guaranteesPresent}
				<ul class="space-y-0.5">
					<li>
						{guarantees.moneyBack ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.guarantees.moneyBack')}
					</li>
					<li>
						{guarantees.freeOrFastShipping ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.guarantees.shipping')}
					</li>
					<li>
						{guarantees.warranty ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.guarantees.warranty')}
					</li>
				</ul>
				{#if guarantees.details.length > 0}
					<ul class="text-foreground/90 mt-1.5 space-y-0.5">
						{#each guarantees.details as detail (detail)}
							<li>· {detail}</li>
						{/each}
					</ul>
				{/if}
			{:else}
				{$_('modules.trustSocialProofAudit.signals.guarantees.absent')}
			{/if}
		</TrustSocialProofAuditSignalCard>

		<TrustSocialProofAuditSignalCard
			labelKey="modules.trustSocialProofAudit.signals.socialProof.label"
			tooltipKey="modules.trustSocialProofAudit.signals.socialProof.tooltip"
			present={socialProofPresent}
			icon={Storefront}
		>
			{#if socialProofPresent}
				<ul class="space-y-0.5">
					<li>
						{socialProof.customerLogos ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.socialProof.customerLogos')}
					</li>
					<li>
						{socialProof.pressMentions ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.socialProof.pressMentions')}
					</li>
					<li>
						{socialProof.userCounts ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.socialProof.userCounts')}
					</li>
					<li>
						{socialProof.influencerOrExpert ? '✓' : '–'}
						{$_('modules.trustSocialProofAudit.signals.socialProof.influencer')}
					</li>
				</ul>
				{#if socialProof.notes.length > 0}
					<ul class="text-foreground/90 mt-1.5 space-y-0.5">
						{#each socialProof.notes as note (note)}
							<li>· {note}</li>
						{/each}
					</ul>
				{/if}
			{:else}
				{$_('modules.trustSocialProofAudit.signals.socialProof.absent')}
			{/if}
		</TrustSocialProofAuditSignalCard>

		<TrustSocialProofAuditSignalCard
			labelKey="modules.trustSocialProofAudit.signals.urgency.label"
			tooltipKey="modules.trustSocialProofAudit.signals.urgency.tooltip"
			present={urgencyScarcity.present}
			icon={Clock}
		>
			{#if urgencyScarcity.present}
				<p>
					{$_(`modules.trustSocialProofAudit.signals.urgency.type.${urgencyScarcity.type}`)}
				</p>
				<p class="mt-1">
					{urgencyScarcity.feelsAuthentic
						? $_('modules.trustSocialProofAudit.signals.urgency.authentic')
						: $_('modules.trustSocialProofAudit.signals.urgency.inauthentic')}
				</p>
			{:else}
				{$_('modules.trustSocialProofAudit.signals.urgency.absent')}
			{/if}
		</TrustSocialProofAuditSignalCard>
	</div>
</section>
