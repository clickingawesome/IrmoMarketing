/*
  # Add Detailed Fields to Books Table

  1. New Columns
    - `category` (text) - Book genre/category (e.g., "Self-Help", "Children's", "Fiction")
    - `description` (text) - Book description/synopsis
    - `icon` (text) - Icon name from lucide-react for book cover
    - `format` (text) - Book format (e.g., "Paperback & eBook")
    - `audience` (text) - Target audience (e.g., "Teens & Young Adults")
    - `amazon_link` (text) - Amazon purchase URL
    - `sample_link` (text) - Sample/preview URL
    - `is_featured` (boolean) - Whether this is the featured book
    - `tag` (text) - Category tag displayed on book (e.g., "Self-Help / Personal Development")
  
  2. Changes
    - All existing books remain unchanged
    - New fields are optional (nullable)
*/

-- Add new columns to books table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'category'
  ) THEN
    ALTER TABLE books ADD COLUMN category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'description'
  ) THEN
    ALTER TABLE books ADD COLUMN description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'icon'
  ) THEN
    ALTER TABLE books ADD COLUMN icon text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'format'
  ) THEN
    ALTER TABLE books ADD COLUMN format text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'audience'
  ) THEN
    ALTER TABLE books ADD COLUMN audience text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'amazon_link'
  ) THEN
    ALTER TABLE books ADD COLUMN amazon_link text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'sample_link'
  ) THEN
    ALTER TABLE books ADD COLUMN sample_link text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE books ADD COLUMN is_featured boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'tag'
  ) THEN
    ALTER TABLE books ADD COLUMN tag text;
  END IF;
END $$;