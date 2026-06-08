import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { router as resourcesRouter, CATEGORIES } from './routes/api.js';
import { router as authRouter } from './routes/auth.js';
import { pool } from './db/pool.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4500;
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: origins }));
app.use(express.json());
// app.use(morgan('dev'));

// Health check
app.get('/api/autism', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'up' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'down' });
  }
});

app.get('/api/categories', (_req, res) => res.json(CATEGORIES));

app.use('/api/auth', authRouter);
app.use('/api/resources', resourcesRouter);

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));


app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`BridgeUp API listening on http://localhost:${PORT}`);
});
