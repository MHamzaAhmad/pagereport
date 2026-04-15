import { CACHE_MIN_TTL_SECONDS } from "@/domain/cache-policy";
import type { CacheRepo } from "@/repos/cache.repo";

export class ModuleCacheRepo {
	constructor(private readonly cache: CacheRepo) {}

	private key(moduleType: string, normalizedUrl: string): string {
		return `module:${moduleType}:${normalizedUrl}`;
	}

	async findFresh(moduleType: string, normalizedUrl: string): Promise<unknown | null> {
		return this.cache.get<unknown>(this.key(moduleType, normalizedUrl));
	}

	async put(
		moduleType: string,
		normalizedUrl: string,
		result: unknown,
		ttlMs: number,
	): Promise<void> {
		if (ttlMs <= 0) return;
		const ttlSeconds = Math.max(CACHE_MIN_TTL_SECONDS, Math.floor(ttlMs / 1000));
		await this.cache.set(this.key(moduleType, normalizedUrl), result, ttlSeconds);
	}
}
