/*
  # Fix book covers storage policies for public access

  1. Changes
    - Update storage policies to allow public (unauthenticated) users to upload, update, and delete book covers
    - This allows the admin panel to function without authentication
    - Public read access remains unchanged

  2. Security Note
    - For production use, consider implementing authentication for better security
    - Current setup allows anyone to upload/modify book covers
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload book covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update book covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete book covers" ON storage.objects;

-- Create new policies for public access
CREATE POLICY "Public can upload book covers"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'book_covers');

CREATE POLICY "Public can update book covers"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'book_covers')
  WITH CHECK (bucket_id = 'book_covers');

CREATE POLICY "Public can delete book covers"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'book_covers');
