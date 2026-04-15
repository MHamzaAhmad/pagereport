export interface CreateCheckoutInput {
	readonly reportId: string;
	readonly successUrl: string;
}

export interface CreateCheckoutResult {
	readonly checkoutId: string;
	readonly url: string;
	readonly amountCents: number;
	readonly currency: string;
}

export type PaymentWebhookEventType =
	| "checkout.completed"
	| "checkout.failed"
	| "checkout.expired"
	| "ignored";

export interface PaymentWebhookEvent {
	readonly id: string;
	readonly type: PaymentWebhookEventType;
	readonly checkoutId: string | null;
	readonly reportId: string | null;
	readonly amountCents: number | null;
	readonly currency: string | null;
}

/**
 * Platform-agnostic payment provider contract. The concrete implementation
 * (Polar, Stripe, …) lives in a sibling file and is wired via the DI container.
 * Service code MUST depend only on this interface.
 */
export interface PaymentClient {
	createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
	verifyWebhook(rawBody: string, headers: Record<string, string>): PaymentWebhookEvent;
}

export class PaymentWebhookVerificationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PaymentWebhookVerificationError";
	}
}
