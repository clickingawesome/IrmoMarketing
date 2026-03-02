/*
  # Drop unused indexes

  1. Changes
    - Remove indexes that have never been used according to database statistics
    - This reduces storage overhead and speeds up writes

  2. Dropped Indexes
    - idx_resources_category (resources table)
    - idx_resources_published (resources table)
    - idx_lead_captures_email (lead_captures table)
    - idx_lead_captures_resource_slug (lead_captures table)
    - idx_lead_captures_created_at (lead_captures table)
    - idx_music_tracks_featured (music_tracks table)
    - idx_music_tracks_created_at (music_tracks table)
    - idx_music_albums_created_at (music_albums table)
    - idx_admins_created_by (admins table)
*/

DROP INDEX IF EXISTS idx_resources_category;
DROP INDEX IF EXISTS idx_resources_published;
DROP INDEX IF EXISTS idx_lead_captures_email;
DROP INDEX IF EXISTS idx_lead_captures_resource_slug;
DROP INDEX IF EXISTS idx_lead_captures_created_at;
DROP INDEX IF EXISTS idx_music_tracks_featured;
DROP INDEX IF EXISTS idx_music_tracks_created_at;
DROP INDEX IF EXISTS idx_music_albums_created_at;
DROP INDEX IF EXISTS idx_admins_created_by;
