import type { CreateReportInput, ReportResponse, ReportWithModulesResponse } from "@/domain/api";
import type { Report } from "@/domain/models";
import type { ReportsRepo } from "@/repos";
import type { ModulesService } from "@/services/modules.service";
import type { PrerequisitesService } from "@/services/prerequisites.service";
import type { ReportOrchestratorService } from "@/services/report-orchestrator.service";

export class ReportsService {
	constructor(
		private readonly repo: ReportsRepo,
		private readonly modulesService: ModulesService,
		private readonly prerequisitesService: PrerequisitesService,
		private readonly orchestrator: ReportOrchestratorService,
	) {}

	async create(input: CreateReportInput): Promise<ReportWithModulesResponse> {
		const report = await this.repo.insert({
			id: crypto.randomUUID(),
			url: input.url,
			createdAt: new Date(),
		});
		await this.orchestrator.kickoffReport(report.id, report.url);
		return this.buildResponse(report);
	}

	async getById(id: string): Promise<ReportWithModulesResponse | null> {
		const report = await this.repo.findById(id);
		if (!report) return null;
		return this.buildResponse(report);
	}

	private async buildResponse(report: Report): Promise<ReportWithModulesResponse> {
		const [moduleRuns, prerequisiteRuns] = await Promise.all([
			this.modulesService.listByReport(report.id),
			this.prerequisitesService.listByReport(report.id),
		]);
		return {
			...this.toResponse(report),
			moduleRuns: moduleRuns.map((run) => this.modulesService.toResponse(run)),
			prerequisites: prerequisiteRuns.map((run) => this.prerequisitesService.toResponse(run)),
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
