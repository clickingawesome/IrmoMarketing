/*
  # Create resources table for digital assets management

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text) - Resource name
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Short description for cards
      - `long_description` (text) - Full description for detail page
      - `category` (text) - One of: course, pdf, quiz, app, paid
      - `thumbnail_url` (text) - Card image/thumbnail
      - `component_path` (text) - Path to JSX component if interactive
      - `pdf_url` (text) - Path to PDF file if applicable
      - `external_url` (text) - External link if applicable
      - `is_free` (boolean) - Whether the resource is free
      - `price` (numeric) - Price if paid
      - `is_published` (boolean) - Whether publicly visible
      - `is_featured` (boolean) - Whether featured on homepage
      - `order_index` (integer) - Sort order
      - `tags` (text[]) - Searchable tags
      - `meta_title` (text) - SEO meta title
      - `meta_description` (text) - SEO meta description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `resources` table
    - Add SELECT policy for anyone to read published resources
    - Add INSERT/UPDATE/DELETE policies for authenticated admin users
*/

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  long_description text DEFAULT '',
  category text NOT NULL CHECK (category IN ('course', 'pdf', 'quiz', 'app', 'paid')),
  thumbnail_url text DEFAULT '',
  component_path text DEFAULT '',
  pdf_url text DEFAULT '',
  external_url text DEFAULT '',
  is_free boolean NOT NULL DEFAULT true,
  price numeric DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  tags text[] DEFAULT '{}',
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published resources"
  ON resources
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can insert resources"
  ON resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update resources"
  ON resources
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete resources"
  ON resources
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(is_published);
CREATE INDEX IF NOT EXISTS idx_resources_order ON resources(order_index);
