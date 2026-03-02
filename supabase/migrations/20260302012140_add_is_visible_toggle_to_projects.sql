/*
  # Add Visibility Toggle for Projects
  
  1. Changes
    - Ensure `is_featured` field exists with proper default value
    - This field controls whether projects appear on the live site
    
  2. Notes
    - Projects with `is_featured = true` will be visible on the homepage
    - Projects with `is_featured = false` will be hidden from public view
    - This allows admins to prepare projects before making them public
*/

-- Ensure is_featured field exists (it should already exist, but we're being safe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- Update any NULL values to false for consistency
UPDATE projects SET is_featured = false WHERE is_featured IS NULL;
