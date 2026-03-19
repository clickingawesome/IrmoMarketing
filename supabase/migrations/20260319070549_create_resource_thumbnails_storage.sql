/*
  # Create resource-thumbnails storage bucket

  1. New Storage Bucket
    - `resource-thumbnails` — public bucket for resource card thumbnail images

  2. Security
    - Public read access for all users
    - Authenticated (admin) users can insert, update, delete
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-thumbnails', 'resource-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for resource thumbnails"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'resource-thumbnails');

CREATE POLICY "Authenticated users can upload resource thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resource-thumbnails');

CREATE POLICY "Authenticated users can update resource thumbnails"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resource-thumbnails');

CREATE POLICY "Authenticated users can delete resource thumbnails"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resource-thumbnails');
