/*
  # Create Music Albums Table

  1. New Tables
    - `music_albums`
      - `id` (uuid, primary key) - Unique identifier for each album
      - `title` (text, not null) - Album title
      - `cover_image_url` (text) - URL to album cover image
      - `spotify_url` (text) - Spotify link
      - `apple_music_url` (text) - Apple Music link
      - `youtube_music_url` (text) - YouTube Music link
      - `display_order` (integer, default 0) - Custom ordering
      - `created_at` (timestamptz, default now()) - Creation timestamp
      - `updated_at` (timestamptz, default now()) - Last update timestamp

  2. Storage
    - Create `album-covers` bucket for album cover images
    - Enable public read access
    - Allow authenticated users to upload/update

  3. Security
    - Enable RLS on `music_albums` table
    - Add policy for public read access
    - Add policies for authenticated users to manage albums

  4. Indexes
    - Index on `display_order` for efficient sorting
*/

-- Create albums table
CREATE TABLE IF NOT EXISTS music_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  cover_image_url text DEFAULT '',
  spotify_url text DEFAULT '',
  apple_music_url text DEFAULT '',
  youtube_music_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE music_albums ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Music albums are viewable by everyone"
  ON music_albums
  FOR SELECT
  USING (true);

-- Authenticated users can insert albums
CREATE POLICY "Authenticated users can create music albums"
  ON music_albums
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update albums
CREATE POLICY "Authenticated users can update music albums"
  ON music_albums
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete albums
CREATE POLICY "Authenticated users can delete music albums"
  ON music_albums
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for album covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('album-covers', 'album-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to album covers
CREATE POLICY "Album covers are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'album-covers');

-- Allow authenticated users to upload album covers
CREATE POLICY "Authenticated users can upload album covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'album-covers');

-- Allow authenticated users to update album covers
CREATE POLICY "Authenticated users can update album covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'album-covers')
  WITH CHECK (bucket_id = 'album-covers');

-- Allow authenticated users to delete album covers
CREATE POLICY "Authenticated users can delete album covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'album-covers');

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_music_albums_display_order ON music_albums(display_order);
CREATE INDEX IF NOT EXISTS idx_music_albums_created_at ON music_albums(created_at DESC);