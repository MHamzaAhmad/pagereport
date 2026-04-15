import { z } from "zod";

export const createCheckoutResponse = z.object({
	url: z.string().url(),
});
export type CreateCheckoutResponse = z.infer<typeof createCheckoutResponse>;
