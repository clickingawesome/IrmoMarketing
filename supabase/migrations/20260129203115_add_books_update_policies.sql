/*
  # Add update policies for books table

  1. Changes
    - Add INSERT policy to allow public users to create books
    - Add UPDATE policy to allow public users to update books
    - Add DELETE policy to allow public users to delete books
    - This enables the admin panel to function without authentication

  2. Security Note
    - For production use, consider implementing authentication for better security
    - Current setup allows anyone to modify book data
*/

CREATE POLICY "Public can insert books"
  ON books
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update books"
  ON books
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete books"
  ON books
  FOR DELETE
  TO public
  USING (true);
