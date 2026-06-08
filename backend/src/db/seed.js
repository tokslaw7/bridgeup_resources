import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

const DEMO_USER = {
  name: 'BridgeUp User',
  email: 'toks@bridgeup.local',
  password: 'password123',
};

const samples = [
  {
    title: 'Understanding Autism Spectrum Disorder: A Parent Guide',
    description:
      'A comprehensive guide covering the spectrum, early signs, diagnosis process, and how to support your child at home and in school.',
    category: 'Autism',
  },
  {
    title: 'Sensory Processing Strategies for Daily Life',
    description:
      'Effective techniques for managing sensory input in everyday situations.',
    category: 'Sensory Processing Disorder',
  },
  {
    title: 'ADHD and Learning: Building Routines That Work',
    description:
      'Walk-in primary care, vaccinations, and mental health counseling on a sliding-fee scale. Spanish-speaking staff available.',
    category: 'ADHD',
  },
  {
    title: 'Supporting Speech Development at Home',
    description:
      'Simple, playful activities parents can do daily to encourage language development and communication skills in young children.',
    category: 'Speech & Language',
  },
  {
    title: 'Down Syndrome: Celebrating Every Milestone',
    description:
      'A heartfelt resource for families of children with Down syndrome, focusing on abilities, joy, and practical support strategies',
    category: 'Other Developmental Disorders',
  },
  {
    title: 'Cerebral Palsy and Movement: Adaptive Play Ideas',
    description:
      'Creative play activities and modifications that support children with cerebral palsy to move, explore, and have fun..',
    category: 'Other Developmental Disorders',
  },
];

async function seed() {
  // CASCADE clears resources too (FK on owner_id), then reset identities.
  await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
  await pool.query('TRUNCATE TABLE resources RESTART IDENTITY CASCADE;');

  const password_hash = await bcrypt.hash(DEMO_USER.password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)` +
      `
     RETURNING id`,
    [DEMO_USER.name, DEMO_USER.email, password_hash],
  );
  const ownerId = rows[0].id;

  for (const r of samples) {
    await pool.query(
      `INSERT INTO resources (title, description, category, owner_id)
       VALUES ($1, $2, $3, $4)`,
      [r.title, r.description, r.category, ownerId],
    );
  }
  console.log(`✓ Seeded ${samples.length} resources owned by ${DEMO_USER.email}`);
  console.log(`  Demo login → ${DEMO_USER.email} / ${DEMO_USER.password}`);
}

seed()
  .catch((err) => {
    console.error('✗ Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
