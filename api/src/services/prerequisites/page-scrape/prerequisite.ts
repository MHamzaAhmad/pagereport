import {
	PAGE_SCRAPE_PREREQ_TYPE,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";
import { runPageScrape } from "@/services/prerequisites/page-scrape/runner";
import { registerPrerequisite } from "@/services/prerequisites/registry";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

registerPrerequisite({
	type: PAGE_SCRAPE_PREREQ_TYPE,
	cacheTtlMs: SEVEN_DAYS_MS,
	resultSchema: pageScrapeResultSchema,
	run: runPageScrape,
});
