/*
  # Remove broad SELECT policies on public storage buckets

  1. Security Changes
    - Drop broad SELECT policies on `storage.objects` for the following
      public buckets: `album-covers`, `book_covers`, `project-images`,
      `resource-thumbnails`, `testimonial-avatars`.
    - Public buckets serve individual object URLs without requiring a
      SELECT policy on `storage.objects`. Removing these policies prevents
      clients from using the storage API to enumerate/list bucket contents
      while keeping direct public URLs functional.

  2. Notes
    1. INSERT/UPDATE/DELETE policies remain unchanged.
    2. Direct public object URLs (e.g. `/storage/v1/object/public/...`)
       continue to work because the bucket's own `public = true` flag
       controls anonymous object fetches, not these policies.
*/

DROP POLICY IF EXISTS "Album covers are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can view book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for resource thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view testimonial avatars" ON storage.objects;
