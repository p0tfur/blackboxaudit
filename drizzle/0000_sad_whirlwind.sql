CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`scan_id` text NOT NULL,
	`is_public` integer DEFAULT true,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`scan_id`) REFERENCES `scans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scans` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`score` integer NOT NULL,
	`data` text NOT NULL,
	`created_at` integer NOT NULL,
	`scan_duration` integer
);
