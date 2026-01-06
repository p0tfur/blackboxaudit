import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const scans = sqliteTable('scans', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  score: integer('score').notNull(),
  data: text('data', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  scanDuration: integer('scan_duration'),
});

export const certificates = sqliteTable('certificates', {
  id: text('id').primaryKey(),
  scanId: text('scan_id').notNull().references(() => scans.id),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
