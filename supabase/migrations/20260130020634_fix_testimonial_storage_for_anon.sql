/*
  # Fix Testimonial Storage Policies for Anonymous Users

  1. Changes
    - Update storage policies to allow anonymous (anon) users to upload, update, and delete testimonial avatars
    - This matches the testimonials table policies which allow anon access
  
  2. Security Note
    - In production, these should be restricted to authenticated admin users only
    - This is temporary to allow the admin interface to work without authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload testimonial avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update testimonial avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete testimonial avatars" ON storage.objects;

-- Allow anyone to upload avatars
CREATE POLICY "Anyone can upload testimonial avatars"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'testimonial-avatars');

-- Allow anyone to update avatars
CREATE POLICY "Anyone can update testimonial avatars"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'testimonial-avatars')
  WITH CHECK (bucket_id = 'testimonial-avatars');

-- Allow anyone to delete avatars
CREATE POLICY "Anyone can delete testimonial avatars"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'testimonial-avatars');
