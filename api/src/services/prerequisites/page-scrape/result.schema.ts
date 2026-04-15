import { z } from "zod";

export const PAGE_SCRAPE_PREREQ_TYPE = "page_scrape" as const;

export const pageScrapeResultSchema = z.object({
	markdown: z.string().min(1),
	title: z.string().nullable(),
	html: z.string().nullable(),
	sourceUrl: z.string().url(),
});
export type PageScrapeResult = z.infer<typeof pageScrapeResultSchema>;
