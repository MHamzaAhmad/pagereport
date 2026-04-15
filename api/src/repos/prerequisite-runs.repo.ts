import { and, asc, eq } from "drizzle-orm";
import type { NewPrerequisiteRun, PrerequisiteRun } from "@/domain/models";
import { prerequisiteResults, prerequisiteRuns } from "@/domain/schema";
import type { Database } from "@/repos/reports.repo";

export interface PrerequisiteRunWithResult extends PrerequisiteRun {
	readonly result: unknown | null;
}

export class PrerequisiteRunsRepo {
	constructor(private readonly db: Database) {}

	async insert(input: NewPrerequisiteRun): Promise<PrerequisiteRun> {
		const [row] = await this.db.insert(prerequisiteRuns).values(input).returning();
		if (!row) {
			throw new Error("Failed to insert prerequisite run");
		}
		return row;
	}

	async findById(id: string): Promise<PrerequisiteRun | null> {
		const rows = await this.db
			.select()
			.from(prerequisiteRuns)
			.where(eq(prerequisiteRuns.id, id))
			.limit(1);
		return rows[0] ?? null;
	}

	async findByReportAndType(
		reportId: string,
		prerequisiteType: string,
	): Promise<PrerequisiteRun | null> {
		const rows = await this.db
			.select()
			.from(prerequisiteRuns)
			.where(
				and(
					eq(prerequisiteRuns.reportId, reportId),
					eq(prerequisiteRuns.prerequisiteType, prerequisiteType),
				),
			)
			.limit(1);
		return rows[0] ?? null;
	}

	async listByReport(reportId: string): Promise<PrerequisiteRun[]> {
		return this.db
			.select()
			.from(prerequisiteRuns)
			.where(eq(prerequisiteRuns.reportId, reportId))
			.orderBy(asc(prerequisiteRuns.createdAt));
	}

	async listByReportWithResults(reportId: string): Promise<PrerequisiteRunWithResult[]> {
		const rows = await this.db
			.select({
				run: prerequisiteRuns,
				resultJson: prerequisiteResults.resultJson,
			})
			.from(prerequisiteRuns)
			.leftJoin(
				prerequisiteResults,
				eq(prerequisiteRuns.prerequisiteResultId, prerequisiteResults.id),
			)
			.where(eq(prerequisiteRuns.reportId, reportId))
			.orderBy(asc(prerequisiteRuns.createdAt));
		return rows.map(({ run, resultJson }) => ({
			...run,
			result: resultJson ? (JSON.parse(resultJson) as unknown) : null,
		}));
	}

	async setWorkflowInstanceId(id: string, workflowInstanceId: string): Promise<void> {
		await this.db
			.update(prerequisiteRuns)
			.set({ workflowInstanceId, updatedAt: new Date() })
			.where(eq(prerequisiteRuns.id, id));
	}

	async markRunning(id: string): Promise<void> {
		const now = new Date();
		await this.db
			.update(prerequisiteRuns)
			.set({ status: "running", startedAt: now, updatedAt: now })
			.where(eq(prerequisiteRuns.id, id));
	}

	async markCompletedWithResultId(id: string, prerequisiteResultId: string): Promise<void> {
		const now = new Date();
		await this.db
			.update(prerequisiteRuns)
			.set({
				status: "completed",
				prerequisiteResultId,
				error: null,
				completedAt: now,
				updatedAt: now,
			})
			.where(eq(prerequisiteRuns.id, id));
	}

	async markFailed(id: string, error: string): Promise<void> {
		const now = new Date();
		await this.db
			.update(prerequisiteRuns)
			.set({ status: "failed", error, completedAt: now, updatedAt: now })
			.where(eq(prerequisiteRuns.id, id));
	}
}
