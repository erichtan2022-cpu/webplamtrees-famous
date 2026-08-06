/*
# Expand page_content with text fields for all pages

## Summary
Adds text content entries for About, Programs, Montessori Method, Inclusion,
and Contact pages so they can be edited from the admin Page Editor.
Also adds additional Home page section texts.

## New Rows
- About: hero_h1, intro_paragraph
- Programs: hero_h1, hero_subtitle, inclusive_section_title, inclusive_section_desc
- Montessori: hero_h1, hero_subtitle, philosophy_title, philosophy_desc, advantages_title, advantages_subtitle
- Inclusion: hero_h1, hero_subtitle, seo_intro_title, pillars_title, pillars_subtitle, reasons_title
- Contact: hero_h1, hero_subtitle
- Home: why_title, why_subtitle, programs_title, testimonials_title, instagram_title, instagram_subtitle, cta_title, cta_desc

## Security
No security changes — uses existing page_content RLS policies.
*/

INSERT INTO page_content (page_key, section_key, content, is_seo_critical) VALUES
  -- Home additional
  ('home', 'why_title_id', 'Tempat Anak Tumbuh dengan Hati', false),
  ('home', 'why_title_en', 'Where Children Grow with Heart', false),
  ('home', 'why_subtitle_id', 'Tiga pilar yang menjadi fondasi setiap hari di kelas kami.', false),
  ('home', 'why_subtitle_en', 'Three pillars that ground every day in our classrooms.', false),
  ('home', 'programs_title_id', 'Dari Preschool hingga Elementary', false),
  ('home', 'programs_title_en', 'From Preschool to Elementary', false),
  ('home', 'testimonials_title_id', 'Testimoni Keluarga Palmtrees', false),
  ('home', 'testimonials_title_en', 'Palmtrees Family Stories', false),
  ('home', 'instagram_title', '@palmtreesmontessori', false),
  ('home', 'instagram_subtitle_id', 'Ikuti keseharian kami di Instagram. Cerita kecil yang penuh makna.', false),
  ('home', 'instagram_subtitle_en', 'Follow our daily life on Instagram. Small stories, big meaning.', false),
  ('home', 'cta_title_id', 'Mau melihat sekolah kami langsung?', false),
  ('home', 'cta_title_en', 'Want to see our school in person?', false),
  ('home', 'cta_desc_id', 'Jadwalkan kunjungan dan rasakan suasana kelas Palmtrees bersama keluarga.', false),
  ('home', 'cta_desc_en', 'Schedule a visit and feel the Palmtrees classroom atmosphere with your family.', false),

  -- About
  ('about', 'hero_h1', 'Palm Trees Montessori School', false),
  ('about', 'hero_subtitle_id', 'Sekolah swasta untuk anak usia 2 hingga 12 tahun di jantung kota BSD.', false),
  ('about', 'hero_subtitle_en', 'A private school for children aged 2 to 12 in the heart of BSD city.', false),
  ('about', 'intro_paragraph_id', 'Palm Trees Montessori School adalah sekolah swasta untuk anak usia 2 hingga 12 tahun, dari Prasekolah hingga Kelas 6. Sekolah ini berdiri pada tahun 2000, dan didirikan oleh PT. Citra Anak Mandiri. Bangunan gedung dirancang untuk memenuhi kebutuhan anak-anak yang belajar di lingkungan Montessori. Palm Trees Montessori berafiliasi dengan North American Montessori Center (NAMC) dan anggota International Montessori Council (IMC). Kelas-kelas dipimpin oleh guru Montessori berpengalaman dan Sekolah memberikan prioritas lebih tinggi kepada orang tua dan guru terkait kinerja anak. Guru mengharapkan dan menyambut dialog dengan orang tua. Sekolah menawarkan kesempatan yang sama bagi semua orang dan tidak diskriminatif.', false),
  ('about', 'intro_paragraph_en', 'Palm Trees Montessori School is a private school for children aged 2 to 12, from Preschool through Grade 6. The school was established in 2000 and founded by PT. Citra Anak Mandiri. The building was designed to meet the needs of children learning in a Montessori environment. Palm Trees Montessori is affiliated with the North American Montessori Center (NAMC) and is a member of the International Montessori Council (IMC). Classes are led by experienced Montessori teachers, and the school places a high priority on parents and teachers regarding each child''s progress. Teachers expect and welcome dialogue with parents. The school offers equal opportunity for everyone and is non-discriminatory.', false),
  ('about', 'values_title_id', 'Visi, Misi & Nilai Kami', false),
  ('about', 'values_title_en', 'Our Vision, Mission & Values', false),
  ('about', 'values_subtitle_id', 'Setiap pilar di Palmtrees lahir dari satu keyakinan: anak-anak akan tumbuh saat mereka merasa dilihat.', false),
  ('about', 'values_subtitle_en', 'Every pillar at Palmtrees was born from one belief: children flourish when they feel seen.', false),
  ('about', 'facilities_title_id', 'Fasilitas Kami', false),
  ('about', 'facilities_title_en', 'Our Facilities', false),
  ('about', 'facilities_subtitle_id', 'Pilih ruangan di bawah untuk melihat detailnya.', false),
  ('about', 'facilities_subtitle_en', 'Pick a room below to see the details.', false),

  -- Programs
  ('programs', 'hero_h1_id', 'Kelas di Palmtrees Montessori', true),
  ('programs', 'hero_h1_en', 'Classes at Palmtrees Montessori', true),
  ('programs', 'hero_subtitle_id', 'Palm Trees Montessori BSD menyediakan program Preschool dan Kindergarten (2-6 tahun), Program Elementary (6-12 tahun) yang dirancang sesuai tahap perkembangan anak dan Program Inklusi.', false),
  ('programs', 'hero_subtitle_en', 'Palm Trees Montessori BSD offers a Preschool & Kindergarten program (ages 2-6), an Elementary program (ages 6-12) designed around each stage of child development, and an Inclusion Program.', false),
  ('programs', 'rhythm_title_id', 'Sehari di Kelas', false),
  ('programs', 'rhythm_title_en', 'A Day in Class', false),
  ('programs', 'rhythm_subtitle_id', 'Ritme harian yang menenangkan dan dapat diprediksi anak.', false),
  ('programs', 'rhythm_subtitle_en', 'A calming, predictable daily rhythm.', false),
  ('programs', 'inclusive_section_title_id', 'Mendukung Setiap Gaya Belajar', false),
  ('programs', 'inclusive_section_title_en', 'Supporting Every Learning Style', false),
  ('programs', 'inclusive_section_desc_id', 'Bukan tentang label. Tentang melihat setiap anak utuh, lalu menemani mereka tumbuh dengan caranya sendiri.', false),
  ('programs', 'inclusive_section_desc_en', 'Not about labels. About seeing each child whole, then walking alongside them on their own path.', false),
  ('programs', 'how_inclusion_title_id', 'Bagaimana Program Inklusi Bekerja', false),
  ('programs', 'how_inclusion_title_en', 'How Our Inclusive Program Works', false),

  -- Montessori Method
  ('montessori', 'hero_h1_id', 'Metode Montessori – Tepat untuk Character Building Anak', true),
  ('montessori', 'hero_h1_en', 'The Montessori Method – The Right Path for Your Child''s Character Building', true),
  ('montessori', 'hero_subtitle_id', 'Lebih dari sekadar kurikulum — Montessori adalah cara memandang anak sebagai pembangun masa depannya sendiri.', false),
  ('montessori', 'hero_subtitle_en', 'More than a curriculum — Montessori is a way of seeing the child as the builder of their own future.', false),
  ('montessori', 'philosophy_title_id', 'Filosofi Montessori', false),
  ('montessori', 'philosophy_title_en', 'The Montessori Philosophy', false),
  ('montessori', 'philosophy_desc_id', 'Dr. Maria Montessori percaya bahwa anak-anak belajar paling baik ketika mereka diberi kebebasan dalam batas yang jelas, di lingkungan yang dipersiapkan dengan penuh kasih. Guru bukan pusat kelas — anaklah pusatnya. Tugas kami adalah mengamati, menemani, dan membuka jalan bagi keajaiban belajar setiap anak.', false),
  ('montessori', 'philosophy_desc_en', 'Dr. Maria Montessori believed that children learn best when given freedom within clear limits, in a lovingly prepared environment. The teacher is not the center of the classroom — the child is. Our task is to observe, accompany, and open the way for each child''s wonder of learning.', false),
  ('montessori', 'ceo_title_id', 'Sepatah Kata dari Pendiri Kami', false),
  ('montessori', 'ceo_title_en', 'A Word from Our Founder', false),
  ('montessori', 'advantages_title_id', 'Keunggulan Metode Montessori', false),
  ('montessori', 'advantages_title_en', 'Advantages of the Montessori Method', false),
  ('montessori', 'advantages_subtitle_id', 'Enam alasan mengapa Montessori menjadi fondasi terbaik bagi tumbuh kembang dan karakter Ananda.', false),
  ('montessori', 'advantages_subtitle_en', 'Six reasons why Montessori is the best foundation for your child''s growth and character.', false),

  -- Inclusion
  ('inclusion', 'hero_h1_id', 'Program Inklusi – Montessori untuk Setiap Anak', true),
  ('inclusion', 'hero_h1_en', 'Inclusion Program – Montessori for Every Child', true),
  ('inclusion', 'hero_subtitle_id', 'Sekolah Montessori terbaik dengan program inklusi di Tangerang — tempat setiap gaya belajar didukung dengan hati.', false),
  ('inclusion', 'hero_subtitle_en', 'The best Montessori school with an inclusion program in Tangerang — where every learning style is supported with heart.', false),
  ('inclusion', 'seo_intro_title_id', 'Sekolah Inklusi di BSD, Tangerang Selatan', false),
  ('inclusion', 'seo_intro_title_en', 'An Inclusive School in BSD, South Tangerang', false),
  ('inclusion', 'pillars_title_id', 'Bagaimana Kami Mendukung Ananda', false),
  ('inclusion', 'pillars_title_en', 'How We Support Your Child', false),
  ('inclusion', 'pillars_subtitle_id', 'Pendekatan yang lembut, tenang, dan menenangkan — dirancang bersama keluarga.', false),
  ('inclusion', 'pillars_subtitle_en', 'A gentle, calm, and reassuring approach — designed together with families.', false),
  ('inclusion', 'reasons_title_id', 'Sekolah Montessori Terbaik dengan Program Inklusi di Tangerang', false),
  ('inclusion', 'reasons_title_en', 'The Best Montessori School with an Inclusion Program in Tangerang', false),
  ('inclusion', 'reassurance_title_id', 'Tanpa Label, Penuh Dukungan', false),
  ('inclusion', 'reassurance_title_en', 'No Labels, Full of Support', false),
  ('inclusion', 'reassurance_desc_id', 'Kami tidak melihat anak dari labelnya. Kami melihat anak seutuhnya — kekuatannya, minatnya, dan caranya belajar. Bersama Ayah Bunda, kami menyusun langkah kecil yang bermakna, dengan tempo yang nyaman bagi Ananda.', false),
  ('inclusion', 'reassurance_desc_en', 'We do not see a child by their label. We see the whole child — their strengths, their interests, and the way they learn. Together with parents, we design small, meaningful steps at a pace that feels comfortable for your child.', false),

  -- Contact
  ('contact', 'hero_h1_id', 'Sapa Kami', false),
  ('contact', 'hero_h1_en', 'Say Hello', false),
  ('contact', 'hero_subtitle_id', 'Datang berkunjung, kirim pesan, atau sapa kami di WhatsApp. Pintu Palmtrees selalu terbuka.', false),
  ('contact', 'hero_subtitle_en', 'Drop by, send a message, or wave hi on WhatsApp. The Palmtrees door is always open.', false),
  ('contact', 'hours_title_id', 'Jam Operasional', false),
  ('contact', 'hours_title_en', 'Opening Hours', false)
ON CONFLICT (page_key, section_key) DO NOTHING;