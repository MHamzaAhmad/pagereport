import type { TurnstileClient } from "@/external";

export interface TurnstileVerificationResult {
	readonly success: boolean;
	readonly errorCodes: readonly string[];
}

export class TurnstileService {
	constructor(
		private readonly client: TurnstileClient | null,
		private readonly enabled: boolean,
	) {}

	get isEnabled(): boolean {
		return this.enabled;
	}

	async verify(token: string, remoteIp: string): Promise<TurnstileVerificationResult> {
		if (!this.enabled || this.client === null) {
			return { success: true, errorCodes: [] };
		}
		if (token.length === 0) {
			return { success: false, errorCodes: ["missing-input-response"] };
		}
		return this.client.verify({ token, remoteIp });
	}
}
