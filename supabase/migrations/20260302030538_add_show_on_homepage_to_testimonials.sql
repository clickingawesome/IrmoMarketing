/*
  # Add homepage display control for testimonials

  1. Changes
    - Add `show_on_homepage` boolean column to testimonials table
    - Defaults to false for explicit control
    - Allows admins to choose which testimonials appear on the homepage

  2. Notes
    - Homepage will display only testimonials where show_on_homepage = true
    - A dedicated /testimonials page will show all testimonials
    - Testimonials are still ordered by order_index
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'show_on_homepage'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN show_on_homepage boolean DEFAULT false;
  END IF;
END $$;