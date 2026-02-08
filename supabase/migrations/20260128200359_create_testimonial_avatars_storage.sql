/*
  # Create Storage Bucket for Testimonial Avatars

  1. New Storage Bucket
    - `testimonial-avatars` - Stores client headshot images
    - Public access for reading
    - Authenticated write access
  
  2. Storage Policies
    - Anyone can view avatar images
    - Authenticated users can upload avatars
    - File size limit: 5MB
    - Allowed file types: jpg, jpeg, png, webp
*/

-- Create storage bucket for testimonial avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonial-avatars',
  'testimonial-avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view avatars
CREATE POLICY "Anyone can view testimonial avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'testimonial-avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload testimonial avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'testimonial-avatars');

-- Allow authenticated users to update avatars
CREATE POLICY "Authenticated users can update testimonial avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'testimonial-avatars')
  WITH CHECK (bucket_id = 'testimonial-avatars');

-- Allow authenticated users to delete avatars
CREATE POLICY "Authenticated users can delete testimonial avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'testimonial-avatars');