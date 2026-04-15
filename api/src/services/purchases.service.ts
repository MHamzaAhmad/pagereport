import type { CreateCheckoutResponse } from "@/domain/api";
import { normalizeUrl } from "@/domain/url";
import type { PaymentClient } from "@/external";
import type { ModuleCacheRepo, ModuleRunsRepo, ReportPurchasesRepo, ReportsRepo } from "@/repos";
import type { ReportOrchestratorService } from "@/services/report-orchestrator.service";

export class NothingToUnlockError extends Error {
	constructor(reportId: string) {
		super(`Report ${reportId} has no modules awaiting payment`);
		this.name = "NothingToUnlockError";
	}
}

export class ReportNotFoundError extends Error {
	constructor(reportId: string) {
		super(`Report not found: ${reportId}`);
		this.name = "ReportNotFoundError";
	}
}

export interface PurchasesServiceOptions {
	readonly checkoutSuccessUrl: string;
	readonly provider: string;
}

export class PurchasesService {
	constructor(
		private readonly reports: ReportsRepo,
		private readonly moduleRuns: ModuleRunsRepo,
		private readonly moduleCache: ModuleCacheRepo,
		private readonly reportPurchases: ReportPurchasesRepo,
		private readonly orchestrator: ReportOrchestratorService,
		private readonly paymentClient: PaymentClient,
		private readonly options: PurchasesServiceOptions,
	) {}

	async createCheckout(reportId: string): Promise<CreateCheckoutResponse> {
		const report = await this.reports.findById(reportId);
		if (!report) {
			throw new ReportNotFoundError(reportId);
		}

		const locked = await this.moduleRuns.listAwaitingPaymentByReport(reportId);
		if (locked.length === 0) {
			throw new NothingToUnlockError(reportId);
		}

		const successUrl = this.options.checkoutSuccessUrl.replace(
			"{reportId}",
			encodeURIComponent(reportId),
		);
		const checkout = await this.paymentClient.createCheckout({
			reportId,
			successUrl,
		});

		await this.reportPurchases.insert({
			id: crypto.randomUUID(),
			reportId,
			provider: this.options.provider,
			providerCheckoutId: checkout.checkoutId,
			status: "pending",
			amountCents: checkout.amountCents,
			currency: checkout.currency,
			createdAt: new Date(),
		});

		return { url: checkout.url };
	}

	async handleWebhook(rawBody: string, headers: Record<string, string>): Promise<void> {
		const event = this.paymentClient.verifyWebhook(rawBody, headers);
		if (event.type === "ignored" || !event.checkoutId) {
			return;
		}

		const purchase = await this.reportPurchases.findByCheckoutId(event.checkoutId);
		if (!purchase) {
			console.warn(`[purchases] webhook for unknown checkout: ${event.checkoutId} (${event.type})`);
			return;
		}

		if (purchase.status === "completed" && purchase.providerEventId === event.id) {
			return;
		}
		if (purchase.status === "completed") {
			return;
		}

		if (event.type === "checkout.failed" || event.type === "checkout.expired") {
			await this.reportPurchases.markStatus(
				purchase.id,
				event.type === "checkout.failed" ? "failed" : "expired",
				event.id,
			);
			return;
		}

		if (event.type !== "checkout.completed") {
			return;
		}

		await this.reportPurchases.markCompleted(
			purchase.id,
			event.id,
			event.amountCents ?? purchase.amountCents,
		);

		const report = await this.reports.findById(purchase.reportId);
		if (!report) {
			throw new ReportNotFoundError(purchase.reportId);
		}

		const normalizedUrl = normalizeUrl(report.url);
		const locked = await this.moduleRuns.listAwaitingPaymentByReport(report.id);

		for (const run of locked) {
			const cached = await this.moduleCache.findFresh(run.moduleType, normalizedUrl);
			if (cached !== null) {
				await this.moduleRuns.markCompleted(run.id, cached, "cache");
				continue;
			}
			await this.moduleRuns.flipAwaitingPaymentToPending(run.id);
		}

		await this.orchestrator.dispatchReady(report.id, report.url);
	}
}
