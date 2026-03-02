/*
  # Allow Anonymous Testimonials and Books Management

  1. Changes
    - Update RLS policies to allow anonymous users to manage testimonials and books
    - Matches the pattern used for music tracks and projects admin management
    - Keeps public read access for everyone

  2. Tables Modified
    - `testimonials`: Updated insert, update, and delete policies
    - `books`: Updated insert, update, and delete policies
*/

-- Testimonials
DROP POLICY IF EXISTS "Only admins can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admins can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admins can delete testimonials" ON testimonials;

CREATE POLICY "Anyone can insert testimonials"
  ON testimonials
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update testimonials"
  ON testimonials
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete testimonials"
  ON testimonials
  FOR DELETE
  USING (true);

-- Books
DROP POLICY IF EXISTS "Only admins can insert books" ON books;
DROP POLICY IF EXISTS "Only admins can update books" ON books;
DROP POLICY IF EXISTS "Only admins can delete books" ON books;

CREATE POLICY "Anyone can insert books"
  ON books
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update books"
  ON books
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete books"
  ON books
  FOR DELETE
  USING (true);
