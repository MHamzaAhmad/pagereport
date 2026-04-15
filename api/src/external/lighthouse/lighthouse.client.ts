export type LighthouseFormFactor = "mobile" | "desktop";

export type LighthouseCategory = "performance" | "seo" | "accessibility";

export interface LighthouseAuditInput {
	readonly url: string;
	readonly formFactor: LighthouseFormFactor;
	readonly categories: readonly LighthouseCategory[];
}

export interface LighthouseCoreWebVitals {
	readonly lcpMs: number | null;
	readonly cls: number | null;
	readonly inpMs: number | null;
	readonly fcpMs: number | null;
	readonly tbtMs: number | null;
	readonly speedIndexMs: number | null;
}

export interface LighthouseOpportunity {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly estimatedSavingsMs: number | null;
	readonly displayValue: string | null;
}

export interface LighthouseAuditReport {
	readonly scores: Readonly<Record<LighthouseCategory, number>>;
	readonly coreWebVitals: LighthouseCoreWebVitals;
	readonly opportunities: readonly LighthouseOpportunity[];
	readonly finalUrl: string;
}

export interface LighthouseClient {
	runAudit(input: LighthouseAuditInput): Promise<LighthouseAuditReport>;
}
