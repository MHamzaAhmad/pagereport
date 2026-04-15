import type { AIClient, VisionDescribeOptions } from "@/external/ai/ai.client";

const VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";
const DEFAULT_MAX_TOKENS = 1024;
const DEFAULT_TEMPERATURE = 0.2;

interface VisionResponse {
	readonly response?: unknown;
}

function extractText(raw: unknown): string {
	if (raw && typeof raw === "object") {
		const { response } = raw as VisionResponse;
		if (typeof response === "string" && response.length > 0) return response;
		if (response && typeof response === "object") return JSON.stringify(response);
	}
	throw new Error(`Workers AI vision response did not contain text output: ${JSON.stringify(raw)}`);
}

function toDataUri(image: Uint8Array): string {
	let binary = "";
	for (const byte of image) binary += String.fromCharCode(byte);
	return `data:image/jpeg;base64,${btoa(binary)}`;
}

export class CloudflareAIClient implements AIClient {
	constructor(private readonly binding: Ai) {}

	async visionDescribe(
		image: Uint8Array,
		prompt: string,
		options: VisionDescribeOptions = {},
	): Promise<string> {
		const raw = await this.binding.run(VISION_MODEL, {
			messages: [
				{
					role: "user",
					content: [
						{ type: "text", text: prompt },
						{ type: "image_url", image_url: { url: toDataUri(image) } },
					],
				},
			],
			max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
			temperature: options.temperature ?? DEFAULT_TEMPERATURE,
		});
		return extractText(raw);
	}
}
