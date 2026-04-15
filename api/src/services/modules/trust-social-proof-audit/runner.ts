import type { ModuleRunContext, ModuleRunInput } from "@/services/modules/registry";
import {
	buildVisionPrompt,
	STRUCTURE_SYSTEM_PROMPT,
} from "@/services/modules/trust-social-proof-audit/prompt";
import {
	type TrustSocialProofAuditResult,
	trustSocialProofAuditResultSchema,
} from "@/services/modules/trust-social-proof-audit/result.schema";
import {
	PAGE_INTELLIGENCE_PREREQ_TYPE,
	pageIntelligenceResultSchema,
} from "@/services/prerequisites/page-intelligence/result.schema";
import {
	PAGE_SCRAPE_PREREQ_TYPE,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";

const MAX_SECTIONS = 6;
const MAX_MARKDOWN_CHARS = 6_000;

export async function runTrustSocialProofAudit(
	{ url }: ModuleRunInput,
	{ browser, ai, prerequisites, step }: ModuleRunContext,
): Promise<TrustSocialProofAuditResult> {
	const intel = prerequisites.get(PAGE_INTELLIGENCE_PREREQ_TYPE, pageIntelligenceResultSchema);
	const scrape = prerequisites.get(PAGE_SCRAPE_PREREQ_TYPE, pageScrapeResultSchema);

	const sectionsB64 = await step.do("screenshot-sections", async () => {
		const shots = await browser.screenshotSections(url, { maxSections: MAX_SECTIONS });
		return shots.map(uint8ToBase64);
	});

	const totalSections = sectionsB64.length;
	const sectionDescriptions: string[] = [];
	for (let i = 0; i < totalSections; i += 1) {
		const sectionB64 = sectionsB64[i];
		if (sectionB64 === undefined) continue;
		const description = await step.do(`vision-describe-section-${i}`, () =>
			ai.visionDescribe(
				base64ToUint8(sectionB64),
				buildVisionPrompt(intel.niche, intel.keywords, i, totalSections),
			),
		);
		sectionDescriptions.push(description);
	}

	const combinedInput = buildCombinedInput(sectionDescriptions, scrape.markdown);

	return await step.do("extract-structured", () =>
		ai.extractStructured(
			STRUCTURE_SYSTEM_PROMPT,
			combinedInput,
			trustSocialProofAuditResultSchema,
			{
				schemaName: "trust_social_proof_audit_result",
				temperature: 0.2,
			},
		),
	);
}

function buildCombinedInput(sectionDescriptions: readonly string[], markdown: string): string {
	const sectionsBlock =
		sectionDescriptions.length > 0
			? sectionDescriptions
					.map((text, idx) => `Section ${idx + 1} of ${sectionDescriptions.length}:\n${text}`)
					.join("\n\n")
			: "No section descriptions were captured.";

	const truncatedMarkdown = tailBiasedTruncate(markdown, MAX_MARKDOWN_CHARS);

	return `VISION SECTION DESCRIPTIONS (top to bottom):
${sectionsBlock}

---PAGE MARKDOWN---
${truncatedMarkdown}`;
}

function tailBiasedTruncate(text: string, maxChars: number): string {
	if (text.length <= maxChars) return text;
	const headShare = Math.floor(maxChars * 0.35);
	const tailShare = maxChars - headShare - 20;
	const head = text.slice(0, headShare);
	const tail = text.slice(text.length - tailShare);
	return `${head}\n\n[…truncated…]\n\n${tail}`;
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
