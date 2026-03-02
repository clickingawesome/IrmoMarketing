/*
  # Lock down write policies to admins only

  1. Problem
    - books, projects, testimonials, music_tracks, music_albums all have
      INSERT/UPDATE/DELETE policies with `USING (true)` or `WITH CHECK (true)`
      allowing anyone (including anonymous users) to modify data
    - This is a critical security vulnerability

  2. Changes
    - Drop all overly permissive write policies on these 5 tables
    - Replace with admin-only policies that check the `admins` table
    - Keep public SELECT policies unchanged so visitors can view content
    - Use the optimized `(select auth.uid())` pattern

  3. Affected Tables
    - books: INSERT, UPDATE, DELETE
    - projects: INSERT, UPDATE, DELETE
    - testimonials: INSERT, UPDATE, DELETE
    - music_tracks: INSERT, UPDATE, DELETE
    - music_albums: INSERT, UPDATE, DELETE

  4. Security
    - Only authenticated users listed in the `admins` table can write
    - Anonymous and non-admin authenticated users can only read
*/

-- ============================================================
-- BOOKS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert books" ON public.books;
DROP POLICY IF EXISTS "Anyone can update books" ON public.books;
DROP POLICY IF EXISTS "Anyone can delete books" ON public.books;

CREATE POLICY "Admins can insert books"
  ON public.books
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can update books"
  ON public.books
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can delete books"
  ON public.books
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- ============================================================
-- PROJECTS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can delete projects" ON public.projects;

CREATE POLICY "Admins can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- ============================================================
-- TESTIMONIALS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can delete testimonials" ON public.testimonials;

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- ============================================================
-- MUSIC_TRACKS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can create music tracks" ON public.music_tracks;
DROP POLICY IF EXISTS "Anyone can update music tracks" ON public.music_tracks;
DROP POLICY IF EXISTS "Anyone can delete music tracks" ON public.music_tracks;

CREATE POLICY "Admins can insert music tracks"
  ON public.music_tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can update music tracks"
  ON public.music_tracks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can delete music tracks"
  ON public.music_tracks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- ============================================================
-- MUSIC_ALBUMS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can create music albums" ON public.music_albums;
DROP POLICY IF EXISTS "Anyone can update music albums" ON public.music_albums;
DROP POLICY IF EXISTS "Anyone can delete music albums" ON public.music_albums;

CREATE POLICY "Admins can insert music albums"
  ON public.music_albums
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can update music albums"
  ON public.music_albums
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can delete music albums"
  ON public.music_albums
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- Also tighten lead_captures INSERT to validate required fields
DROP POLICY IF EXISTS "Anyone can submit lead capture" ON public.lead_captures;
CREATE POLICY "Anyone can submit lead capture"
  ON public.lead_captures
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL AND email <> ''
  );
