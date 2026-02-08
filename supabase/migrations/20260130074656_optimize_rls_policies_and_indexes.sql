/*
  # Optimize RLS Policies and Indexes for Performance

  This migration addresses performance issues with RLS policies and missing indexes.

  ## Changes

  ### 1. Indexes
  - Add index on `admins.created_by` foreign key to improve query performance

  ### 2. RLS Policy Optimization
  - Replace `auth.uid()` with `(select auth.uid())` in all policies
  - This prevents re-evaluation of auth.uid() for each row, significantly improving performance
  
  ### 3. Contact Form Policy
  - Add basic validation to ensure email and message fields are provided
  - Prevents completely empty submissions while keeping form public

  ## Tables Affected
  - admins (index + policies)
  - books (policies)
  - projects (policies)
  - testimonials (policies)
  - contact_submissions (policy)
*/

-- ============================================================================
-- ADD MISSING INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_admins_created_by 
  ON public.admins(created_by);

-- ============================================================================
-- ADMINS TABLE: Optimize RLS policies
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view admins table" ON public.admins;
DROP POLICY IF EXISTS "Admins can insert new admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can delete admins" ON public.admins;

CREATE POLICY "Admins can view admins table"
  ON public.admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can insert new admins"
  ON public.admins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can delete admins"
  ON public.admins FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- BOOKS TABLE: Optimize RLS policies
-- ============================================================================

DROP POLICY IF EXISTS "Only admins can insert books" ON public.books;
DROP POLICY IF EXISTS "Only admins can update books" ON public.books;
DROP POLICY IF EXISTS "Only admins can delete books" ON public.books;

CREATE POLICY "Only admins can insert books"
  ON public.books FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Only admins can update books"
  ON public.books FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Only admins can delete books"
  ON public.books FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- PROJECTS TABLE: Optimize RLS policies
-- ============================================================================

DROP POLICY IF EXISTS "Only admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Only admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Only admins can delete projects" ON public.projects;

CREATE POLICY "Only admins can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Only admins can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Only admins can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- TESTIMONIALS TABLE: Optimize RLS policies
-- ============================================================================

DROP POLICY IF EXISTS "Only admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Only admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Only admins can delete testimonials" ON public.testimonials;

CREATE POLICY "Only admins can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Only admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Only admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- CONTACT_SUBMISSIONS TABLE: Add validation to public form policy
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact forms"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL AND 
    email != '' AND 
    message IS NOT NULL AND 
    message != ''
  );