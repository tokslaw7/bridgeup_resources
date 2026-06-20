CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resources (
  id          SERIAL PRIMARY KEY,
  title       TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description TEXT        NOT NULL CHECK (char_length(description) BETWEEN 1 AND 5000),
  category    TEXT        NOT NULL,
  owner_id    INTEGER     REFERENCES users (id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Make this migration safe to re-run against an existing `resources` table.
ALTER TABLE resources
  ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES users (id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_resources_category   ON resources (category);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_owner_id   ON resources (owner_id);

-- Keep updated_at fresh on every UPDATE.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_resources_updated_at ON resources;
CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
