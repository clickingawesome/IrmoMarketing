/*
  # Allow anonymous management of music albums

  1. Security Changes
    - Drop existing authenticated-only INSERT, UPDATE, DELETE policies on `music_albums`
    - Add new policies allowing anon/public access for INSERT, UPDATE, DELETE
    - This matches the access pattern used by other admin-managed tables (music_tracks, projects, testimonials, books)

  2. Notes
    - The app's admin panel does not use Supabase auth, so authenticated-only policies block all write operations
    - SELECT policy already allows public access and is unchanged
*/

DROP POLICY IF EXISTS "Authenticated users can create music albums" ON music_albums;
DROP POLICY IF EXISTS "Authenticated users can update music albums" ON music_albums;
DROP POLICY IF EXISTS "Authenticated users can delete music albums" ON music_albums;

CREATE POLICY "Anyone can create music albums"
  ON music_albums
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update music albums"
  ON music_albums
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete music albums"
  ON music_albums
  FOR DELETE
  TO anon
  USING (true);
