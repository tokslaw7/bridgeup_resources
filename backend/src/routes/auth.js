import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { signToken, requireAuth } from '../middleware/auth.js';

export const router = Router();

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, created_at: row.created_at };
}

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    const errors = [];
    if (!name || name.length > 100) errors.push('name is required (max 100 characters)');
    if (!EMAIL.test(email)) errors.push('a valid email is required');
    if (password.length < 8) errors.push('password must be at least 8 characters');
    if (errors.length) return res.status(400).json({ errors });

    const exists = await query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password_hash],
    );
    const user = rows[0];
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    const ok = user && (await bcrypt.compare(password, user.password_hash));
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  — current user from token
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id],
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: publicUser(rows[0]) });
  } catch (err) {
    next(err);
  }
});
