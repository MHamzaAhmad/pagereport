CREATE TABLE `report_rate_limit_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `report_rate_limit_attempts_ip_time_idx` ON `report_rate_limit_attempts` (`ip`,`created_at`);