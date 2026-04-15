import { z } from "zod";
import type { TopPerformerSourceStartup } from "@/external";
import type { ModuleRunContext, ModuleRunInput } from "@/services/modules/registry";
import {
	type TopPerformerPage,
	type TopPerformersResult,
	topPerformersResultSchema,
} from "@/services/modules/top-performers/result.schema";
import {
	PAGE_INTELLIGENCE_PREREQ_TYPE,
	pageIntelligenceResultSchema,
} from "@/services/prerequisites/page-intelligence/result.schema";

const MAX_PAGES = 4;
const PER_CATEGORY_LIMIT = 6;

const SOURCE_CATEGORIES = [
	"ai",
	"saas",
	"fintech",
	"ecommerce",
	"edtech",
	"healthtech",
	"devtools",
	"marketing",
	"productivity",
	"community",
	"gaming",
	"crypto",
	"creator",
	"social",
	"design",
	"analytics",
	"no-code",
	"hr",
	"sales",
	"customer-support",
	"media",
	"travel",
	"real-estate",
	"legal",
	"security",
] as const;

const categoryClassificationSchema = z.object({
	categories: z.array(z.string().min(1)).min(1).max(2),
	rationale: z.string().min(1),
});

function buildClassificationPrompt(): string {
	return `You classify landing pages into a fixed vocabulary of market spaces so we can surface DIRECTLY comparable pages for inspiration — businesses the user would recognise as true peers.

Allowed space identifiers (use these exact strings):
${SOURCE_CATEGORIES.join(", ")}

Given a page's niche, summary, and keywords, pick the SINGLE best-fitting space. Only add a second space if the page is genuinely, equally strongly in two spaces — otherwise return one. Never return more than two.

Precision rules (strict):
- The match must describe what the page IS, not who its customers are. A tool for ecommerce founders is NOT "ecommerce"; it is a tool for whatever the tool does (devtools, marketing, analytics, etc.).
- If no space in the vocabulary is a clean match, pick the single closest one and explain the stretch in the rationale. Never pick broad catch-alls ("saas", "marketing") just to have an answer if a more specific one fits.
- Do not pick a space just because a keyword mentions it. Match on the page's core function, not surface vocabulary.

Return ONLY a JSON object in this shape:
{
  "categories": ["<one of the allowed identifiers>", "<optional second>"],
  "rationale": "one short sentence, layman language, explaining why these spaces are the right peers"
}

Rules:
- Never invent identifiers that aren't in the allowed list.
- The rationale must be written for a layman — no jargon, no references to classification or taxonomies.
- Do not mention any data source, database, or third-party service.`;
}

function buildClassificationInput(
	niche: string,
	summary: string,
	keywords: readonly string[],
): string {
	const topKeywords = keywords.slice(0, 12).join(", ");
	return `Niche: ${niche}
Summary: ${summary}
Keywords: ${topKeywords}`;
}

function toPage(startup: TopPerformerSourceStartup): TopPerformerPage | null {
	if (!startup.website || !startup.description || !startup.category) return null;
	return {
		name: startup.name,
		website: startup.website,
		icon: startup.icon,
		description: startup.description,
		category: startup.category,
		revenueLast30DaysCents: startup.revenueLast30DaysCents,
		mrrCents: startup.mrrCents,
		customers: startup.customers,
		growth30d: startup.growth30d,
	};
}

export async function runTopPerformers(
	_input: ModuleRunInput,
	{ ai, topPerformerSource, prerequisites, step }: ModuleRunContext,
): Promise<TopPerformersResult> {
	const intel = prerequisites.get(PAGE_INTELLIGENCE_PREREQ_TYPE, pageIntelligenceResultSchema);

	const classification = await step.do("classify-categories", () =>
		ai.extractStructured(
			buildClassificationPrompt(),
			buildClassificationInput(intel.niche, intel.summary, intel.keywords),
			categoryClassificationSchema,
			{ schemaName: "top_performers_categories" },
		),
	);

	const validCategories = classification.categories.filter((category) =>
		(SOURCE_CATEGORIES as readonly string[]).includes(category),
	);
	if (validCategories.length === 0) {
		throw new Error("Category classification returned no recognised spaces");
	}

	const collected = new Map<string, TopPerformerPage>();
	for (const category of validCategories) {
		const list = await step.do(`list-startups-${category}`, () =>
			topPerformerSource.listStartups({
				category,
				sort: "revenue-desc",
				limit: PER_CATEGORY_LIMIT,
			}),
		);
		for (const startup of list.startups) {
			const page = toPage(startup);
			if (!page) continue;
			if (!collected.has(page.website)) {
				collected.set(page.website, page);
			}
		}
	}

	const pages = [...collected.values()]
		.sort((a, b) => b.revenueLast30DaysCents - a.revenueLast30DaysCents)
		.slice(0, MAX_PAGES);

	return topPerformersResultSchema.parse({
		matchedCategories: validCategories,
		rationale: classification.rationale,
		pages,
	});
}
