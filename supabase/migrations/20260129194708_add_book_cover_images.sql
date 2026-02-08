/*
  # Add book cover image storage and fields

  1. Storage
    - Create book_covers storage bucket for storing book cover images
    - Enable public access for book covers
    - Set up RLS policies for authenticated users to upload

  2. Changes to books table
    - Add `cover_image_vertical` text field for homepage display (aspect ratio 3:4)
    - Add `cover_image_horizontal` text field for books page display (wider format)
    - Both fields are nullable to allow gradual migration

  3. Security
    - Public read access for all book covers
    - Authenticated users can upload covers
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('book_covers', 'book_covers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view book covers"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'book_covers');

CREATE POLICY "Authenticated users can upload book covers"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'book_covers');

CREATE POLICY "Authenticated users can update book covers"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'book_covers')
  WITH CHECK (bucket_id = 'book_covers');

CREATE POLICY "Authenticated users can delete book covers"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'book_covers');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'cover_image_vertical'
  ) THEN
    ALTER TABLE books ADD COLUMN cover_image_vertical text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'cover_image_horizontal'
  ) THEN
    ALTER TABLE books ADD COLUMN cover_image_horizontal text;
  END IF;
END $$;