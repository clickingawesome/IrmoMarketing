/*
  # Allow GIF thumbnails in resource-thumbnails storage bucket

  Updates the storage bucket configuration to allow GIF files in addition to
  the existing JPG/PNG images, and increases the file size limit to 10 MB
  to accommodate animated GIFs.

  1. Changes
    - Updates resource-thumbnails bucket to allow image/gif MIME type
    - Increases max file size from 5 MB to 10 MB
*/

UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
  file_size_limit = 10485760
WHERE id = 'resource-thumbnails';
