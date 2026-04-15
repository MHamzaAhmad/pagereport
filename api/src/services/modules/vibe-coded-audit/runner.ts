import type { ModuleRunContext, ModuleRunInput } from "@/services/modules/registry";
import {
	buildVibeVisionPrompt,
	VIBE_STRUCTURE_SYSTEM_PROMPT,
} from "@/services/modules/vibe-coded-audit/prompt";
import {
	type VibeCodedAuditResult,
	vibeCodedAuditResultSchema,
} from "@/services/modules/vibe-coded-audit/result.schema";
import { extractDomSignals } from "@/services/modules/vibe-coded-audit/signals";
import {
	PAGE_INTELLIGENCE_PREREQ_TYPE,
	pageIntelligenceResultSchema,
} from "@/services/prerequisites/page-intelligence/result.schema";
import {
	PAGE_SCRAPE_PREREQ_TYPE,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";

export async function runVibeCodedAudit(
	{ url }: ModuleRunInput,
	{ ai, browser, prerequisites, step }: ModuleRunContext,
): Promise<VibeCodedAuditResult> {
	const scrape = prerequisites.get(PAGE_SCRAPE_PREREQ_TYPE, pageScrapeResultSchema);
	const intel = prerequisites.get(PAGE_INTELLIGENCE_PREREQ_TYPE, pageIntelligenceResultSchema);

	const domSignals = extractDomSignals(scrape.html);

	const screenshotB64 = await step.do("screenshot", async () => {
		const bytes = await browser.screenshot(url);
		return uint8ToBase64(bytes);
	});

	const visionDescription = await step.do("vision-describe", () =>
		ai.visionDescribe(base64ToUint8(screenshotB64), buildVibeVisionPrompt(intel.niche)),
	);

	const llmInput = JSON.stringify({
		domSignals,
		visionDescription,
		niche: intel.niche,
	});

	return await step.do("structure-result", () =>
		ai.extractStructured(VIBE_STRUCTURE_SYSTEM_PROMPT, llmInput, vibeCodedAuditResultSchema, {
			schemaName: "vibe_coded_audit_result",
			temperature: 0.2,
		}),
	);
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
