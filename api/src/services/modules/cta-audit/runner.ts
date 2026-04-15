import { CTA_AUDIT_SYSTEM_PROMPT, HERO_VISION_PROMPT } from "@/services/modules/cta-audit/prompt";
import {
	type CtaAuditResult,
	type CtaHrefStatus,
	ctaAuditResultSchema,
} from "@/services/modules/cta-audit/result.schema";
import type { ModuleRunContext, ModuleRunInput } from "@/services/modules/registry";
import {
	COPY_OUTLINE_PREREQ_TYPE,
	type CopyOutlineResult,
	copyOutlineResultSchema,
} from "@/services/prerequisites/copy-outline/result.schema";
import {
	PAGE_SCRAPE_PREREQ_TYPE,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";

const MAX_MARKDOWN_CHARS = 4_000;
const MAX_CTAS_FOR_LLM = 20;

type CtaFromOutline = CopyOutlineResult["ctas"][number];

interface ClassifiedCta {
	readonly text: string;
	readonly href: string | null;
	readonly kind: CtaFromOutline["kind"];
	readonly isPrimary: boolean;
	readonly sectionHeading: string | null;
	readonly hrefStatus: CtaHrefStatus;
}

export async function runCtaAudit(
	{ url }: ModuleRunInput,
	{ ai, browser, prerequisites, step }: ModuleRunContext,
): Promise<CtaAuditResult> {
	const outline = prerequisites.get(COPY_OUTLINE_PREREQ_TYPE, copyOutlineResultSchema);
	const scrape = prerequisites.get(PAGE_SCRAPE_PREREQ_TYPE, pageScrapeResultSchema);

	const classified = classifyCtas(outline.ctas);

	const heroShotB64 = await step.do("screenshot-above-fold", async () => {
		const bytes = await browser.screenshot(url);
		return uint8ToBase64(bytes);
	});

	const heroDescription = await step.do("vision-describe-hero", () =>
		ai.visionDescribe(base64ToUint8(heroShotB64), HERO_VISION_PROMPT),
	);

	const combinedInput = buildLlmInput(classified, heroDescription, scrape.markdown);

	return await step.do("extract-structured", () =>
		ai.extractStructured(CTA_AUDIT_SYSTEM_PROMPT, combinedInput, ctaAuditResultSchema, {
			schemaName: "cta_audit_result",
			temperature: 0.2,
		}),
	);
}

function classifyCtas(ctas: readonly CtaFromOutline[]): readonly ClassifiedCta[] {
	return ctas.map((cta) => ({
		text: cta.text,
		href: cta.href,
		kind: cta.kind,
		isPrimary: cta.isPrimary,
		sectionHeading: cta.sectionHeading,
		hrefStatus: classifyHref(cta.href),
	}));
}

function classifyHref(href: string | null): CtaHrefStatus {
	if (href === null) return "empty_or_missing";
	const trimmed = href.trim();
	if (trimmed.length === 0) return "empty_or_missing";
	const lower = trimmed.toLowerCase();
	if (lower.startsWith("javascript:")) return "javascript_void";
	if (lower.startsWith("mailto:") || lower.startsWith("tel:")) return "mailto_tel";
	if (trimmed === "#" || /^#[^\s]*$/.test(trimmed)) return "anchor_only";
	return "valid";
}

function buildLlmInput(
	classified: readonly ClassifiedCta[],
	heroDescription: string,
	markdown: string,
): string {
	const limited = classified.slice(0, MAX_CTAS_FOR_LLM);
	const primaryCount = classified.filter((c) => c.isPrimary).length;
	const secondaryCount = classified.length - primaryCount;

	const deterministic = {
		totalCtas: classified.length,
		primaryCount,
		secondaryCount,
		ctas: limited,
	};

	const truncatedMarkdown =
		markdown.length > MAX_MARKDOWN_CHARS
			? `${markdown.slice(0, MAX_MARKDOWN_CHARS)}\n\n[…truncated]`
			: markdown;

	return `DETERMINISTIC CTA DATA (authoritative for href/working):
${JSON.stringify(deterministic, null, 2)}

HERO VISION DESCRIPTION (authoritative for visible/prominent):
${heroDescription}

PAGE MARKDOWN (context, truncated):
${truncatedMarkdown}`;
}

function uint8ToBase64(bytes: Uint8Array): string {
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
}

function base64ToUint8(base64: string): Uint8Array {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}
