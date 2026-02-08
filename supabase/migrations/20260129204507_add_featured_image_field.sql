/*
  # Add Featured Image Field for Books

  1. Changes
    - Add `featured_image` column to books table
      - Stores a separate, high-quality image specifically for the featured book hero section
      - Optional field (nullable)
      - Allows different aspect ratios or styling for the featured position
  
  2. Notes
    - Featured books can now have three images:
      1. `cover_image_vertical` (3:4) - For homepage carousel and general display
      2. `cover_image_horizontal` (16:10) - For books collection grid
      3. `featured_image` (flexible) - For the featured book hero section on the Books page
    - If `featured_image` is not set, the featured section will fall back to `cover_image_vertical`
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE books ADD COLUMN featured_image text;
  END IF;
END $$;