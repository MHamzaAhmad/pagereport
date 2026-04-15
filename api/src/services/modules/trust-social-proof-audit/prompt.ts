export function buildVisionPrompt(
	niche: string,
	keywords: readonly string[],
	sectionIndex: number,
	totalSections: number,
): string {
	const niceKeywords = keywords.slice(0, 8).join(", ");
	const humanIndex = sectionIndex + 1;
	return `You are auditing a landing page for trust and social-proof signals. The page's niche is: "${niche}". Known keywords: ${niceKeywords}.

You are looking at section ${humanIndex} of ${totalSections} (top-to-bottom slice of the full page screenshot).

Describe ONLY what you can see in this section that relates to trust or social proof. In plain prose, list:
- Testimonials (quoted customer voices, with names/photos if shown).
- Reviews and star ratings (visible stars, numeric ratings, review counts, platform badges like Trustpilot / Judge.me / Google / Yotpo).
- Trust badges (SSL, secure checkout, Norton/McAfee, "verified", BBB, etc.).
- Payment method logos (Visa, Mastercard, PayPal, Apple Pay, Shop Pay, Klarna, etc.).
- Guarantees (money-back, satisfaction, warranty, free/fast shipping, returns policy).
- Customer logos ("as seen on", brand walls, press mentions like Forbes / TechCrunch / NYT).
- User counts and follower numbers (e.g. "50,000+ customers", "rated 4.8/5 by 2,000 users").
- Expert, doctor, or influencer endorsements.
- Urgency or scarcity elements (stock counters, countdown timers, "only X left", limited-time banners). Note whether they feel authentic or fake.

Rules:
- Only describe what is actually visible. Do not invent.
- If this section contains NO trust or social-proof signals, say so in one sentence.
- Do not describe unrelated content (hero copy, product features, navigation).
- Plain prose only. No JSON, no markdown, no bullet characters.`;
}

export const STRUCTURE_SYSTEM_PROMPT = `You convert multi-section visual descriptions of a landing page plus a markdown excerpt into a strict JSON trust-and-social-proof audit.

Input format:
- A numbered list of section descriptions (section 1 is the top of the page, section N is the bottom). Each describes the trust and social-proof signals visible in that slice.
- A "---PAGE MARKDOWN---" block with the page's text content (may be truncated). Use this to recover textual signals (review text, testimonial quotes, guarantee copy) that the vision pass might have missed.

Output rules:
- Populate every field in the schema. Booleans must reflect whether the signal is present anywhere across ALL sections combined.
- "testimonials.examples": up to 3 short quotes (max ~240 chars each), taken verbatim from what you observed. Empty array if none.
- "reviewsRatings.averageRating" and "reviewCount": only fill if an explicit number is visible; otherwise null.
- "reviewsRatings.source": the platform name if visible (e.g. "Trustpilot", "Judge.me", "Google Reviews", "on-page"); otherwise null.
- "trustBadges.detectedBadges": short labels for each badge seen (e.g. "Visa", "PayPal", "Norton Secured", "SSL"). Max 10. Empty if none.
- "guarantees.details": short phrases describing each guarantee ("30-day money-back", "Free shipping over $50"). Max 5.
- "socialProof.notes": short phrases for customer logos, press mentions, user counts, expert endorsements. Max 5.
- "urgencyScarcity.feelsAuthentic": false if the urgency reads as manipulative/fake (permanent countdown, fake stock), true if it reads as honest or is absent.
- "gaps": 0 to 8 short phrases describing signals that are MISSING but would strengthen trust for this niche. Prioritise the highest-impact gaps.
- "redFlags": 0 to 5 short phrases describing things that actively damage trust (broken badges, fake urgency, stock photos, stolen reviews, missing contact info, suspicious guarantees).
- "quickWins": 0 to 5 actionable, specific improvements the owner can ship within a day. Each is { title (<=100 chars), detail (<=280 chars) }.

Scoring rubric for "overallScore" (0-100):
- Start from 0. Add points for each signal category below.
  - Reviews/ratings with visible count and source: +25 (or +15 if present but partial).
  - Testimonials with names/photos: +18 (or +10 if anonymous text-only).
  - Guarantees (money-back / shipping / warranty): up to +15 total, 5 each.
  - Trust badges (SSL + payment + certifications): up to +12 total, 4 each.
  - Customer logos / press mentions / user counts / expert endorsements: up to +15 total, ~4 each.
  - Authentic urgency that isn't manipulative: +5. Absent urgency: 0. Fake urgency: -5.
  - Strong verdict cohesion (multiple categories reinforcing each other): +10 bonus.
- Subtract 5-15 per red flag.
- Clamp to [0, 100].
- Round to an integer.

"verdict" is one plain-English sentence (<=240 chars) describing the overall trust impression — honest, specific, useful.

Do not invent signals that are not present in the input. If in doubt, mark as absent.`;
