import type { AIClient, VisionDescribeOptions } from "@/external/ai/ai.client";

const VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";
const DEFAULT_MAX_TOKENS = 1024;
const DEFAULT_TEMPERATURE = 0.2;

interface VisionResponse {
	readonly response?: string;
	readonly description?: string;
}

function extractText(raw: unknown): string {
	if (typeof raw === "string") return raw;
	if (raw && typeof raw === "object") {
		const { response, description } = raw as VisionResponse;
		if (typeof response === "string") return response;
		if (typeof description === "string") return description;
	}
	throw new Error("Workers AI vision response did not contain text output");
}

export class CloudflareAIClient implements AIClient {
	constructor(private readonly binding: Ai) {}

	async visionDescribe(
		image: Uint8Array,
		prompt: string,
		options: VisionDescribeOptions = {},
	): Promise<string> {
		const raw = await this.binding.run(VISION_MODEL, {
			prompt,
			image: Array.from(image),
			max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
			temperature: options.temperature ?? DEFAULT_TEMPERATURE,
		});
		return extractText(raw);
	}
}
