import type { FirecrawlClient, FirecrawlScrapeResult } from "@/external/firecrawl/firecrawl.client";

const FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v1/scrape";

export interface FirecrawlHttpClientOptions {
	readonly apiKey: string;
	readonly endpoint?: string;
}

interface FirecrawlV1Metadata {
	title?: string;
	sourceURL?: string;
}

interface FirecrawlV1Data {
	markdown?: string;
	html?: string;
	metadata?: FirecrawlV1Metadata;
}

interface FirecrawlV1Response {
	success?: boolean;
	data?: FirecrawlV1Data;
	error?: string;
}

export class FirecrawlHttpClient implements FirecrawlClient {
	private readonly apiKey: string;
	private readonly endpoint: string;

	constructor(options: FirecrawlHttpClientOptions) {
		if (!options.apiKey) {
			throw new Error("FirecrawlHttpClient requires an apiKey");
		}
		this.apiKey = options.apiKey;
		this.endpoint = options.endpoint ?? FIRECRAWL_ENDPOINT;
	}

	async scrape(url: string): Promise<FirecrawlScrapeResult> {
		const response = await fetch(this.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({
				url,
				formats: ["markdown", "html"],
				onlyMainContent: true,
			}),
		});

		if (!response.ok) {
			const text = await response.text().catch(() => "");
			throw new Error(
				`Firecrawl request failed (${response.status}): ${text || response.statusText}`,
			);
		}

		const body = (await response.json()) as FirecrawlV1Response;
		if (body.success === false || body.error) {
			throw new Error(`Firecrawl error: ${body.error ?? "unknown"}`);
		}
		const data = body.data;
		if (!data || typeof data.markdown !== "string" || data.markdown.length === 0) {
			throw new Error("Firecrawl response did not contain markdown content");
		}

		return {
			markdown: data.markdown,
			title: data.metadata?.title ?? null,
			html: typeof data.html === "string" ? data.html : null,
			sourceUrl: data.metadata?.sourceURL ?? url,
		};
	}
}
