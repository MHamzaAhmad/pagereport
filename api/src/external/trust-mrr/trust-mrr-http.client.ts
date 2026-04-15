import type {
	TrustMrrClient,
	TrustMrrListInput,
	TrustMrrListResult,
	TrustMrrStartup,
} from "@/external/trust-mrr/trust-mrr.client";

const TRUST_MRR_ENDPOINT = "https://trustmrr.com/api/v1";

export interface TrustMrrHttpClientOptions {
	readonly apiKey: string;
	readonly baseUrl?: string;
}

interface TrustMrrRevenuePayload {
	last30Days?: number;
	mrr?: number | null;
}

interface TrustMrrStartupPayload {
	name?: string;
	slug?: string;
	website?: string | null;
	icon?: string | null;
	description?: string | null;
	category?: string | null;
	revenue?: TrustMrrRevenuePayload;
	customers?: number | null;
	growth30d?: number | null;
}

interface TrustMrrListPayload {
	data?: TrustMrrStartupPayload[];
}

export class TrustMrrHttpClient implements TrustMrrClient {
	private readonly apiKey: string;
	private readonly baseUrl: string;

	constructor(options: TrustMrrHttpClientOptions) {
		if (!options.apiKey) {
			throw new Error("TrustMrrHttpClient requires an apiKey");
		}
		this.apiKey = options.apiKey;
		this.baseUrl = options.baseUrl ?? TRUST_MRR_ENDPOINT;
	}

	async listStartups(input: TrustMrrListInput): Promise<TrustMrrListResult> {
		const params = new URLSearchParams();
		params.set("category", input.category);
		params.set("sort", input.sort ?? "revenue-desc");
		params.set("limit", String(input.limit ?? 10));
		params.set("page", String(input.page ?? 1));

		const response = await fetch(`${this.baseUrl}/startups?${params.toString()}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${this.apiKey}`,
			},
		});

		if (!response.ok) {
			const text = await response.text().catch(() => "");
			throw new Error(
				`Upstream startup-revenue request failed (${response.status}): ${
					text || response.statusText
				}`,
			);
		}

		const body = (await response.json()) as TrustMrrListPayload;
		const rows = Array.isArray(body.data) ? body.data : [];

		const startups: TrustMrrStartup[] = [];
		for (const row of rows) {
			const mapped = mapStartup(row);
			if (mapped) startups.push(mapped);
		}
		return { startups };
	}
}

function mapStartup(row: TrustMrrStartupPayload): TrustMrrStartup | null {
	if (!row.name || !row.slug) return null;
	const revenueLast30Days = row.revenue?.last30Days;
	if (typeof revenueLast30Days !== "number") return null;
	return {
		name: row.name,
		slug: row.slug,
		website: typeof row.website === "string" && row.website.length > 0 ? row.website : null,
		icon: typeof row.icon === "string" && row.icon.length > 0 ? row.icon : null,
		description:
			typeof row.description === "string" && row.description.length > 0 ? row.description : null,
		category: typeof row.category === "string" && row.category.length > 0 ? row.category : null,
		revenueLast30DaysCents: revenueLast30Days,
		mrrCents: typeof row.revenue?.mrr === "number" ? row.revenue.mrr : null,
		customers: typeof row.customers === "number" ? row.customers : null,
		growth30d: typeof row.growth30d === "number" ? row.growth30d : null,
	};
}
