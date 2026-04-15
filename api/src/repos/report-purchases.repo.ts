import { and, desc, eq } from "drizzle-orm";
import type { NewReportPurchase, ReportPurchase } from "@/domain/models";
import { reportPurchases } from "@/domain/schema";
import type { Database } from "@/repos/reports.repo";

export class ReportPurchasesRepo {
	constructor(private readonly db: Database) {}

	async insert(input: NewReportPurchase): Promise<ReportPurchase> {
		const [row] = await this.db.insert(reportPurchases).values(input).returning();
		if (!row) {
			throw new Error("Failed to insert report purchase");
		}
		return row;
	}

	async findByCheckoutId(providerCheckoutId: string): Promise<ReportPurchase | null> {
		const rows = await this.db
			.select()
			.from(reportPurchases)
			.where(eq(reportPurchases.providerCheckoutId, providerCheckoutId))
			.limit(1);
		return rows[0] ?? null;
	}

	async findLatestPendingByReport(reportId: string): Promise<ReportPurchase | null> {
		const rows = await this.db
			.select()
			.from(reportPurchases)
			.where(and(eq(reportPurchases.reportId, reportId), eq(reportPurchases.status, "pending")))
			.orderBy(desc(reportPurchases.createdAt))
			.limit(1);
		return rows[0] ?? null;
	}

	async markCompleted(id: string, providerEventId: string, amountCents: number): Promise<void> {
		await this.db
			.update(reportPurchases)
			.set({
				status: "completed",
				providerEventId,
				amountCents,
				completedAt: new Date(),
			})
			.where(eq(reportPurchases.id, id));
	}

	async markStatus(
		id: string,
		status: "failed" | "expired",
		providerEventId: string | null,
	): Promise<void> {
		await this.db
			.update(reportPurchases)
			.set({
				status,
				providerEventId,
				completedAt: new Date(),
			})
			.where(eq(reportPurchases.id, id));
	}
}
