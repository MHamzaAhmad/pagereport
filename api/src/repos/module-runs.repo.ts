import { and, asc, eq } from "drizzle-orm";
import type { ModuleRun, NewModuleRun } from "@/domain/models";
import { moduleRuns } from "@/domain/schema";
import type { ModuleRunUnlockedVia } from "@/domain/schema/module-runs";
import type { Database } from "@/repos/reports.repo";

export class ModuleRunsRepo {
	constructor(private readonly db: Database) {}

	async insert(input: NewModuleRun): Promise<ModuleRun> {
		const [row] = await this.db.insert(moduleRuns).values(input).returning();
		if (!row) {
			throw new Error("Failed to insert module run");
		}
		return row;
	}

	async findById(id: string): Promise<ModuleRun | null> {
		const rows = await this.db.select().from(moduleRuns).where(eq(moduleRuns.id, id)).limit(1);
		return rows[0] ?? null;
	}

	async findByReportAndType(reportId: string, moduleType: string): Promise<ModuleRun | null> {
		const rows = await this.db
			.select()
			.from(moduleRuns)
			.where(and(eq(moduleRuns.reportId, reportId), eq(moduleRuns.moduleType, moduleType)))
			.limit(1);
		return rows[0] ?? null;
	}

	async listByReport(reportId: string): Promise<ModuleRun[]> {
		return this.db
			.select()
			.from(moduleRuns)
			.where(eq(moduleRuns.reportId, reportId))
			.orderBy(asc(moduleRuns.createdAt));
	}

	async listAwaitingPaymentByReport(reportId: string): Promise<ModuleRun[]> {
		return this.db
			.select()
			.from(moduleRuns)
			.where(and(eq(moduleRuns.reportId, reportId), eq(moduleRuns.status, "awaiting_payment")))
			.orderBy(asc(moduleRuns.createdAt));
	}

	async setWorkflowInstanceId(id: string, workflowInstanceId: string): Promise<void> {
		await this.db
			.update(moduleRuns)
			.set({ workflowInstanceId, updatedAt: new Date() })
			.where(eq(moduleRuns.id, id));
	}

	async markRunning(id: string): Promise<void> {
		const now = new Date();
		await this.db
			.update(moduleRuns)
			.set({ status: "running", startedAt: now, updatedAt: now })
			.where(eq(moduleRuns.id, id));
	}

	async markCompleted(
		id: string,
		result: unknown,
		unlockedVia: ModuleRunUnlockedVia,
	): Promise<void> {
		const now = new Date();
		await this.db
			.update(moduleRuns)
			.set({
				status: "completed",
				unlockedVia,
				resultJson: JSON.stringify(result),
				error: null,
				completedAt: now,
				updatedAt: now,
			})
			.where(eq(moduleRuns.id, id));
	}

	async markFailed(id: string, error: string): Promise<void> {
		const now = new Date();
		await this.db
			.update(moduleRuns)
			.set({ status: "failed", error, completedAt: now, updatedAt: now })
			.where(eq(moduleRuns.id, id));
	}

	async flipAwaitingPaymentToPending(id: string): Promise<void> {
		const now = new Date();
		await this.db
			.update(moduleRuns)
			.set({ status: "pending", unlockedVia: "purchase", updatedAt: now })
			.where(and(eq(moduleRuns.id, id), eq(moduleRuns.status, "awaiting_payment")));
	}
}
