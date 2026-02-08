/*
  # Create Admin Authorization System

  This migration creates a proper admin authorization system to replace
  insecure RLS policies that use `USING (true)`.

  ## New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users) - The user ID with admin privileges
      - `created_at` (timestamptz) - When admin access was granted
      - `created_by` (uuid) - Who granted the admin access

  ## Security Changes

  ### Books Table
  - Updated INSERT, UPDATE, DELETE policies to check against admins table
  - Only users listed in the admins table can modify books

  ### Projects Table
  - Updated INSERT, UPDATE, DELETE policies to check against admins table
  - Only users listed in the admins table can modify projects

  ### Testimonials Table
  - Updated INSERT, UPDATE, DELETE policies to check against admins table
  - Only users listed in the admins table can modify testimonials

  ### Contact Submissions Table
  - Kept public INSERT policy (intentional for contact form functionality)

  ## Important Notes
  1. After migration, you must add admin user IDs to the admins table
  2. Use the following SQL to grant admin access:
     ```
     INSERT INTO admins (user_id) VALUES ('your-user-id-here');
     ```
  3. Without entries in the admins table, no one can modify content via RLS
*/

-- ============================================================================
-- CREATE ADMINS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only admins can view the admins table
CREATE POLICY "Admins can view admins table"
  ON public.admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Only existing admins can add new admins
CREATE POLICY "Admins can insert new admins"
  ON public.admins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Only existing admins can remove admins
CREATE POLICY "Admins can delete admins"
  ON public.admins FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- ============================================================================
-- BOOKS TABLE: Replace policies with admin-only checks
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can update books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can delete books" ON public.books;

CREATE POLICY "Only admins can insert books"
  ON public.books FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update books"
  ON public.books FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete books"
  ON public.books FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- ============================================================================
-- PROJECTS TABLE: Replace policies with admin-only checks
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;

CREATE POLICY "Only admins can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- ============================================================================
-- TESTIMONIALS TABLE: Replace policies with admin-only checks
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON public.testimonials;

CREATE POLICY "Only admins can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = auth.uid()
    )
  );