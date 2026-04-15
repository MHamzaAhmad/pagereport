import type {
	LighthouseAuditInput,
	LighthouseAuditReport,
	LighthouseCategory,
	LighthouseClient,
	LighthouseCoreWebVitals,
	LighthouseOpportunity,
} from "@/external/lighthouse/lighthouse.client";

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const MAX_OPPORTUNITIES = 5;
const LOAD_OPPORTUNITY_GROUP = "load-opportunities";

const CWV_AUDIT_IDS = {
	lcp: "largest-contentful-paint",
	cls: "cumulative-layout-shift",
	inp: "interaction-to-next-paint",
	fcp: "first-contentful-paint",
	tbt: "total-blocking-time",
	speedIndex: "speed-index",
} as const;

export interface PsiLighthouseClientOptions {
	readonly apiKey?: string;
}

interface PsiAuditRef {
	id: string;
	group?: string;
	weight?: number;
}

interface PsiAudit {
	id?: string;
	title?: string;
	description?: string;
	numericValue?: number;
	displayValue?: string;
}

interface PsiCategory {
	score?: number | null;
	auditRefs?: PsiAuditRef[];
}

interface PsiLighthouseResult {
	finalUrl?: string;
	requestedUrl?: string;
	categories?: Partial<Record<LighthouseCategory, PsiCategory>>;
	audits?: Record<string, PsiAudit>;
}

interface PsiResponse {
	lighthouseResult?: PsiLighthouseResult;
	error?: { message?: string; code?: number };
}

export class PsiLighthouseClient implements LighthouseClient {
	private readonly apiKey: string | undefined;

	constructor(options: PsiLighthouseClientOptions = {}) {
		this.apiKey = options.apiKey;
	}

	async runAudit(input: LighthouseAuditInput): Promise<LighthouseAuditReport> {
		const url = this.buildUrl(input);

		const response = await fetch(url, {
			method: "GET",
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			const text = await response.text().catch(() => "");
			throw new Error(
				`PageSpeed Insights request failed (${response.status}): ${text || response.statusText}`,
			);
		}

		const body = (await response.json()) as PsiResponse;
		if (body.error?.message) {
			throw new Error(`PageSpeed Insights error: ${body.error.message}`);
		}

		const lhr = body.lighthouseResult;
		if (!lhr) {
			throw new Error("PageSpeed Insights response did not contain lighthouseResult");
		}

		return {
			scores: this.extractScores(lhr, input.categories),
			coreWebVitals: this.extractCoreWebVitals(lhr),
			opportunities: this.extractOpportunities(lhr),
			finalUrl: lhr.finalUrl ?? lhr.requestedUrl ?? input.url,
		};
	}

	private buildUrl(input: LighthouseAuditInput): string {
		const params = new URLSearchParams();
		params.set("url", input.url);
		params.set("strategy", input.formFactor);
		for (const category of input.categories) {
			params.append("category", category);
		}
		if (this.apiKey) {
			params.set("key", this.apiKey);
		}
		return `${PSI_ENDPOINT}?${params.toString()}`;
	}

	private extractScores(
		lhr: PsiLighthouseResult,
		requested: readonly LighthouseCategory[],
	): Record<LighthouseCategory, number> {
		const scores = { performance: 0, seo: 0, accessibility: 0 };
		for (const category of requested) {
			const raw = lhr.categories?.[category]?.score;
			if (typeof raw !== "number") {
				throw new Error(`PageSpeed Insights response missing score for "${category}"`);
			}
			scores[category] = Math.round(raw * 100);
		}
		return scores;
	}

	private extractCoreWebVitals(lhr: PsiLighthouseResult): LighthouseCoreWebVitals {
		const audits = lhr.audits ?? {};
		return {
			lcpMs: readNumeric(audits[CWV_AUDIT_IDS.lcp]),
			cls: readNumeric(audits[CWV_AUDIT_IDS.cls]),
			inpMs: readNumeric(audits[CWV_AUDIT_IDS.inp]),
			fcpMs: readNumeric(audits[CWV_AUDIT_IDS.fcp]),
			tbtMs: readNumeric(audits[CWV_AUDIT_IDS.tbt]),
			speedIndexMs: readNumeric(audits[CWV_AUDIT_IDS.speedIndex]),
		};
	}

	private extractOpportunities(lhr: PsiLighthouseResult): LighthouseOpportunity[] {
		const perfCategory = lhr.categories?.performance;
		const audits = lhr.audits ?? {};
		if (!perfCategory?.auditRefs) return [];

		const opportunities: LighthouseOpportunity[] = [];
		for (const ref of perfCategory.auditRefs) {
			if (ref.group !== LOAD_OPPORTUNITY_GROUP) continue;
			const audit = audits[ref.id];
			if (!audit) continue;
			const savings = typeof audit.numericValue === "number" ? audit.numericValue : null;
			if (savings === null || savings <= 0) continue;
			opportunities.push({
				id: ref.id,
				title: audit.title ?? ref.id,
				description: audit.description ?? "",
				estimatedSavingsMs: savings,
				displayValue: audit.displayValue ?? null,
			});
		}

		opportunities.sort((a, b) => (b.estimatedSavingsMs ?? 0) - (a.estimatedSavingsMs ?? 0));
		return opportunities.slice(0, MAX_OPPORTUNITIES);
	}
}

function readNumeric(audit: PsiAudit | undefined): number | null {
	if (!audit) return null;
	return typeof audit.numericValue === "number" ? audit.numericValue : null;
}
