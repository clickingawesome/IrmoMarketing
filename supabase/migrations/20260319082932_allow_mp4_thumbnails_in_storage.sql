/*
  # Allow MP4 video thumbnails in resource-thumbnails storage bucket

  Adds video/mp4 as an allowed MIME type and increases the file size limit
  to 50 MB to support video thumbnails.

  1. Changes
    - Adds video/mp4 to allowed_mime_types
    - Increases max file size to 50 MB
*/

UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'video/mp4'],
  file_size_limit = 52428800
WHERE id = 'resource-thumbnails';
