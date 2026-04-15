import {
	PAGE_INTELLIGENCE_PREREQ_TYPE,
	pageIntelligenceResultSchema,
} from "@/services/prerequisites/page-intelligence/result.schema";
import { runPageIntelligence } from "@/services/prerequisites/page-intelligence/runner";
import { PAGE_SCRAPE_PREREQ_TYPE } from "@/services/prerequisites/page-scrape/result.schema";
import { registerPrerequisite } from "@/services/prerequisites/registry";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

registerPrerequisite({
	type: PAGE_INTELLIGENCE_PREREQ_TYPE,
	dependsOn: [PAGE_SCRAPE_PREREQ_TYPE],
	cacheTtlMs: SEVEN_DAYS_MS,
	resultSchema: pageIntelligenceResultSchema,
	run: runPageIntelligence,
});
