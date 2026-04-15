CREATE TABLE `report_purchases` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_checkout_id` text NOT NULL,
	`provider_event_id` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`amount_cents` integer NOT NULL,
	`currency` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `report_purchases_checkout_unique` ON `report_purchases` (`provider_checkout_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `report_purchases_event_unique` ON `report_purchases` (`provider_event_id`);--> statement-breakpoint
CREATE INDEX `report_purchases_report_idx` ON `report_purchases` (`report_id`);--> statement-breakpoint
ALTER TABLE `module_runs` ADD `unlocked_via` text;