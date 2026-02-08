/*
  # Add Write Policies for Testimonials Management

  1. Security Updates
    - Allow anyone to insert testimonials (for admin interface)
    - Allow anyone to update testimonials
    - Allow anyone to delete testimonials
    
  Note: In production, these should be restricted to authenticated admin users only.
  This is temporary to allow the admin interface to work without authentication.
*/

-- Allow anyone to insert testimonials
CREATE POLICY "Anyone can insert testimonials"
  ON testimonials FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to update testimonials
CREATE POLICY "Anyone can update testimonials"
  ON testimonials FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete testimonials
CREATE POLICY "Anyone can delete testimonials"
  ON testimonials FOR DELETE
  TO anon, authenticated
  USING (true);