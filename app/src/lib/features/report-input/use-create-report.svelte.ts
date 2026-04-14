import { z } from 'zod';
import { reportsApi, ApiError } from '$lib/api';

const inputSchema = z.object({
	url: z.string().url()
});

export class CreateReportForm {
	url = $state<string>('');
	error = $state<string | null>(null);
	isSubmitting = $state<boolean>(false);

	validate(): boolean {
		const result = inputSchema.safeParse({ url: this.url.trim() });
		if (!result.success) {
			this.error = 'urlInvalid';
			return false;
		}
		this.error = null;
		return true;
	}

	async submit(): Promise<{ id: string } | null> {
		if (!this.validate()) return null;
		this.isSubmitting = true;
		try {
			const report = await reportsApi.createReport({ url: this.url.trim() });
			return { id: report.id };
		} catch (err) {
			this.error = err instanceof ApiError ? err.message : 'generic';
			return null;
		} finally {
			this.isSubmitting = false;
		}
	}
}
