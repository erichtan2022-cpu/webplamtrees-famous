/*
# Create blog_posts table

## Summary
Creates the blog_posts table for Palmtrees Montessori's bilingual blog system.
All admin writes are handled server-side via an edge function with the service role key,
so only a public SELECT policy is needed for the anon-key frontend client.

## New Tables
- `blog_posts`
  - `id` (uuid, primary key)
  - `slug` (text, unique, URL-friendly identifier)
  - `title_id` (text, Indonesian title)
  - `title_en` (text, English title)
  - `excerpt_id` (text, Indonesian excerpt)
  - `excerpt_en` (text, English excerpt)
  - `body_id` (text, Indonesian body, Markdown)
  - `body_en` (text, English body, Markdown)
  - `category` (text, one of: Tips Parenting, Inklusi, Kegiatan Anak)
  - `featured_image` (text, URL)
  - `author` (text)
  - `is_published` (boolean, default true)
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

## Security
- RLS enabled.
- Anon + authenticated users can SELECT rows where is_published = true (public blog).
- No direct INSERT/UPDATE/DELETE from the frontend — all admin mutations go through
  the blog-admin edge function which uses the service role key (bypasses RLS).
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_id text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  excerpt_id text NOT NULL DEFAULT '',
  excerpt_en text NOT NULL DEFAULT '',
  body_id text NOT NULL DEFAULT '',
  body_en text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Tips Parenting',
  featured_image text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'Tim Palmtrees',
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published" ON blog_posts;
CREATE POLICY "public_read_published" ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts (published_at DESC);
