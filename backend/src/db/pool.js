import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy server/.env.example to server/.env.');
}

// Managed Postgres (Render, Railway, Neon, Supabase, …) requires SSL.
// Enable it in production or when DATABASE_SSL=true; disable for local Docker.
const useSSL =
  process.env.DATABASE_SSL === 'true' || process.env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);
