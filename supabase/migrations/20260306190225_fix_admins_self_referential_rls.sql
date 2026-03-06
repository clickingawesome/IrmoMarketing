
/*
  # Fix admins table self-referential RLS policy

  The existing SELECT policy on the admins table uses a subquery that checks the
  admins table itself, creating a deadlock where the policy can never resolve to
  true. This replaces it with a direct column check.
*/

DROP POLICY IF EXISTS "Admins can view admins table" ON admins;

CREATE POLICY "Admins can view admins table"
  ON admins
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
