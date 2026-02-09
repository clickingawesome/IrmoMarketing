/*
  # Create Lead Captures Table

  1. New Tables
    - `lead_captures`
      - `id` (uuid, primary key) - Unique identifier for each lead
      - `name` (text, required) - Lead's full name
      - `email` (text, required) - Lead's email address
      - `company` (text, optional) - Lead's company name
      - `resource_slug` (text, required) - Which resource they accessed
      - `resource_title` (text, required) - Title of the resource
      - `created_at` (timestamptz) - When the lead was captured
      - `user_agent` (text, optional) - Browser/device information
      - `referrer` (text, optional) - Where they came from

  2. Security
    - Enable RLS on `lead_captures` table
    - Add policy for anonymous users to insert their own data
    - Only authenticated admins can read all lead data

  3. Indexes
    - Index on email for quick lookups
    - Index on resource_slug for filtering by resource
    - Index on created_at for sorting by date
*/

-- Create lead_captures table
CREATE TABLE IF NOT EXISTS lead_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  resource_slug text NOT NULL,
  resource_title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_agent text,
  referrer text
);

-- Enable Row Level Security
ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their own lead capture data
CREATE POLICY "Anyone can submit lead capture"
  ON lead_captures
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admins can read all leads
CREATE POLICY "Admins can view all leads"
  ON lead_captures
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON lead_captures(email);
CREATE INDEX IF NOT EXISTS idx_lead_captures_resource_slug ON lead_captures(resource_slug);
CREATE INDEX IF NOT EXISTS idx_lead_captures_created_at ON lead_captures(created_at DESC);
