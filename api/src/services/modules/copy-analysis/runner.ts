import { COPY_ANALYSIS_SYSTEM_PROMPT } from "@/services/modules/copy-analysis/prompt";
import {
	type CopyAnalysisResult,
	copyAnalysisResultSchema,
} from "@/services/modules/copy-analysis/result.schema";
import type { ModuleRunContext, ModuleRunInput } from "@/services/modules/registry";
import {
	COPY_OUTLINE_PREREQ_TYPE,
	type CopyOutlineResult,
	copyOutlineResultSchema,
} from "@/services/prerequisites/copy-outline/result.schema";
import {
	PAGE_SCRAPE_PREREQ_TYPE,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";

const MAX_MARKDOWN_CHARS = 12_000;

export async function runCopyAnalysis(
	_input: ModuleRunInput,
	{ ai, prerequisites, step }: ModuleRunContext,
): Promise<CopyAnalysisResult> {
	const outline = prerequisites.get(COPY_OUTLINE_PREREQ_TYPE, copyOutlineResultSchema);
	const scrape = prerequisites.get(PAGE_SCRAPE_PREREQ_TYPE, pageScrapeResultSchema);

	const input = buildLlmInput(outline, scrape.markdown);

	return await step.do("ai-copy-analysis", () =>
		ai.extractStructured(COPY_ANALYSIS_SYSTEM_PROMPT, input, copyAnalysisResultSchema, {
			schemaName: "copy_analysis_result",
			temperature: 0.2,
		}),
	);
}

function buildLlmInput(outline: CopyOutlineResult, markdown: string): string {
	const truncatedMarkdown =
		markdown.length > MAX_MARKDOWN_CHARS
			? `${markdown.slice(0, MAX_MARKDOWN_CHARS)}\n\n[…truncated]`
			: markdown;

	const outlineJson = JSON.stringify(outline, null, 2);

	return `COPY OUTLINE (parsed structure):
${outlineJson}

PAGE MARKDOWN (full body text, may be truncated):
${truncatedMarkdown}`;
}
