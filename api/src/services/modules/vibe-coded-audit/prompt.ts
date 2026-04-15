export function buildVibeVisionPrompt(niche: string): string {
	return `You are inspecting a web page screenshot to judge whether it looks "vibe-coded" — meaning quickly built with an AI tool from a generic template, as opposed to a custom, considered design.
The page's niche is: "${niche}".

Describe in plain prose, concretely and only from what is visible:
- Gradient usage: how many sections use gradient backgrounds, and whether they dominate the look.
- Icon density: are there many small decorative icons (especially inside cards)? Do they appear to come from a generic set (heroicons, lucide, phosphor-style line icons)?
- Card / grid repetition: are there rows of 2–4 identical "icon + heading + short text" cards? How many such grids?
- Hero treatment: is there a sparkle badge, a "New" pill, or a tagline with emojis above the main headline?
- Typography and palette: does the type feel like the default Inter/Geist SaaS template, with a pastel or neon gradient palette? Or does it have a distinctive voice?
- Overall verdict: does this look like a templated AI-generated landing page, or a custom design with intent?

Do not invent details. Do not use JSON or markdown. Plain prose only.`;
}

export const VIBE_STRUCTURE_SYSTEM_PROMPT = `You convert a JSON input describing a landing page's visual and structural signals into a strict JSON verdict on whether the page looks "vibe-coded".

Vibe-coded means: the page looks like it was generated quickly from an AI template. Tell-tale signs include gradient overuse, repetitive "icon + card" grids, many decorative icons from generic icon sets, emoji bullet lists, sparkle/new hero badges, and a look that could belong to any SaaS or dropshipping store.

Input fields:
- domSignals: deterministic counts extracted from the page HTML (gradientCount, svgCount, iconClassCount, emojiCount, cardGridHits, sparkleBadgeHits, totalNodes). Use totalNodes to judge density — e.g. 40 svgs on a small page is stronger evidence than 40 svgs on a huge page.
- visionDescription: plain-prose description of how the page looks visually.
- niche: the page's market.

Rules:
- "verdict": one of "looks_custom", "possibly_vibe_coded", "likely_vibe_coded". Pick "likely_vibe_coded" only when multiple strong signals agree (high gradient + high icon-card density OR a clear generic-template visual judgment).
- "confidenceScore": integer 0-100 reflecting how confidently you hold the verdict given agreement between DOM signals and the vision description. Disagreement → lower confidence.
- "summary": one or two sentences, plain language, written for a non-technical dropshipper. Say whether the page looks templated or custom and briefly why.
- "signals": up to 6 entries, only for patterns actually observed. Each needs a specific "observation" tied to what you saw (e.g. "Three icon-card grids in a row on the features section"). Set severity based on how prominent the pattern is.
- Use only information present in the input. Do not invent counts or elements. If a pattern is not supported by evidence, omit it.`;
