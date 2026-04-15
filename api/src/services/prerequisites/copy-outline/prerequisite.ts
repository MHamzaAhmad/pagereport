import {
	COPY_OUTLINE_PREREQ_TYPE,
	copyOutlineResultSchema,
} from "@/services/prerequisites/copy-outline/result.schema";
import { runCopyOutline } from "@/services/prerequisites/copy-outline/runner";
import { PAGE_SCRAPE_PREREQ_TYPE } from "@/services/prerequisites/page-scrape/result.schema";
import { registerPrerequisite } from "@/services/prerequisites/registry";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

registerPrerequisite({
	type: COPY_OUTLINE_PREREQ_TYPE,
	dependsOn: [PAGE_SCRAPE_PREREQ_TYPE],
	cacheTtlMs: SEVEN_DAYS_MS,
	resultSchema: copyOutlineResultSchema,
	run: runCopyOutline,
});
