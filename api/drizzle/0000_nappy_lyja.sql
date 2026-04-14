CREATE TABLE `module_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`module_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`result_json` text,
	`error` text,
	`workflow_instance_id` text,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `module_runs_report_module_unique` ON `module_runs` (`report_id`,`module_type`);--> statement-breakpoint
CREATE INDEX `module_runs_report_idx` ON `module_runs` (`report_id`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`created_at` integer NOT NULL
);
