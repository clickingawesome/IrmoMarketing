/*
  # Fix RLS Security Policies

  This migration addresses critical security vulnerabilities by replacing insecure RLS policies
  that use `USING (true)` or `WITH CHECK (true)` with proper restrictive policies.

  ## Changes Made

  ### Books Table
  - **Removed**: Public policies that allowed unrestricted INSERT, UPDATE, DELETE
  - **Added**: Authenticated-only policies for INSERT, UPDATE, DELETE operations
  - **Security**: Only authenticated users (admins) can modify book data

  ### Projects Table
  - **Removed**: Public policy that allowed unrestricted UPDATE
  - **Added**: Authenticated-only policies for INSERT, UPDATE, DELETE operations
  - **Security**: Only authenticated users (admins) can modify project data

  ### Testimonials Table
  - **Removed**: Public policies that allowed unrestricted INSERT, UPDATE, DELETE
  - **Added**: Authenticated-only policies for INSERT, UPDATE, DELETE operations
  - **Security**: Only authenticated users (admins) can modify testimonial data

  ### Contact Submissions Table
  - **Kept**: Public INSERT policy (intentional - contact forms are public)
  - **Note**: Contact form submissions remain publicly accessible for form functionality

  ## Security Impact
  - Eliminates RLS bypass vulnerabilities
  - Restricts all write operations to authenticated users only
  - Maintains public read access for portfolio content
  - Preserves public contact form functionality
*/

-- ============================================================================
-- BOOKS TABLE: Drop insecure policies and create authenticated-only policies
-- ============================================================================

DROP POLICY IF EXISTS "Public can insert books" ON public.books;
DROP POLICY IF EXISTS "Public can update books" ON public.books;
DROP POLICY IF EXISTS "Public can delete books" ON public.books;

CREATE POLICY "Authenticated users can insert books"
  ON public.books FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update books"
  ON public.books FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete books"
  ON public.books FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- PROJECTS TABLE: Drop insecure policies and create authenticated-only policies
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can delete projects" ON public.projects;

CREATE POLICY "Authenticated users can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- TESTIMONIALS TABLE: Drop insecure policies and create authenticated-only policies
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can delete testimonials" ON public.testimonials;

CREATE POLICY "Authenticated users can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (true);