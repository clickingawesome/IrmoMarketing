/*
  # Add homepage display control for books

  1. Changes
    - Add `show_on_homepage` boolean column to books table
    - Defaults to false for security and explicit control
    - Allows admins to choose which books appear on homepage

  2. Notes
    - Homepage will display up to 3 books where show_on_homepage = true
    - Books are still ordered by order_index
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'show_on_homepage'
  ) THEN
    ALTER TABLE books ADD COLUMN show_on_homepage boolean DEFAULT false;
  END IF;
END $$;