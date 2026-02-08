/*
  # Add Write Policies for Projects Management

  1. Security Updates
    - Allow anyone to update projects (for admin interface)
    - Projects SELECT policy already exists (public read)
    
  Note: In production, these should be restricted to authenticated admin users only.
  This is temporary to allow the admin interface to work without authentication.
*/

-- Allow anyone to update projects
CREATE POLICY "Anyone can update projects"
  ON projects FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
