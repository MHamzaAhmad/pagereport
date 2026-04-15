CREATE TABLE `prerequisite_results` (
	`id` text PRIMARY KEY NOT NULL,
	`prerequisite_type` text NOT NULL,
	`normalized_url` text NOT NULL,
	`result_json` text NOT NULL,
	`computed_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prerequisite_results_type_url_unique` ON `prerequisite_results` (`prerequisite_type`,`normalized_url`);--> statement-breakpoint
CREATE INDEX `prerequisite_results_type_computed_idx` ON `prerequisite_results` (`prerequisite_type`,`computed_at`);--> statement-breakpoint
CREATE TABLE `prerequisite_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`prerequisite_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`prerequisite_result_id` text,
	`error` text,
	`workflow_instance_id` text,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`prerequisite_result_id`) REFERENCES `prerequisite_results`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prerequisite_runs_report_type_unique` ON `prerequisite_runs` (`report_id`,`prerequisite_type`);--> statement-breakpoint
CREATE INDEX `prerequisite_runs_report_idx` ON `prerequisite_runs` (`report_id`);