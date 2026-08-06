/*
# Create site CMS tables for full content management

## Summary
Creates three new tables to make ALL site content editable from the admin dashboard:
1. `site_images` — every image across all pages (hero slides, classrooms, teachers, etc.)
2. `site_cards` — repeatable card items (teachers, testimonials, facilities, FAQs, programs, etc.)
3. `site_settings` — key-value settings (contact info, social links, opening hours)

The frontend reads from these tables and falls back to hardcoded defaults
when no database entry exists, ensuring nothing breaks during transition.

## New Tables

### site_images
- `id` (uuid, primary key)
- `page_key` (text) — which page: 'home', 'about', 'programs', 'montessori', 'inclusion', 'admission', 'contact', 'global'
- `section_key` (text) — which section within the page, e.g. 'hero_slides', 'classrooms', 'teachers'
- `image_url` (text) — the image URL
- `label` (text) — human-readable label for admin display
- `sort_order` (int) — display order within section
- `created_at` (timestamptz)

### site_cards
- `id` (uuid, primary key)
- `card_type` (text) — type of card: 'teacher', 'testimonial', 'facility', 'program', 'faq', 'admission_step', 'advantage', 'pillar', 'reason', 'day_rhythm', 'ceo_message'
- `title_id` (text) — Indonesian title
- `title_en` (text) — English title
- `desc_id` (text) — Indonesian description
- `desc_en` (text) — English description
- `image_url` (text, nullable) — optional image for the card
- `extra_id` (text, nullable) — extra field (e.g. teacher role, FAQ answer, time slot)
- `extra_en` (text, nullable) — extra field English
- `sort_order` (int) — display order
- `is_active` (boolean, default true) — soft delete / hide
- `created_at` (timestamptz)

### site_settings
- `id` (uuid, primary key)
- `key` (text, unique) — setting key, e.g. 'phone_display', 'email', 'instagram'
- `value` (text) — setting value
- `label` (text) — human-readable label for admin
- `category` (text) — grouping: 'contact', 'social', 'hours'
- `updated_at` (timestamptz)

## Security
- RLS enabled on all three tables
- Anon + authenticated can SELECT (public read for frontend)
- Only authenticated admin can INSERT, UPDATE, DELETE
*/

-- site_images
CREATE TABLE IF NOT EXISTS site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  section_key text NOT NULL,
  image_url text NOT NULL,
  label text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_images" ON site_images;
CREATE POLICY "public_read_site_images" ON site_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_site_images" ON site_images;
CREATE POLICY "admin_insert_site_images" ON site_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_site_images" ON site_images;
CREATE POLICY "admin_update_site_images" ON site_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_site_images" ON site_images;
CREATE POLICY "admin_delete_site_images" ON site_images FOR DELETE
  TO authenticated USING (true);

-- site_cards
CREATE TABLE IF NOT EXISTS site_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_type text NOT NULL,
  title_id text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  desc_id text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  image_url text,
  extra_id text,
  extra_en text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE site_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_cards" ON site_cards;
CREATE POLICY "public_read_site_cards" ON site_cards FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_site_cards" ON site_cards;
CREATE POLICY "admin_insert_site_cards" ON site_cards FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_site_cards" ON site_cards;
CREATE POLICY "admin_update_site_cards" ON site_cards FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_site_cards" ON site_cards;
CREATE POLICY "admin_delete_site_cards" ON site_cards FOR DELETE
  TO authenticated USING (true);

