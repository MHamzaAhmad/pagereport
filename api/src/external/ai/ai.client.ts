export interface VisionDescribeOptions {
	readonly maxTokens?: number;
	readonly temperature?: number;
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
}
