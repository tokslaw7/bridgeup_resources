import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

export const router = Router();

export const CATEGORIES = [
  'Autism',
  'ADHD',
  'Speech & Language',
  'Sensory Processing Disorder',
  'General',
  'Other Developmental Disorders',
];

// Select resource columns plus the owner's display name.
const SELECT = `
  SELECT r.id, r.title, r.description, r.category,
         r.owner_id, u.name AS owner_name,
         r.created_at, r.updated_at
  FROM resources r
  LEFT JOIN users u ON u.id = r.owner_id`;

/** Trim strings, coerce empty strings to null for optional fields, and validate. */
function validateBody(body) {
  const errors = [];
  const clean = {};

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const category = typeof body.category === 'string' ? body.category.trim() : '';

  if (!title) errors.push('title is required');
  else if (title.length > 200) errors.push('title must be 200 characters or fewer');

  if (!description) errors.push('description is required');
  else if (description.length > 5000) errors.push('description must be 5000 characters or fewer');

  if (!category) errors.push('category is required');
  else if (!CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${CATEGORIES.join(', ')}`);
  }

  clean.title = title;
  clean.description = description;
  clean.category = category;

    return { errors, clean };

}

/**
 * Loads a resource and confirms the requesting user owns it.
 * Returns { status, error } on failure, or { resource } on success.
 */
async function loadOwned(id, userId) {
  const { rows } = await query('SELECT owner_id FROM resources WHERE id = $1', [id]);
  if (rows.length === 0) return { status: 404, error: 'Resource not found' };
  if (rows[0].owner_id !== userId) {
    return { status: 403, error: 'You can only modify resources you posted' };
  }
  return { resource: rows[0] };
}

// GET /api/resources?search=&category=  — public browse with optional filtering
router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const conditions = [];
    const params = [];

    if (category && category !== 'All') {
      params.push(category);
      conditions.push(`r.category = $${params.length}`);
    }
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(
        `(r.title ILIKE $${params.length} OR r.description ILIKE $${params.length} OR r.location ILIKE $${params.length})`,
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await query(`${SELECT} ${where} ORDER BY r.created_at DESC`, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/resources/:id  — public
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(`${SELECT} WHERE r.id = $1`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Resource not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/resources  
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { errors, clean } = validateBody(req.body ?? {});
    if (errors.length) return res.status(400).json({ errors });

    const { rows } = await query(
      `INSERT INTO resources (title, description, category, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [clean.title, clean.description, clean.category, req.user.id],
    );
    const created = await query(`${SELECT} WHERE r.id = $1`, [rows[0].id]);
    res.status(201).json(created.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/resources/:id  — owner only
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const check = await loadOwned(req.params.id, req.user.id);
    if (check.error) return res.status(check.status).json({ error: check.error });

    const { errors, clean } = validateBody(req.body ?? {});
    if (errors.length) return res.status(400).json({ errors });

    await query(
      `UPDATE resources
       SET title = $1, description = $2, category = $3
       WHERE id = $4`,
      [clean.title, clean.description, clean.category, req.params.id],
    );
    const updated = await query(`${SELECT} WHERE r.id = $1`, [req.params.id]);
    res.json(updated.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/resources/:id  — owner only
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const check = await loadOwned(req.params.id, req.user.id);
    if (check.error) return res.status(check.status).json({ error: check.error });

    await query('DELETE FROM resources WHERE id = $1', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
