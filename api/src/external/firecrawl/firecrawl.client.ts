export interface FirecrawlScrapeResult {
	readonly markdown: string;
	readonly title: string | null;
	/** Cleaned main-content HTML (body-only, with `onlyMainContent: true` applied). */
	readonly html: string | null;
	/** Unmodified full-document HTML including `<head>` — required for meta-tag inspection. */
	readonly rawHtml: string | null;
	readonly sourceUrl: string;
}

export interface FirecrawlClient {
	scrape(url: string): Promise<FirecrawlScrapeResult>;
}
