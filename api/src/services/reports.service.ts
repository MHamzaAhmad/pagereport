import type { CreateReportInput, ReportResponse, ReportWithModulesResponse } from "@/domain/api";
import type { Report } from "@/domain/models";
import type { ReportsRepo } from "@/repos";
import type { ModulesService } from "@/services/modules.service";

export class ReportsService {
	constructor(
		private readonly repo: ReportsRepo,
		private readonly modulesService: ModulesService,
	) {}

	async create(input: CreateReportInput): Promise<ReportWithModulesResponse> {
		const report = await this.repo.insert({
			id: crypto.randomUUID(),
			url: input.url,
			createdAt: new Date(),
		});
		const runs = await this.modulesService.startAllForReport(report.id, report.url);
		return {
			...this.toResponse(report),
			moduleRuns: runs.map((run) => this.modulesService.toResponse(run)),
		};
	}

	async getById(id: string): Promise<ReportWithModulesResponse | null> {
		const report = await this.repo.findById(id);
		if (!report) return null;
		const runs = await this.modulesService.listByReport(id);
		return {
			...this.toResponse(report),
			moduleRuns: runs.map((run) => this.modulesService.toResponse(run)),
		};
	}

	private toResponse(report: Report): ReportResponse {
		return {
			id: report.id,
			url: report.url,
			createdAt: report.createdAt.toISOString(),
		};
	}
}
