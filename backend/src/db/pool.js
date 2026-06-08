import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy server/.env.example to server/.env.');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);
