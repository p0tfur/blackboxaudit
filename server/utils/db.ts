import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../database/schema';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { join } from 'path';

// Determine database path from environment variable or default
// In Docker with Coolify, you usually map a volume to /app/data
const dbPath = process.env.DB_PATH || 'sqlite.db';

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// Run migrations on startup
try {
  // In the Dockerfile, we copy the 'drizzle' folder to the app root.
  // We resolve the path relative to the current working directory.
  const migrationsFolder = join(process.cwd(), 'drizzle');
  
  console.log(`[DB] Initializing database at: ${dbPath}`);
  console.log(`[DB] Running migrations from: ${migrationsFolder}`);
  
  migrate(db, { migrationsFolder });
  
  console.log('[DB] Migrations completed successfully.');
} catch (e: any) {
  if (e.message && e.message.includes('table') && e.message.includes('already exists')) {
     console.log('[DB] Database already initialized.');
  } else {
     console.error('[DB] Migration failed:', e);
  }
}
