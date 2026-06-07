-- Manual migration. The current drizzle-kit can't emit a clean diff for
-- this repo (see CLAUDE.md). Apply with `pnpm db:apply` or by hand
-- (psql "$DATABASE_URL" -f src/db/migrations/0001_artwork_kind_and_drop_reserved.sql).
--
-- Safe to re-run: every step is guarded.

BEGIN;

-- 1) Add artwork_kind enum and the kind column.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'artwork_kind') THEN
    CREATE TYPE artwork_kind AS ENUM ('ORIGINAL', 'PRINT');
  END IF;
END $$;

ALTER TABLE artworks
  ADD COLUMN IF NOT EXISTS kind artwork_kind NOT NULL DEFAULT 'ORIGINAL';

CREATE INDEX IF NOT EXISTS artworks_kind_status_idx
  ON artworks (kind, status);

-- 2) Drop the RESERVED value from artwork_status.
--    Postgres can't drop an enum value in place, so we rebuild the type
--    only if RESERVED is still present.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'artwork_status' AND e.enumlabel = 'RESERVED'
  ) THEN
    UPDATE artworks SET status = 'AVAILABLE' WHERE status = 'RESERVED';

    ALTER TYPE artwork_status RENAME TO artwork_status_old;
    CREATE TYPE artwork_status AS ENUM ('AVAILABLE', 'SOLD');

    ALTER TABLE artworks
      ALTER COLUMN status DROP DEFAULT,
      ALTER COLUMN status TYPE artwork_status
        USING status::text::artwork_status,
      ALTER COLUMN status SET DEFAULT 'AVAILABLE';

    DROP TYPE artwork_status_old;
  END IF;
END $$;

COMMIT;
