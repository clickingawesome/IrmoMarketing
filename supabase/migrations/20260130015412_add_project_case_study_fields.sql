/*
  # Add Project Case Study and Gallery Fields

  1. Changes to projects table
    - Add `view_type` (text): Controls whether project opens case study or gallery ('case_study' or 'gallery')
    - Add `case_study_hero_description` (text): Extended description for case study hero
    - Add `impact_metrics` (jsonb): Array of impact metrics with label and value
    - Add `challenge_title` (text): Title for challenge section
    - Add `challenge_description` (text): Description of the challenge
    - Add `challenge_points` (jsonb): Array of challenge bullet points
    - Add `solution_title` (text): Title for solution section
    - Add `solution_description` (text): Description of the solution
    - Add `solution_points` (jsonb): Array of solution bullet points
    - Add `before_image` (text): URL for before image
    - Add `after_image` (text): URL for after image
    - Add `before_points` (jsonb): Array of points for before state
    - Add `after_points` (jsonb): Array of points for after state
    - Add `strategic_approach` (jsonb): Array of strategy cards with icon, title, description
    - Add `project_process` (jsonb): Array of process steps with phase, title, description
    - Add `testimonial_id` (uuid): Optional reference to testimonial
    - Add `gallery_images` (jsonb): Array of image URLs for gallery view
    - Add `cta_title` (text): Call to action title
    - Add `cta_description` (text): Call to action description
    
  2. Security
    - All new fields are updatable
    - Existing RLS policies remain in effect
*/

DO $$
BEGIN
  -- Add view_type field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'view_type'
  ) THEN
    ALTER TABLE projects ADD COLUMN view_type text DEFAULT 'case_study';
  END IF;

  -- Add case study hero fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'case_study_hero_description'
  ) THEN
    ALTER TABLE projects ADD COLUMN case_study_hero_description text;
  END IF;

  -- Add impact metrics
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'impact_metrics'
  ) THEN
    ALTER TABLE projects ADD COLUMN impact_metrics jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add challenge section fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'challenge_title'
  ) THEN
    ALTER TABLE projects ADD COLUMN challenge_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'challenge_description'
  ) THEN
    ALTER TABLE projects ADD COLUMN challenge_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'challenge_points'
  ) THEN
    ALTER TABLE projects ADD COLUMN challenge_points jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add solution section fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'solution_title'
  ) THEN
    ALTER TABLE projects ADD COLUMN solution_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'solution_description'
  ) THEN
    ALTER TABLE projects ADD COLUMN solution_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'solution_points'
  ) THEN
    ALTER TABLE projects ADD COLUMN solution_points jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add before/after fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'before_image'
  ) THEN
    ALTER TABLE projects ADD COLUMN before_image text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'after_image'
  ) THEN
    ALTER TABLE projects ADD COLUMN after_image text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'before_points'
  ) THEN
    ALTER TABLE projects ADD COLUMN before_points jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'after_points'
  ) THEN
    ALTER TABLE projects ADD COLUMN after_points jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add strategic approach
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'strategic_approach'
  ) THEN
    ALTER TABLE projects ADD COLUMN strategic_approach jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add project process
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'project_process'
  ) THEN
    ALTER TABLE projects ADD COLUMN project_process jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add testimonial reference
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'testimonial_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN testimonial_id uuid;
  END IF;

  -- Add gallery images
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'gallery_images'
  ) THEN
    ALTER TABLE projects ADD COLUMN gallery_images jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add CTA fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'cta_title'
  ) THEN
    ALTER TABLE projects ADD COLUMN cta_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'cta_description'
  ) THEN
    ALTER TABLE projects ADD COLUMN cta_description text;
  END IF;
END $$;
