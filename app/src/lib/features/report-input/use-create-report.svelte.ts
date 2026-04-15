import { z } from 'zod';
import { reportsApi, ApiError } from '$lib/api';

const inputSchema = z.object({
	url: z.string().url()
});

export type CreateReportError = 'urlInvalid' | 'turnstileRequired' | 'rateLimited' | 'generic';

export class CreateReportForm {
	url = $state<string>('');
	error = $state<CreateReportError | null>(null);
	isSubmitting = $state<boolean>(false);
	turnstileToken = $state<string | null>(null);

	constructor(private readonly turnstileEnabled: boolean) {}

	setTurnstileToken(token: string | null): void {
		this.turnstileToken = token;
	}

	get canSubmit(): boolean {
		if (this.isSubmitting) return false;
		if (this.turnstileEnabled && !this.turnstileToken) return false;
		return true;
	}

	validate(): boolean {
		const result = inputSchema.safeParse({ url: this.url.trim() });
		if (!result.success) {
			this.error = 'urlInvalid';
			return false;
		}
		if (this.turnstileEnabled && !this.turnstileToken) {
			this.error = 'turnstileRequired';
			return false;
		}
		this.error = null;
		return true;
	}

	async submit(): Promise<{ id: string } | null> {
		if (!this.validate()) return null;
		this.isSubmitting = true;
		try {
			const report = await reportsApi.createReport(
				{ url: this.url.trim() },
				{ turnstileToken: this.turnstileToken ?? undefined }
			);
			return { id: report.id };
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.status === 429) {
					this.error = 'rateLimited';
				} else if (err.status === 403) {
					this.error = 'turnstileRequired';
					this.turnstileToken = null;
				} else {
					this.error = 'generic';
				}
			} else {
				this.error = 'generic';
			}
			return null;
		} finally {
			this.isSubmitting = false;
		}
	}
}
