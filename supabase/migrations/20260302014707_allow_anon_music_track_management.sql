/*
  # Allow Anonymous Music Track Management
  
  1. Changes
    - Update RLS policies to allow anonymous users to manage music tracks
    - Keep public read access for everyone
    - Allow insert, update, and delete operations for anonymous users
  
  2. Security Notes
    - This is for development/testing purposes
    - In production, these should be restricted to authenticated admin users only
    - The policies currently allow anyone to modify tracks
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can create music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can update music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can delete music tracks" ON music_tracks;

-- Create new policies that allow anonymous access
CREATE POLICY "Anyone can create music tracks"
  ON music_tracks
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update music tracks"
  ON music_tracks
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete music tracks"
  ON music_tracks
  FOR DELETE
  USING (true);
