export type TrustMrrSortOrder =
	| "revenue-desc"
	| "revenue-asc"
	| "growth-desc"
	| "growth-asc"
	| "multiple-asc"
	| "multiple-desc"
	| "price-desc"
	| "price-asc"
	| "listed-desc"
	| "listed-asc"
	| "best-deal";

export interface TrustMrrListInput {
	readonly category: string;
	readonly sort?: TrustMrrSortOrder;
	readonly limit?: number;
	readonly page?: number;
}

export interface TrustMrrStartup {
	readonly name: string;
	readonly slug: string;
	readonly website: string | null;
	readonly icon: string | null;
	readonly description: string | null;
	readonly category: string | null;
	readonly revenueLast30DaysCents: number;
	readonly mrrCents: number | null;
	readonly customers: number | null;
	readonly growth30d: number | null;
}

export interface TrustMrrListResult {
	readonly startups: readonly TrustMrrStartup[];
}

export interface TrustMrrClient {
	listStartups(input: TrustMrrListInput): Promise<TrustMrrListResult>;
}
