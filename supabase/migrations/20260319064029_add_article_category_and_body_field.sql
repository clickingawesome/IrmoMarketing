/*
  # Add Article Category and Body Content Field

  ## Summary
  Extends the resources table to support blog articles as a new content category.

  ## Changes

  ### 1. New Column
  - `body` (text, nullable): Full article body content in markdown or plain text.
    Used for blog articles rendered directly in the detail page.

  ### 2. Category Constraint Update
  - Drops and recreates the category check constraint to add 'article' as a valid value
    alongside the existing: 'course', 'pdf', 'quiz', 'app', 'paid'

  ## Notes
  - Existing rows are unaffected — body defaults to NULL
  - No data loss occurs; constraint is updated non-destructively
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resources' AND column_name = 'body'
  ) THEN
    ALTER TABLE resources ADD COLUMN body text;
  END IF;
END $$;

ALTER TABLE resources
  DROP CONSTRAINT IF EXISTS resources_category_check;

ALTER TABLE resources
  ADD CONSTRAINT resources_category_check
  CHECK (category IN ('course', 'pdf', 'quiz', 'app', 'paid', 'article'));
