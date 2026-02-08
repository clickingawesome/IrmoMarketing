/*
  # Portfolio Website Database Schema

  ## New Tables
  
  ### `projects`
  - `id` (uuid, primary key)
  - `title` (text) - Project title
  - `category` (text) - Project category (e.g., "Web Development", "SEO")
  - `description` (text) - Project description
  - `tags` (text[]) - Array of technology tags
  - `image_url` (text) - Project thumbnail image
  - `is_featured` (boolean) - Whether to show in featured section
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz)

  ### `books`
  - `id` (uuid, primary key)
  - `title` (text) - Book title
  - `subtitle` (text) - Book subtitle
  - `cover_color` (text) - Background color for book cover
  - `year` (text) - Publication year
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz)

  ### `testimonials`
  - `id` (uuid, primary key)
  - `client_name` (text) - Client name
  - `client_role` (text) - Client role/position
  - `client_avatar` (text) - Avatar URL
  - `rating` (integer) - Star rating (1-5)
  - `content` (text) - Testimonial text
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz)

  ### `contact_submissions`
  - `id` (uuid, primary key)
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for projects, books, and testimonials
  - Authenticated write access for contact submissions
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  tags text[] DEFAULT '{}',
  image_url text,
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  cover_color text DEFAULT '#F4B400',
  year text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view books"
  ON books FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_role text NOT NULL,
  client_avatar text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);