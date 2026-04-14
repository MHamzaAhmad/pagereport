import {
	type FiveSecTestResult,
	fiveSecTestResultSchema,
} from "@/services/modules/five-sec-test/result.schema";
import type { ModuleRunContext, ModuleRunInput } from "@/services/modules/registry";

const FIVE_SEC_PROMPT = `You are simulating a first-time visitor's 5-second impression of a web page.
Look at the attached screenshot and answer as if you had only 5 seconds to form an opinion.

Respond with ONLY a JSON object (no prose, no markdown fences) matching this exact shape:
{
  "summary": "one sentence: what kind of page this is",
  "whatItsAbout": "2-3 sentences: what the page is offering/selling/communicating",
  "primaryAction": "the single most obvious action a new visitor would take",
  "impressions": ["1-5 short bullet phrases of gut reactions: tone, trust, clarity, novelty"]
}`;

export async function runFiveSecTest(
	{ url }: ModuleRunInput,
	{ browser, ai, step }: ModuleRunContext,
): Promise<FiveSecTestResult> {
	const screenshotB64 = await step.do("screenshot", async () => {
		const bytes = await browser.screenshot(url);
		return uint8ToBase64(bytes);
	});

	const raw = await step.do("vision-describe", () =>
		ai.visionDescribe(base64ToUint8(screenshotB64), FIVE_SEC_PROMPT),
	);

	return await step.do("parse-result", async () => parseStructuredDescription(raw));
}

function parseStructuredDescription(text: string): FiveSecTestResult {
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start === -1 || end === -1 || end <= start) {
		throw new Error("Vision model response did not contain a JSON object");
	}
	const json = text.slice(start, end + 1);
	const parsed: unknown = JSON.parse(json);
	return fiveSecTestResultSchema.parse(parsed);
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
