import { drizzle } from "drizzle-orm/d1";
import { ReportsRepo } from "@/repos";
import { ReportsService } from "@/services";

export interface Container {
	services: {
		reports: ReportsService;
	};
}

export function buildContainer(env: CloudflareBindings): Container {
	const db = drizzle(env.DB);
	const reportsRepo = new ReportsRepo(db);
	return {
		services: {
			reports: new ReportsService(reportsRepo),
		},
	};
}
