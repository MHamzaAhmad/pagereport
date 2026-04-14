import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { NewReport, Report } from "@/domain/models";
import { reports } from "@/domain/schema";

export type Database = DrizzleD1Database<Record<string, never>>;

export class ReportsRepo {
	constructor(private readonly db: Database) {}

	async findById(id: string): Promise<Report | null> {
		const rows = await this.db.select().from(reports).where(eq(reports.id, id)).limit(1);
		return rows[0] ?? null;
	}

	async insert(input: NewReport): Promise<Report> {
		const [row] = await this.db.insert(reports).values(input).returning();
		if (!row) {
			throw new Error("Failed to insert report");
		}
		return row;
	}
}
