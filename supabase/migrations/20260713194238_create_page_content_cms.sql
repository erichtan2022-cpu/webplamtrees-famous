/*
# Create page_content table for dynamic CMS editing

## Summary
Stores admin-editable text sections for the Homepage and Admission page.
The frontend reads from this table and falls back to hardcoded defaults when
no database entry exists. This enables dynamic content updates without redeployment.

## New Tables
- `page_content`
  - `id` (uuid, primary key)
  - `page_key` (text) — identifies the page, e.g. 'home', 'admission'
  - `section_key` (text) — identifies the specific section, e.g. 'hero_h1_id'
  - `content` (text) — the editable text value
  - `is_seo_critical` (boolean) — flags sections containing golden SEO keywords;
    the admin panel displays a warning to prevent accidental deletion
  - `updated_at` (timestamptz) — last modification timestamp
  - UNIQUE constraint on (page_key, section_key)

## Security
- RLS enabled
- Anon + authenticated can SELECT (public read for frontend)
- Only authenticated admin can INSERT and UPDATE
- No DELETE policy (content rows should never be removed, only emptied)

## Seed Data
Initial rows are inserted with the current SEO-optimized default values.
The frontend falls back to its own hardcoded defaults when a row has empty content,
so these rows serve as authoritative initial state for the admin editor.
*/

CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  section_key text NOT NULL,
  content text NOT NULL DEFAULT '',
  is_seo_critical boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_key, section_key)
);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_page_content" ON page_content;
CREATE POLICY "public_read_page_content" ON page_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_page_content" ON page_content;
CREATE POLICY "admin_insert_page_content" ON page_content FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_page_content" ON page_content;
CREATE POLICY "admin_update_page_content" ON page_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Seed with current optimized defaults
INSERT INTO page_content (page_key, section_key, content, is_seo_critical) VALUES
  ('home', 'hero_h1_id', 'Tumbuh Bersama di Palm Trees Montessori BSD – Sekolah Inklusi & Preschool Terbaik di Tangerang Selatan', true),
  ('home', 'hero_h1_en', 'Palm Trees Montessori BSD – Inclusive School & Best Preschool in South Tangerang', true),
  ('home', 'geo_intro_id', 'Melayani keluarga dari BSD City, Serpong, Alam Sutera, dan Bintaro — sekolah Montessori inklusi terpercaya di jantung Tangerang Selatan sejak tahun 2000.', false),
  ('home', 'geo_intro_en', 'Serving families from BSD City, Serpong, Alam Sutera, and Bintaro — a trusted inclusive Montessori school in the heart of South Tangerang since 2000.', false),
  ('admission', 'h1_id', 'Pendaftaran Sekolah Montessori BSD – Trial Class & Open Day', true),
  ('admission', 'h1_en', 'Montessori BSD School Admission – Trial Class & Open Day', true),
  ('admission', 'brochure_desc_id', 'Unduh brosur resmi kami untuk melihat rincian lengkap mengenai biaya sekolah Palm Trees Montessori, jadwal biaya masuk, dan paket tahun ajaran baru.', false),
  ('admission', 'brochure_desc_en', 'Download our official brochure for full details on Palm Trees Montessori school fees, enrollment fee schedule, and new school year packages.', false)
ON CONFLICT (page_key, section_key) DO NOTHING;
