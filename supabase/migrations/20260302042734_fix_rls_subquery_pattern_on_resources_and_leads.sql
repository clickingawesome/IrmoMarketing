/*
  # Fix RLS subquery pattern on resources and lead_captures

  1. Changes
    - Replace `auth.uid()` with `(select auth.uid())` in all policies on
      `resources` and `lead_captures` tables to prevent per-row re-evaluation
    - This is a performance optimization recommended by Supabase

  2. Affected Policies
    - lead_captures: "Admins can view all leads"
    - resources: "Admins can insert resources"
    - resources: "Admins can update resources"
    - resources: "Admins can delete resources"
    - resources: "Admins can view all resources"
*/

-- lead_captures: fix "Admins can view all leads"
DROP POLICY IF EXISTS "Admins can view all leads" ON public.lead_captures;
CREATE POLICY "Admins can view all leads"
  ON public.lead_captures
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- resources: fix "Admins can view all resources"
DROP POLICY IF EXISTS "Admins can view all resources" ON public.resources;
CREATE POLICY "Admins can view all resources"
  ON public.resources
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- resources: fix "Admins can insert resources"
DROP POLICY IF EXISTS "Admins can insert resources" ON public.resources;
CREATE POLICY "Admins can insert resources"
  ON public.resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );

-- resources: fix "Admins can update resources"
DROP POLICY IF EXISTS "Admins can update resources" ON public.resources;
CREATE POLICY "Admins can update resources"
  ON public.resources
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

-- resources: fix "Admins can delete resources"
DROP POLICY IF EXISTS "Admins can delete resources" ON public.resources;
CREATE POLICY "Admins can delete resources"
  ON public.resources
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = (select auth.uid())
    )
  );
