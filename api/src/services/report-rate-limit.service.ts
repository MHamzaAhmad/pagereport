import type { ReportRateLimitRepo } from "@/repos";

const WINDOW_SECONDS = 3600;
const MAX_REQUESTS_PER_WINDOW = 3;
const PURGE_PROBABILITY = 0.01;

export interface ReportQuotaCheck {
	readonly allowed: boolean;
	readonly retryAfterSeconds: number;
}

export class ReportRateLimitService {
	constructor(private readonly repo: ReportRateLimitRepo) {}

	async checkQuota(ip: string, nowUnixSec: number): Promise<ReportQuotaCheck> {
		const since = nowUnixSec - WINDOW_SECONDS;
		const used = await this.repo.countSince(ip, since);
		if (used >= MAX_REQUESTS_PER_WINDOW) {
			return { allowed: false, retryAfterSeconds: WINDOW_SECONDS };
		}
		return { allowed: true, retryAfterSeconds: 0 };
	}

	async recordAttempt(ip: string, nowUnixSec: number): Promise<void> {
		await this.repo.record(ip, nowUnixSec);
		if (Math.random() < PURGE_PROBABILITY) {
			await this.repo.purgeOlderThan(nowUnixSec - WINDOW_SECONDS);
		}
	}
}
