export class CacheRepo {
	constructor(private readonly kv: KVNamespace) {}

	async get<T>(key: string): Promise<T | null> {
		return this.kv.get<T>(key, "json");
	}

	async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
		await this.kv.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds });
	}

	async delete(key: string): Promise<void> {
		await this.kv.delete(key);
	}
}
