/*
  # Create Music Tracks Table

  1. New Tables
    - `music_tracks`
      - `id` (uuid, primary key) - Unique identifier for each track
      - `youtube_url` (text, not null) - Full YouTube URL
      - `youtube_id` (text, not null) - Extracted YouTube video ID
      - `title` (text, not null) - Track title
      - `description` (text) - Track description
      - `thumbnail_url` (text) - YouTube thumbnail URL
      - `is_featured` (boolean, default false) - Whether track is featured
      - `display_order` (integer, default 0) - Custom ordering
      - `created_at` (timestamptz, default now()) - Creation timestamp
      - `updated_at` (timestamptz, default now()) - Last update timestamp

  2. Security
    - Enable RLS on `music_tracks` table
    - Add policy for public read access (anyone can view tracks)
    - Add policy for authenticated users to manage tracks (admin only in future)

  3. Indexes
    - Index on `display_order` for efficient sorting
    - Index on `is_featured` for filtering featured tracks
*/

CREATE TABLE IF NOT EXISTS music_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_url text NOT NULL,
  youtube_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

-- Public read access - anyone can view music tracks
CREATE POLICY "Music tracks are viewable by everyone"
  ON music_tracks
  FOR SELECT
  USING (true);

-- Authenticated users can insert tracks
CREATE POLICY "Authenticated users can create music tracks"
  ON music_tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update tracks
CREATE POLICY "Authenticated users can update music tracks"
  ON music_tracks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete tracks
CREATE POLICY "Authenticated users can delete music tracks"
  ON music_tracks
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_music_tracks_display_order ON music_tracks(display_order);
CREATE INDEX IF NOT EXISTS idx_music_tracks_featured ON music_tracks(is_featured);
CREATE INDEX IF NOT EXISTS idx_music_tracks_created_at ON music_tracks(created_at DESC);