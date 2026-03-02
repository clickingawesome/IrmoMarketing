/*
  # Add is_visible column to projects

  1. Modified Tables
    - `projects`
      - Add `is_visible` (boolean, default true) - controls global visibility of a project
      - Existing `is_featured` column will now control homepage-only visibility

  2. Notes
    - All existing projects default to visible (true) so nothing disappears
    - is_featured = show on homepage featured section
    - is_visible = show anywhere on the site (including All Projects page)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'is_visible'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_visible boolean DEFAULT true NOT NULL;
  END IF;
END $$;