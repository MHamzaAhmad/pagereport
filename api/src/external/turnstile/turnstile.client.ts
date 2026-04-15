export interface TurnstileVerifyInput {
	readonly token: string;
	readonly remoteIp: string;
}

export interface TurnstileVerifyResult {
	readonly success: boolean;
	readonly errorCodes: readonly string[];
}

export interface TurnstileClient {
	verify(input: TurnstileVerifyInput): Promise<TurnstileVerifyResult>;
}
