export interface FirecrawlScrapeResult {
	readonly markdown: string;
	readonly title: string | null;
	readonly html: string | null;
	readonly sourceUrl: string;
}

export interface FirecrawlClient {
	scrape(url: string): Promise<FirecrawlScrapeResult>;
}