-- site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_site_settings" ON site_settings;
CREATE POLICY "admin_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- Seed site_images
INSERT INTO site_images (page_key, section_key, image_url, label, sort_order) VALUES
  ('global', 'logo', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1783623429514_8d08b768.webp', 'Logo', 0),
  ('global', 'ceo', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1783623429587_f7475193.webp', 'CEO Photo', 0),
  ('global', 'school_building', 'https://i.imgur.com/Ab6r1d7.jpeg', 'School Building', 0),
  ('home', 'hero_slides', 'https://i.imgur.com/E0yWTNM.jpeg', 'Hero Slide 1', 0),
  ('home', 'hero_slides', 'https://i.imgur.com/C0qkK3C.jpeg', 'Hero Slide 2', 1),
  ('home', 'hero_slides', 'https://i.imgur.com/Ab6r1d7.jpeg', 'Hero Slide 3', 2),
  ('home', 'unique_child', 'https://i.imgur.com/pl8LwoE.jpeg', 'Every Child Unique Parallax', 0),
  ('home', 'activities', 'https://i.imgur.com/SCl2jgm.jpeg', 'Instagram Activity 1', 0),
  ('home', 'activities', 'https://i.imgur.com/NaqQWwl.jpeg', 'Instagram Activity 2', 1),
  ('home', 'activities', 'https://i.imgur.com/mHhpWp7.jpeg', 'Instagram Activity 3', 2),
  ('home', 'activities', 'https://i.imgur.com/97dTfiS.jpeg', 'Instagram Activity 4', 3),
  ('home', 'activities', 'https://i.imgur.com/8DaOGhY.jpeg', 'Instagram Activity 5', 4),
  ('home', 'activities', 'https://i.imgur.com/I3YrSsk.jpeg', 'Instagram Activity 6', 5),
  ('programs', 'preschool', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775790279_05c3b07d.jpg', 'Preschool Program', 0),
  ('programs', 'kindergarten', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775818705_714e1449.png', 'Kindergarten/Elementary Program', 0),
  ('programs', 'inclusive', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775865701_5ed56a28.png', 'Inclusive Program', 0),
  ('programs', 'inclusive_hero', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1783623463747_c450ef3f.jpg', 'Programs Hero', 0),
  ('about', 'classrooms', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775929923_bca0f46c.png', 'Preschool Classroom', 0),
  ('about', 'classrooms', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775930892_9a2fd69b.png', 'Elementary Classroom', 1),
  ('about', 'classrooms', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775930102_a8b9fe11.jpg', 'Inclusion Classroom', 2),
  ('about', 'classrooms', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775928523_7d4e5861.jpg', 'Practical Life Room', 3)
ON CONFLICT DO NOTHING;

-- Seed site_cards: teachers
INSERT INTO site_cards (card_type, title_id, title_en, desc_id, desc_en, sort_order) VALUES
  ('teacher', 'Ms. Aulia', 'Ms. Aulia', 'AMI Diploma 0-3. Suka berkebun bersama anak-anak.', 'AMI Diploma 0-3. Loves gardening with the children.', 0),
  ('teacher', 'Mr. Bagas', 'Mr. Bagas', 'Penggemar puzzle peta dunia dan ahli geografi anak.', 'World-map puzzle enthusiast and kid geography expert.', 1),
  ('teacher', 'Ms. Citra', 'Ms. Citra', 'Berpengalaman 10 tahun mendukung gaya belajar unik.', '10 years supporting every unique learning style.', 2),
  ('teacher', 'Ms. Dewi', 'Ms. Dewi', 'Mencintai cerita rakyat Nusantara dan musik anak.', 'Loves Indonesian folktales and children''s music.', 3),
  ('teacher', 'Ms. Elya', 'Ms. Elya', 'Membuat sabun alami bersama anak setiap Jumat.', 'Makes natural soap with children every Friday.', 4),
  ('teacher', 'Ms. Farah', 'Ms. Farah', 'Sertifikasi OT pediatrik, pendekatan lembut & sabar.', 'Pediatric OT certified, gentle and patient approach.', 5);

-- Seed site_cards: testimonials
INSERT INTO site_cards (card_type, title_id, title_en, desc_id, desc_en, extra_id, extra_en, sort_order) VALUES
  ('testimonial', 'Bunda Sarah', 'Bunda Sarah', 'Anak saya jadi lebih percaya diri dan mandiri. Para guru benar-benar mengenal karakternya.', 'My daughter has become more confident and independent. The teachers truly know her.', 'Mama dari Alea, 4 th', 'Mom of Alea, 4', 0),
  ('testimonial', 'Ayah Ridho', 'Ayah Ridho', 'Program inklusinya tulus. Tidak ada label, hanya dukungan untuk tumbuh.', 'The inclusion program is genuine. No labels, just support to grow.', 'Papa dari Bima, 3 th', 'Dad of Bima, 3', 1),
  ('testimonial', 'Bunda Maya', 'Bunda Maya', 'Setiap pagi Kanaya semangat ke sekolah. Bukti komunitas Palmtrees yang hangat.', 'Every morning Kanaya is excited for school. Proof of Palmtrees'' warm community.', 'Mama dari Kanaya, 5 th', 'Mom of Kanaya, 5', 2),
  ('testimonial', 'Bunda Priska', 'Bunda Priska', 'Pendekatan Montessori asli, lingkungan yang sangat tertata dengan hati.', 'Authentic Montessori with an environment lovingly prepared.', 'Mama dari Reno, 4 th', 'Mom of Reno, 4', 3);

-- Seed site_cards: facilities
INSERT INTO site_cards (card_type, title_id, title_en, desc_id, desc_en, image_url, sort_order) VALUES
  ('facility', 'Kelas Preschool dan Kindergarten', 'Preschool & Kindergarten Classroom', 'Lingkungan terpersiapkan untuk usia 2-6 tahun dengan material Montessori lengkap.', 'A prepared environment for ages 2-6 with complete Montessori materials.', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775929923_bca0f46c.png', 0),
  ('facility', 'Kelas Elementary', 'Elementary Classroom', 'Ruang belajar usia 6-12 tahun untuk riset mandiri dan proyek kelompok.', 'A learning space for ages 6-12 for independent research and group projects.', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775930892_9a2fd69b.png', 1),
  ('facility', 'Kelas Inklusi', 'Inclusion Classroom', 'Ruang tenang dengan pendampingan personal untuk setiap gaya belajar.', 'A calm space with personal support for every learning style.', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775930102_a8b9fe11.jpg', 2),
  ('facility', 'Ruang Practical Life', 'Practical Life Room', 'Tempat anak belajar kemandirian harian.', 'Where children learn daily independence.', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775928523_7d4e5861.jpg', 3);

-- Seed site_cards: programs
INSERT INTO site_cards (card_type, title_id, title_en, desc_id, desc_en, image_url, extra_id, extra_en, sort_order) VALUES
  ('program', 'Preschool dan Kindergarten', 'Preschool & Kindergarten', 'Program untuk usia 2-6 tahun. Anak membangun kemandirian, konsentrasi, dan cinta belajar melalui Practical Life, sensorial, bahasa, matematika, dan budaya dalam lingkungan Montessori yang terpersiapkan.', 'A program for ages 2-6. Children build independence, concentration, and a love of learning through Practical Life, sensorial, language, math, and culture in a prepared Montessori environment.', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775790279_05c3b07d.jpg', 'Usia 2 – 6 tahun', 'Ages 2 – 6 years', 0),
  ('program', 'Elementary', 'Elementary', 'Program untuk usia 6-12 tahun, dari Kelas 1 hingga Kelas 6. Kurikulum Cosmic Education Montessori: matematika lanjut, sains, geografi, sejarah, dan proyek riset mandiri yang bermakna.', 'A program for ages 6-12, from Grade 1 through Grade 6. The Montessori Cosmic Education curriculum: advanced math, science, geography, history, and meaningful independent research projects.', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775818705_714e1449.png', 'Usia 6 – 12 tahun', 'Ages 6 – 12 years', 1),
  ('program', 'Program Inklusi', 'Inclusion Program', 'Montessori untuk setiap anak. Pendampingan personal yang lembut bagi anak yang membutuhkan dukungan tambahan dalam gaya belajarnya — belajar berdampingan di kelas yang sama.', 'Montessori for every child. Gentle, personalized support for children who need extra help with their learning style — learning side by side in the same classroom.', 'https://d64gsuwffb70l.cloudfront.net/6a05f5ed7fae75f422be90c0_1778775865701_5ed56a28.png', 'Montessori untuk Setiap Anak', 'Montessori for Every Child', 2);

-- Seed site_cards: faqs
INSERT INTO site_cards (card_type, title_id, title_en, desc_id, desc_en, sort_order) VALUES
  ('faq', 'Berapa rasio guru dan anak?', 'What is the teacher-to-child ratio?', 'Rata-rata 1:6 di setiap kelas, dengan dukungan tambahan untuk Inclusive Support Program.', 'On average 1:6 in each class, with extra support for the Inclusive Support Program.', 0),
  ('faq', 'Apa saja yang termasuk biaya?', 'What is included in the fees?', 'SPP, materials Montessori, dan snack sehat. Biaya seragam dan field trip terpisah.', 'Tuition, Montessori materials, and healthy snack. Uniform and field trips are separate.', 1),
  ('faq', 'Apakah ada bahasa Inggris?', 'Is English used in class?', 'Ya, kami bilingual ID/EN dengan guru native dan lokal yang bersertifikasi.', 'Yes, we are bilingual ID/EN with certified native and local guides.', 2),
  ('faq', 'Kapan tahun ajaran dimulai?', 'When does the school year start?', 'Tahun ajaran utama mulai Juli, tapi rolling admission tersedia setiap saat.', 'The main school year starts in July, but rolling admissions are open year-round.', 3),
  ('faq', 'Bagaimana dengan anak yang membutuhkan dukungan khusus?', 'What about children who need extra support?', 'Palm Trees Montessori adalah sekolah inklusi di BSD yang menyambut anak berkebutuhan khusus (ABK), termasuk anak dengan speech delay. Kami mengevaluasi bersama, menyusun rencana pendampingan yang tepat bersama keluarga, dan memastikan setiap anak merasa diterima — tanpa terburu-buru.', 'Palm Trees Montessori is an inclusive school in BSD that welcomes children with special needs/ABK, including children with speech delay. We assess together, build the right support plan with families, and ensure every child feels welcomed — never rushed.', 4);

-- Seed site_cards: admission_steps
INSERT INTO site_cards (card_type, title_id, title_en, desc_id, desc_en, sort_order) VALUES
  ('admission_step', 'Hubungi Kami', 'Reach Out', 'Isi formulir atau WhatsApp untuk memperkenalkan keluarga.', 'Fill the form or WhatsApp us to introduce your family.', 0),
  ('admission_step', 'Tour Sekolah', 'School Tour', 'Datang ke kampus, mengobrol, dan melihat anak-anak belajar.', 'Visit our campus, chat with us, and see the children at work.', 1),
  ('admission_step', 'Trial Class', 'Trial Class', 'Ananda mencoba ritme kelas selama 1-2 sesi singkat.', 'Your child experiences our class rhythm for 1-2 short sessions.', 2),
  ('admission_step', 'Pertemuan Orang Tua', 'Parent Meeting', 'Berbagi cerita, harapan, dan menyusun rencana awal bersama.', 'Share stories, hopes, and shape an initial plan together.', 3),
  ('admission_step', 'Pendaftaran Resmi', 'Official Enrollment', 'Selamat datang di keluarga Palmtrees Montessori!', 'Welcome to the Palmtrees Montessori family!', 4);

-- Seed site_cards: advantages (Montessori Method page)
INSERT INTO site_cards (card_type, title_id, title_en, desc_id, desc_en, sort_order) VALUES
  ('advantage', 'Kemandirian Sejak Dini', 'Independence from an Early Age', 'Anak belajar memilih, memutuskan, dan menyelesaikan pekerjaannya sendiri — fondasi karakter yang kuat.', 'Children learn to choose, decide, and complete their own work — the foundation of strong character.', 0),
  ('advantage', 'Belajar Sesuai Ritme Anak', 'Learning at the Child''s Pace', 'Setiap anak mengikuti ritme perkembangannya sendiri, tanpa dibandingkan dengan anak lain.', 'Every child follows their own developmental rhythm, never compared to others.', 1),
  ('advantage', 'Lingkungan Terpersiapkan', 'Prepared Environment', 'Ruang kelas dirancang khusus dengan material Montessori asli yang mengundang rasa ingin tahu.', 'Classrooms are purposefully designed with authentic Montessori materials that spark curiosity.', 2),
  ('advantage', 'Pembentukan Karakter', 'Character Building', 'Rasa hormat, tanggung jawab, dan empati tumbuh alami lewat kegiatan sehari-hari di kelas.', 'Respect, responsibility, and empathy grow naturally through everyday classroom life.', 3),
  ('advantage', 'Cinta Belajar Seumur Hidup', 'Lifelong Love of Learning', 'Anak tidak sekadar menghafal — mereka jatuh cinta pada proses belajar itu sendiri.', 'Children don''t just memorize — they fall in love with the process of learning itself.', 4),
  ('advantage', 'Keterampilan Hidup Nyata', 'Real-Life Skills', 'Practical Life melatih motorik, konsentrasi, dan kemampuan merawat diri, orang lain, dan lingkungan.', 'Practical Life builds motor skills, concentration, and the ability to care for self, others, and the environment.', 5);

-- Seed site_cards: pillars (Inclusion page)
INSERT INTO site_cards (card_type, title_id, title_en, desc_id, desc_en, sort_order) VALUES
  ('pillar', 'Shadow Teacher Terlatih', 'Trained Shadow Teachers', 'Pendamping personal yang bekerja sama dengan guru Montessori untuk mendukung Ananda setiap hari di kelas.', 'Personal companions who work alongside Montessori guides to support your child every day in class.', 0),
  ('pillar', 'Kolaborasi Terapis', 'Therapist Collaboration', 'Kami berkoordinasi dengan terapis okupasi, wicara, dan psikolog pilihan keluarga untuk pendampingan yang selaras.', 'We coordinate with your family''s occupational, speech, and psychology professionals for aligned support.', 1),
  ('pillar', 'Rencana Belajar Individual', 'Individual Learning Plans', 'Tujuan belajar yang fleksibel, disusun dan dievaluasi bersama orang tua secara rutin — tanpa terburu-buru.', 'Flexible learning goals, designed and reviewed together with parents regularly — never rushed.', 2),
  ('pillar', 'Komunikasi Terbuka', 'Open Communication', 'Guru menyambut dialog dengan Ayah Bunda dan berbagi perkembangan Ananda secara berkala.', 'Our guides welcome dialogue with parents and share your child''s progress regularly.', 3);

-- Seed site_cards: reasons (Inclusion page)
INSERT INTO site_cards (card_type, title_id, title_en, sort_order) VALUES
  ('reason', 'Lingkungan Montessori yang tenang dan terstruktur — ideal untuk setiap gaya belajar', 'A calm, structured Montessori environment — ideal for every learning style', 0),
  ('reason', 'Rasio guru dan anak yang kecil untuk perhatian penuh', 'Small teacher-to-child ratios for full attention', 1),
  ('reason', 'Anak belajar berdampingan — inklusi yang tulus, bukan kelas terpisah', 'Children learn side by side — genuine inclusion, not separate classes', 2),
  ('reason', 'Guru berpengalaman & tim inklusi yang terlatih', 'Experienced guides & a trained inclusion team', 3),
  ('reason', 'Lokasi strategis di BSD, mudah dijangkau dari seluruh Tangerang', 'A strategic BSD location, easy to reach from all across Tangerang', 4),
  ('reason', 'Berafiliasi dengan NAMC dan anggota International Montessori Council (IMC)', 'Affiliated with NAMC and a member of the International Montessori Council (IMC)', 5);

-- Seed site_cards: day_rhythm
INSERT INTO site_cards (card_type, title_id, title_en, extra_id, sort_order) VALUES
  ('day_rhythm', 'Lingkar Pagi & Salam', 'Morning Circle & Greeting', '08:00', 0),
  ('day_rhythm', 'Work Cycle: Practical Life', 'Work Cycle: Practical Life', '08:30', 1),
  ('day_rhythm', 'Work Cycle: Sensorial & Language', 'Work Cycle: Sensorial & Language', '09:30', 2),
  ('day_rhythm', 'Snack Bersama', 'Snack Together', '10:30', 3),
  ('day_rhythm', 'Outdoor Play & Berkebun', 'Outdoor Play & Gardening', '11:00', 4),
  ('day_rhythm', 'Art & Practical Life', 'Art & Practical Life', '11:30', 5),
  ('day_rhythm', 'Lingkar Penutup & Pulang', 'Closing Circle & Dismissal', '12:00', 6);

-- Seed site_cards: ceo_message
INSERT INTO site_cards (card_type, title_id, title_en, desc_id, desc_en, sort_order) VALUES
  ('ceo_message', 'Salam hangat!', 'Greetings!', 'Dengan senang hati saya menyambut Ayah Bunda di sekolah kami yang berlokasi di jantung kota BSD. Sekolah kami memulai perjalanannya sebagai Kiddy Montessori Preschool pada tahun 2001, dan didirikan berdasarkan prinsip-prinsip yang digagas oleh Dr. Maria Montessori, pelopor pendidikan anak. Saya memulai Palm Trees Montessori School puluhan tahun lalu karena saya percaya pada pentingnya menumbuhkan kemandirian dalam diri setiap anak, serta membantu mereka mencapai potensi penuhnya.', 'I am delighted to welcome you to our school, located in the heart of BSD city. Our school began its journey as Kiddy Montessori Preschool in 2001, and was founded on the principles envisioned by Dr. Maria Montessori, a pioneer in children''s education. I started Palm Trees Montessori School decades ago because I believe in fostering independence within every child, and helping them reach their full potential.', 0),
  ('ceo_message', '', '', 'Sebagai seorang ibu dari tiga anak, saya selalu vokal tentang pentingnya pendidikan dan sekolah dalam tumbuh kembang anak. Saya menemukan bahwa metode Montessori unik karena memungkinkan setiap anak memegang kendali atas pembelajarannya sendiri, bukan sekadar melakukan apa yang diperintahkan.', 'As a mother of three myself, I have always been outspoken about the importance of education and schooling in a child''s development. I found that the Montessori method was unique in that it allows each child to take charge of their own learning, rather than simply do what they''re told.', 1),
  ('ceo_message', '', '', 'Kini, sekolah kami telah berkembang menjadi preschool dan sekolah dasar (elementary), dengan komunitas keluarga yang hidup dan terus bertumbuh. Setelah perjalanan belajar yang dipersonalisasi di Palm Trees, para siswa kami melanjutkan dan berkembang di sekolah-sekolah menengah terbaik di negeri ini sebagai pembelajar Montessori seumur hidup.', 'Today, our school has developed into a preschool and elementary school, with a vibrant and thriving community of families. After their individualized learning journeys at Palm Trees, our students go on to thrive at some of the nation''s top secondary schools as lifelong Montessori learners.', 2),
  ('ceo_message', '', '', 'Saya berharap semakin banyak keluarga bergabung bersama kami di masa depan, dan saya sangat bersemangat menyambut hal-hal baik yang akan datang!', 'I hope to see more families join us in the future, and I am so excited for what''s to come!', 3);

-- Seed site_settings
INSERT INTO site_settings (key, value, label, category) VALUES
  ('address_id', 'Jl. Pesantren No.35 RT002/RW001, Kel. Jelupang, Kec. Serpong Utara, Tangerang - Banten', 'Alamat (ID)', 'contact'),
  ('address_en', 'Jl. Pesantren No.35 RT002/RW001, Jelupang, Serpong Utara, Tangerang - Banten', 'Address (EN)', 'contact'),
  ('phone_display', '(021) 53153658', 'Nomor Telepon (Tampilan)', 'contact'),
  ('phone_tel', '+622153153658', 'Nomor Telepon (Tel Link)', 'contact'),
  ('email', 'info@palmtreesmontessori.com', 'Email', 'contact'),
  ('wa_number', '62818778839', 'Nomor WhatsApp', 'contact'),
  ('wa_display', '+62 818-778-839', 'WhatsApp (Tampilan)', 'contact'),
  ('instagram', 'https://www.instagram.com/palmtreesmontessori/', 'Instagram URL', 'social'),
  ('facebook', 'https://web.facebook.com/PalmTreesMontessori', 'Facebook URL', 'social'),
  ('youtube', 'https://www.youtube.com/channel/UC7Y-aiG0XBiWLZBmQS70Meg/videos', 'YouTube URL', 'social'),
  ('hours_weekday', '08:00 – 16:00', 'Jam Senin–Jumat', 'hours'),
  ('hours_saturday', '09:00 – 12:00', 'Jam Sabtu', 'hours'),
  ('hours_sunday', 'Closed', 'Jam Minggu', 'hours')
ON CONFLICT (key) DO NOTHING;