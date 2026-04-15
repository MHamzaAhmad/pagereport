import { and, eq, gte, sql } from "drizzle-orm";
import type { PrerequisiteResultRow } from "@/domain/models";
import { prerequisiteResults } from "@/domain/schema";
import type { Database } from "@/repos/reports.repo";

export class PrerequisiteResultsRepo {
	constructor(private readonly db: Database) {}

	async findFresh(
		prerequisiteType: string,
		normalizedUrl: string,
		ttlMs: number,
	): Promise<PrerequisiteResultRow | null> {
		if (ttlMs <= 0) return null;
		const oldest = ttlMs === Number.POSITIVE_INFINITY ? new Date(0) : new Date(Date.now() - ttlMs);
		const rows = await this.db
			.select()
			.from(prerequisiteResults)
			.where(
				and(
					eq(prerequisiteResults.prerequisiteType, prerequisiteType),
					eq(prerequisiteResults.normalizedUrl, normalizedUrl),
					gte(prerequisiteResults.computedAt, oldest),
				),
			)
			.limit(1);
		return rows[0] ?? null;
	}

	async upsert(
		prerequisiteType: string,
		normalizedUrl: string,
		result: unknown,
	): Promise<PrerequisiteResultRow> {
		const now = new Date();
		const resultJson = JSON.stringify(result);
		const [row] = await this.db
			.insert(prerequisiteResults)
			.values({
				id: crypto.randomUUID(),
				prerequisiteType,
				normalizedUrl,
				resultJson,
				computedAt: now,
				createdAt: now,
				updatedAt: now,
			})
			.onConflictDoUpdate({
				target: [prerequisiteResults.prerequisiteType, prerequisiteResults.normalizedUrl],
				set: {
					resultJson: sql`excluded.result_json`,
					computedAt: sql`excluded.computed_at`,
					updatedAt: sql`excluded.updated_at`,
				},
			})
			.returning();
		if (!row) {
			throw new Error("Failed to upsert prerequisite result");
		}
		return row;
	}

	async findById(id: string): Promise<PrerequisiteResultRow | null> {
		const rows = await this.db
			.select()
			.from(prerequisiteResults)
			.where(eq(prerequisiteResults.id, id))
			.limit(1);
		return rows[0] ?? null;
	}
}
