import { Pool } from 'pg';

const globalForDb = globalThis as unknown as {
  sourcelyxPool?: Pool;
};

export const db =
  globalForDb.sourcelyxPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sourcelyxPool = db;
}

export async function query<T = unknown>(text: string, params: unknown[] = []) {
  return db.query<T>(text, params);
}
