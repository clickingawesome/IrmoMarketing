/*
  # Create Storage Bucket for Project Images

  1. New Storage Bucket
    - `project-images` - Stores project images for galleries and case studies
    - Public access for reading
    - Anyone can upload (for admin interface without auth)
  
  2. Storage Policies
    - Anyone can view project images
    - Anyone can upload images
    - File size limit: 10MB
    - Allowed file types: jpg, jpeg, png, webp
  
  3. Security Note
    - In production, upload policies should be restricted to authenticated admin users
    - This is temporary to allow the admin interface to work without authentication
*/

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view project images
CREATE POLICY "Anyone can view project images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'project-images');

-- Allow anyone to upload project images
CREATE POLICY "Anyone can upload project images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'project-images');

-- Allow anyone to update project images
CREATE POLICY "Anyone can update project images"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'project-images')
  WITH CHECK (bucket_id = 'project-images');

-- Allow anyone to delete project images
CREATE POLICY "Anyone can delete project images"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'project-images');
