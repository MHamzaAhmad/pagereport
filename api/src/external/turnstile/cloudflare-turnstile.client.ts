import type {
	TurnstileClient,
	TurnstileVerifyInput,
	TurnstileVerifyResult,
} from "@/external/turnstile/turnstile.client";

const SITEVERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface CloudflareTurnstileClientOptions {
	readonly secretKey: string;
	readonly endpoint?: string;
}

interface SiteverifyResponse {
	success?: boolean;
	"error-codes"?: readonly string[];
}

export class CloudflareTurnstileClient implements TurnstileClient {
	private readonly secretKey: string;
	private readonly endpoint: string;

	constructor(options: CloudflareTurnstileClientOptions) {
		if (!options.secretKey) {
			throw new Error("CloudflareTurnstileClient requires a secretKey");
		}
		this.secretKey = options.secretKey;
		this.endpoint = options.endpoint ?? SITEVERIFY_ENDPOINT;
	}

	async verify(input: TurnstileVerifyInput): Promise<TurnstileVerifyResult> {
		const body = new FormData();
		body.append("secret", this.secretKey);
		body.append("response", input.token);
		body.append("remoteip", input.remoteIp);

		const response = await fetch(this.endpoint, {
			method: "POST",
			body,
		});

		if (!response.ok) {
			throw new Error(`Turnstile siteverify failed (${response.status}): ${response.statusText}`);
		}

		const payload = (await response.json()) as SiteverifyResponse;
		return {
			success: payload.success === true,
			errorCodes: payload["error-codes"] ?? [],
		};
	}
}
