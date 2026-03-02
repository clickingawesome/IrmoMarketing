/*
  # Add missing INSERT policy for album-covers storage bucket

  1. Security Changes
    - Add INSERT policy on `storage.objects` for the `album-covers` bucket
    - Allows anon role to upload album cover images (matches existing pattern for other storage buckets in this project)

  2. Notes
    - The bucket already has SELECT, UPDATE, and DELETE policies
    - Only the INSERT policy was missing, which prevented uploading new album covers
*/

CREATE POLICY "Anyone can upload album covers"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'album-covers');
