import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_url: string | null;
  is_featured: boolean;
  order_index: number;
  created_at: string;
  view_type: 'case_study' | 'gallery' | 'external_link';
  external_link: string | null;
  case_study_hero_description: string | null;
  impact_metrics: Array<{ label: string; value: string }>;
  challenge_title: string | null;
  challenge_description: string | null;
  challenge_points: string[];
  solution_title: string | null;
  solution_description: string | null;
  solution_points: string[];
  before_image: string | null;
  after_image: string | null;
  before_points: string[];
  after_points: string[];
  strategic_approach: Array<{ icon: string; title: string; description: string }>;
  project_process: Array<{ phase: string; title: string; description: string }>;
  testimonial_id: string | null;
  gallery_images: string[];
  cta_title: string | null;
  cta_description: string | null;
};

export type Book = {
  id: string;
  title: string;
  subtitle: string | null;
  cover_color: string;
  cover_image_vertical: string | null;
  cover_image_horizontal: string | null;
  featured_image: string | null;
  show_on_homepage: boolean;
  year: string | null;
  category: string | null;
  description: string | null;
  icon: string | null;
  format: string | null;
  audience: string | null;
  amazon_link: string | null;
  sample_link: string | null;
  is_featured: boolean;
  tag: string | null;
  order_index: number;
  created_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  client_role: string;
  client_avatar: string | null;
  rating: number;
  content: string;
  order_index: number;
  created_at: string;
};

export type Resource = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string | null;
  category: 'course' | 'pdf' | 'quiz' | 'app' | 'paid';
  thumbnail_url: string | null;
  component_path: string | null;
  pdf_url: string | null;
  external_url: string | null;
  is_free: boolean;
  price: number;
  is_published: boolean;
  is_featured: boolean;
  order_index: number;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};
