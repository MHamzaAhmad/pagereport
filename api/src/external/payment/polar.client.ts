import { Polar } from "@polar-sh/sdk";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks.js";
import {
	type CreateCheckoutInput,
	type CreateCheckoutResult,
	type PaymentClient,
	type PaymentWebhookEvent,
	PaymentWebhookVerificationError,
} from "@/external/payment/payment.client";

export interface PolarClientOptions {
	readonly accessToken: string;
	readonly webhookSecret: string;
	readonly productId: string;
	readonly server?: "production" | "sandbox";
}

const REPORT_METADATA_KEY = "reportId";

export class PolarClient implements PaymentClient {
	private readonly sdk: Polar;
	private readonly webhookSecret: string;
	private readonly productId: string;

	constructor(options: PolarClientOptions) {
		this.sdk = new Polar({
			accessToken: options.accessToken,
			server: options.server ?? "production",
		});
		this.webhookSecret = options.webhookSecret;
		this.productId = options.productId;
	}

	async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
		const checkout = await this.sdk.checkouts.create({
			products: [this.productId],
			successUrl: input.successUrl,
			externalCustomerId: input.reportId,
			metadata: { [REPORT_METADATA_KEY]: input.reportId },
		});

		return {
			checkoutId: checkout.id,
			url: checkout.url,
			amountCents: checkout.totalAmount,
			currency: checkout.currency ?? "usd",
		};
	}

	verifyWebhook(rawBody: string, headers: Record<string, string>): PaymentWebhookEvent {
		let event: ReturnType<typeof validateEvent>;
		try {
			event = validateEvent(rawBody, headers, this.webhookSecret);
		} catch (err) {
			if (err instanceof WebhookVerificationError) {
				throw new PaymentWebhookVerificationError(err.message);
			}
			throw err;
		}

		if (event.type === "checkout.updated") {
			const data = event.data;
			const status = String(data.status);
			const reportId = extractReportId(data.externalCustomerId, data.metadata);
			if (status === "succeeded" || status === "confirmed") {
				return {
					id: buildEventId(event.type, data.id, status),
					type: "checkout.completed",
					checkoutId: data.id,
					reportId,
					amountCents: data.totalAmount,
					currency: data.currency ?? null,
				};
			}
			if (status === "failed") {
				return {
					id: buildEventId(event.type, data.id, status),
					type: "checkout.failed",
					checkoutId: data.id,
					reportId,
					amountCents: data.totalAmount,
					currency: data.currency ?? null,
				};
			}
			if (status === "expired") {
				return {
					id: buildEventId(event.type, data.id, status),
					type: "checkout.expired",
					checkoutId: data.id,
					reportId,
					amountCents: data.totalAmount,
					currency: data.currency ?? null,
				};
			}
		}

		if (event.type === "checkout.expired") {
			const data = event.data;
			return {
				id: buildEventId(event.type, data.id, "expired"),
				type: "checkout.expired",
				checkoutId: data.id,
				reportId: extractReportId(data.externalCustomerId, data.metadata),
				amountCents: data.totalAmount,
				currency: data.currency ?? null,
			};
		}

		return {
			id: `ignored:${event.type}:${Date.now()}`,
			type: "ignored",
			checkoutId: null,
			reportId: null,
			amountCents: null,
			currency: null,
		};
	}
}

function extractReportId(
	externalCustomerId: string | null | undefined,
	metadata: Record<string, unknown> | null | undefined,
): string | null {
	if (typeof externalCustomerId === "string" && externalCustomerId.length > 0) {
		return externalCustomerId;
	}
	if (metadata && typeof metadata === "object") {
		const fromMetadata = metadata[REPORT_METADATA_KEY];
		if (typeof fromMetadata === "string" && fromMetadata.length > 0) {
			return fromMetadata;
		}
	}
	return null;
}

function buildEventId(type: string, checkoutId: string, status: string): string {
	return `${type}:${checkoutId}:${status}`;
}
