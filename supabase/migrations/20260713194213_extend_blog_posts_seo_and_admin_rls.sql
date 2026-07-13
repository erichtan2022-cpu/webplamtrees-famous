/*
# Extend blog_posts with SEO fields and add admin RLS policies

## Summary
Adds per-article SEO control fields and gives authenticated admin users full CRUD access.
Previously all admin writes went through an edge function using the service-role key.
Now admin uses Supabase Auth (email/password) so writes come from an authenticated client.

## Modified Tables
- `blog_posts`
  - `meta_title` (text) — per-article page title override (for SEO)
  - `meta_description` (text, max 160 chars enforced by UI) — per-article meta description
  - `meta_keywords` (text) — comma-separated keyword list

## Security Changes
- Added 4 authenticated-only policies for admin full CRUD (select/insert/update/delete)
- The existing public SELECT policy (anon/authenticated, published only) is preserved
- Authenticated admin can see ALL posts including drafts (no is_published filter)
*/

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS meta_title text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_keywords text NOT NULL DEFAULT '';

-- Admin full access (authenticated = logged in via Supabase Auth)
DROP POLICY IF EXISTS "admin_select_blog_posts" ON blog_posts;
CREATE POLICY "admin_select_blog_posts" ON blog_posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_blog_posts" ON blog_posts;
CREATE POLICY "admin_insert_blog_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_blog_posts" ON blog_posts;
CREATE POLICY "admin_update_blog_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_blog_posts" ON blog_posts;
CREATE POLICY "admin_delete_blog_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);
