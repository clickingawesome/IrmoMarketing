/*
  # Add External Link Option to Projects

  1. Changes
    - Add `external_link` field to projects table for linking to external project pages
    - Update view_type constraint to include 'external_link' option
  
  2. Notes
    - External link projects will redirect users to an external URL instead of showing case study/gallery
    - This is useful for projects hosted on other platforms or sites
*/

DO $$
BEGIN
  -- Add external_link column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'external_link'
  ) THEN
    ALTER TABLE projects ADD COLUMN external_link text;
  END IF;
END $$;

-- Drop the existing constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'projects' AND constraint_name LIKE '%view_type%'
  ) THEN
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_view_type_check;
  END IF;
END $$;

-- Add the new constraint with external_link option
ALTER TABLE projects ADD CONSTRAINT projects_view_type_check 
  CHECK (view_type IN ('case_study', 'gallery', 'external_link'));