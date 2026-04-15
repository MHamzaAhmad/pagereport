import { and, count, eq, lt, sql } from "drizzle-orm";
import { reportRateLimitAttempts } from "@/domain/schema";
import type { Database } from "@/repos/reports.repo";

export class ReportRateLimitRepo {
	constructor(private readonly db: Database) {}

	async countSince(ip: string, sinceUnixSec: number): Promise<number> {
		const rows = await this.db
			.select({ value: count() })
			.from(reportRateLimitAttempts)
			.where(
				and(
					eq(reportRateLimitAttempts.ip, ip),
					sql`${reportRateLimitAttempts.createdAt} >= ${sinceUnixSec}`,
				),
			);
		return rows[0]?.value ?? 0;
	}

	async record(ip: string, nowUnixSec: number): Promise<void> {
		await this.db.insert(reportRateLimitAttempts).values({ ip, createdAt: nowUnixSec });
	}

	async purgeOlderThan(cutoffUnixSec: number): Promise<void> {
		await this.db
			.delete(reportRateLimitAttempts)
			.where(lt(reportRateLimitAttempts.createdAt, cutoffUnixSec));
	}
}
