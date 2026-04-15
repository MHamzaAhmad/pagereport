import { z } from "zod";
import type {
	AIClient,
	ExtractStructuredOptions,
	VisionDescribeOptions,
} from "@/external/ai/ai.client";

const VISION_MODEL = "@cf/google/gemma-4-26b-a4b-it";
const TEXT_MODEL = "@cf/zai-org/glm-4.7-flash";
const DEFAULT_MAX_TOKENS = 1024;
const DEFAULT_TEMPERATURE = 0.2;
const EXTRACT_MAX_TOKENS = 2096;
const EXTRACT_TEMPERATURE = 0;
const DEFAULT_SCHEMA_NAME = "result";

interface OpenAiChatChoice {
	readonly message?: { readonly content?: unknown };
}

interface OpenAiChatResponse {
	readonly choices?: readonly OpenAiChatChoice[];
	readonly response?: unknown;
}

function extractText(raw: unknown): string {
	if (raw && typeof raw === "object") {
		const { response, choices } = raw as OpenAiChatResponse;
		if (typeof response === "string" && response.length > 0) return response;
		if (response && typeof response === "object") return JSON.stringify(response);
		if (Array.isArray(choices) && choices.length > 0) {
			const content = choices[0]?.message?.content;
			if (typeof content === "string" && content.length > 0) return content;
		}
	}
	throw new Error(`Workers AI response did not contain text output: ${JSON.stringify(raw)}`);
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

	async extractStructured<T>(
		prompt: string,
		input: string,
		schema: z.ZodType<T>,
		options: ExtractStructuredOptions = {},
	): Promise<T> {
		const jsonSchema = z.toJSONSchema(schema, { target: "draft-7" });
		const raw = await this.binding.run(TEXT_MODEL, {
			messages: [
				{ role: "system", content: prompt },
				{ role: "user", content: input },
			],
			max_tokens: options.maxTokens ?? EXTRACT_MAX_TOKENS,
			temperature: options.temperature ?? EXTRACT_TEMPERATURE,
			response_format: {
				type: "json_schema",
				json_schema: {
					name: options.schemaName ?? DEFAULT_SCHEMA_NAME,
					schema: jsonSchema,
					strict: true,
				},
      },
      chat_template_kwargs: {
        enable_thinking: false
      }
		});
		const text = extractText(raw);
		const parsed: unknown = JSON.parse(text);
		return schema.parse(parsed);
	}
}
