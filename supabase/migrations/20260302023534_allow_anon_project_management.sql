/*
  # Allow Anonymous Project Management

  1. Changes
    - Update RLS policies to allow anonymous users to manage projects
    - This matches the pattern used for music tracks admin management
    - Keeps public read access for everyone
    - Allows insert, update, and delete operations for anonymous users

  2. Security Notes
    - Enables the admin project management page to work without authentication
    - In production, these should be restricted to authenticated admin users only

  3. Tables Modified
    - `projects`: Updated insert, update, and delete policies
*/

DROP POLICY IF EXISTS "Only admins can insert projects" ON projects;
DROP POLICY IF EXISTS "Only admins can update projects" ON projects;
DROP POLICY IF EXISTS "Only admins can delete projects" ON projects;

CREATE POLICY "Anyone can insert projects"
  ON projects
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update projects"
  ON projects
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete projects"
  ON projects
  FOR DELETE
  USING (true);
