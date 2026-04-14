import type { CreateReportInput, ReportResponse } from "@/domain/api";
import type { Report } from "@/domain/models";
import type { ReportsRepo } from "@/repos";

export class ReportsService {
	constructor(private readonly repo: ReportsRepo) {}

	async create(input: CreateReportInput): Promise<ReportResponse> {
		const report = await this.repo.insert({
			id: crypto.randomUUID(),
			url: input.url,
			createdAt: new Date(),
		});
		return this.toResponse(report);
	}

	async get(id: string): Promise<ReportResponse | null> {
		const report = await this.repo.findById(id);
		return report ? this.toResponse(report) : null;
	}

	private toResponse(report: Report): ReportResponse {
		return {
			id: report.id,
			url: report.url,
			createdAt: report.createdAt.toISOString(),
		};
	}
}
