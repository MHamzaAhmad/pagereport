import { CACHE_MIN_TTL_SECONDS } from "@/domain/cache-policy";
import type { CacheRepo } from "@/repos/cache.repo";

export class PrerequisiteCacheRepo {
	constructor(private readonly cache: CacheRepo) {}

	private key(prerequisiteType: string, normalizedUrl: string): string {
		return `prereq:${prerequisiteType}:${normalizedUrl}`;
	}

	async findFresh(prerequisiteType: string, normalizedUrl: string): Promise<unknown | null> {
		return this.cache.get<unknown>(this.key(prerequisiteType, normalizedUrl));
	}

	async put(
		prerequisiteType: string,
		normalizedUrl: string,
		result: unknown,
		ttlMs: number,
	): Promise<void> {
		if (ttlMs <= 0) return;
		const ttlSeconds = Math.max(CACHE_MIN_TTL_SECONDS, Math.floor(ttlMs / 1000));
		await this.cache.set(this.key(prerequisiteType, normalizedUrl), result, ttlSeconds);
	}
}
