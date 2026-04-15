import type { z } from "zod";

export interface VisionDescribeOptions {
	readonly maxTokens?: number;
	readonly temperature?: number;
}

export interface ExtractStructuredOptions {
	readonly maxTokens?: number;
	readonly temperature?: number;
	readonly schemaName?: string;
}

export interface AIClient {
	/**
	 * Run a vision-capable LLM over a PNG image with the given text prompt.
	 * Returns the model's raw text response.
	 */
	visionDescribe(
		image: Uint8Array,
		prompt: string,
		options?: VisionDescribeOptions,
	): Promise<string>;

	/**
	 * Extract structured data from free text. The model is instructed to emit
	 * JSON matching the given zod schema; the result is validated against it
	 * before being returned. Throws on validation failure.
	 */
	extractStructured<T>(
		prompt: string,
		input: string,
		schema: z.ZodType<T>,
		options?: ExtractStructuredOptions,
	): Promise<T>;
}
