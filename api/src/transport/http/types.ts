import type { Container } from "@/container";

export interface AppEnv {
	Bindings: CloudflareBindings;
	Variables: {
		container: Container;
	};
}
