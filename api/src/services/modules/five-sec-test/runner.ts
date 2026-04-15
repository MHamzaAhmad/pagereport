import {
	type FiveSecTestResult,
	fiveSecTestResultSchema,
} from "@/services/modules/five-sec-test/result.schema";
import type { ModuleRunContext, ModuleRunInput } from "@/services/modules/registry";
import {
	PAGE_INTELLIGENCE_PREREQ_TYPE,
	pageIntelligenceResultSchema,
} from "@/services/prerequisites/page-intelligence/result.schema";

function buildVisionPrompt(niche: string, keywords: readonly string[]): string {
	const niceKeywords = keywords.slice(0, 8).join(", ");
	return `You are describing a web page screenshot for a first-time visitor forming a 5-second impression.
The page's niche is: "${niche}". Known keywords: ${niceKeywords}.

In plain prose, cover:
- What kind of page this looks like at a glance.
- What it appears to be offering, selling, or communicating.
- The single most obvious action a new visitor would take.
- 3 to 5 short gut reactions about tone, trust, clarity, and novelty.

Be concrete and specific about what is actually visible on the page. Do not invent details. Do not use JSON or markdown.`;
}

const STRUCTURE_SYSTEM_PROMPT = `You convert a plain-prose description of a web page's 5-second impression into a strict JSON object.

Rules:
- "summary": one sentence describing what kind of page this is.
- "whatItsAbout": 2-3 sentences on what the page is offering/selling/communicating.
- "primaryAction": the single most obvious action a new visitor would take.
- "impressions": 1 to 5 short bullet phrases — gut reactions about tone, trust, clarity, novelty.

Use only information present in the description. Do not invent details.`;

export async function runFiveSecTest(
	{ url }: ModuleRunInput,
	{ browser, ai, prerequisites, step }: ModuleRunContext,
): Promise<FiveSecTestResult> {
	const intel = prerequisites.get(PAGE_INTELLIGENCE_PREREQ_TYPE, pageIntelligenceResultSchema);
	const visionPrompt = buildVisionPrompt(intel.niche, intel.keywords);

	const screenshotB64 = await step.do("screenshot", async () => {
		const bytes = await browser.screenshot(url);
		return uint8ToBase64(bytes);
	});

	const description = await step.do("vision-describe", () =>
		ai.visionDescribe(base64ToUint8(screenshotB64), visionPrompt),
	);

	return await step.do("structure-result", () =>
		ai.extractStructured(STRUCTURE_SYSTEM_PROMPT, description, fiveSecTestResultSchema, {
			schemaName: "five_sec_test_result",
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
