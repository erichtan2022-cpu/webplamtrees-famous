import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Save, Loader as Loader2, CircleAlert as AlertCircle, ShieldAlert, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';

interface ContentRow {
  id: string;
  page_key: string;
  section_key: string;
  content: string;
  is_seo_critical: boolean;
}

interface ImageRow {
  id: string;
  page_key: string;
  section_key: string;
  image_url: string;
  label: string;
  sort_order: number;
}

type DraftMap = Record<string, string>;

const PAGE_TITLES: Record<string, string> = {
  home: 'Homepage',
  about: 'Tentang Kami',
  programs: 'Program',
  montessori: 'Metode Montessori',
  inclusion: 'Program Inklusi',
  admission: 'Pendaftaran',
  contact: 'Kontak',
};

const SECTION_LABELS: Record<string, { label: string; hint?: string }> = {
  // Home
  hero_h1_id: { label: 'Hero H1 — Bahasa Indonesia', hint: 'Ditampilkan sebagai judul utama (H1) di slider homepage.' },
  hero_h1_en: { label: 'Hero H1 — English', hint: 'Displayed as the main heading (H1) in the homepage slider.' },
  geo_intro_id: { label: 'Teks Geo Intro — Bahasa Indonesia', hint: 'Teks pendek di bawah slider mengenai wilayah layanan.' },
  geo_intro_en: { label: 'Geo Intro Text — English', hint: 'Short text below slider about service area.' },
  why_title_id: { label: 'Judul "Kenapa Palmtrees" — ID', hint: 'Judul section "Why Palmtrees".' },
  why_title_en: { label: '"Why Palmtrees" Title — EN', hint: 'Title for the "Why Palmtrees" section.' },
  why_subtitle_id: { label: 'Subjudul "Kenapa Palmtrees" — ID' },
  why_subtitle_en: { label: '"Why Palmtrees" Subtitle — EN' },
  programs_title_id: { label: 'Judul Section Program — ID' },
  programs_title_en: { label: 'Programs Section Title — EN' },
  testimonials_title_id: { label: 'Judul Testimoni — ID' },
  testimonials_title_en: { label: 'Testimonials Title — EN' },
  instagram_title: { label: 'Instagram Title', hint: 'Username Instagram yang ditampilkan.' },
  instagram_subtitle_id: { label: 'Subjudul Instagram — ID' },
  instagram_subtitle_en: { label: 'Instagram Subtitle — EN' },
  cta_title_id: { label: 'CTA Judul — ID', hint: 'Call-to-action di bagian bawah homepage.' },
  cta_title_en: { label: 'CTA Title — EN' },
  cta_desc_id: { label: 'CTA Deskripsi — ID' },
  cta_desc_en: { label: 'CTA Description — EN' },

  // About
  'about:hero_h1': { label: 'Hero H1 — About', hint: 'Judul utama di halaman About.' },
  'about:hero_subtitle_id': { label: 'Hero Subtitle — ID' },
  'about:hero_subtitle_en': { label: 'Hero Subtitle — EN' },
  'about:intro_paragraph_id': { label: 'Paragraf Intro — ID', hint: 'Cerita pendiri sekolah.' },
  'about:intro_paragraph_en': { label: 'Intro Paragraph — EN' },
  'about:values_title_id': { label: 'Judul Visi Misi — ID' },
  'about:values_title_en': { label: 'Values Title — EN' },
  'about:values_subtitle_id': { label: 'Subjudul Visi Misi — ID' },
  'about:values_subtitle_en': { label: 'Values Subtitle — EN' },
  'about:facilities_title_id': { label: 'Judul Fasilitas — ID' },
  'about:facilities_title_en': { label: 'Facilities Title — EN' },
  'about:facilities_subtitle_id': { label: 'Subjudul Fasilitas — ID' },
  'about:facilities_subtitle_en': { label: 'Facilities Subtitle — EN' },

  // Programs
  'programs:hero_h1_id': { label: 'Hero H1 — ID', hint: 'Judul utama halaman Program.' },
  'programs:hero_h1_en': { label: 'Hero H1 — EN' },
  'programs:hero_subtitle_id': { label: 'Hero Subtitle — ID' },
  'programs:hero_subtitle_en': { label: 'Hero Subtitle — EN' },
  'programs:rhythm_title_id': { label: 'Judul "Sehari di Kelas" — ID' },
  'programs:rhythm_title_en': { label: '"A Day in Class" Title — EN' },
  'programs:rhythm_subtitle_id': { label: 'Subjudul Ritme — ID' },
  'programs:rhythm_subtitle_en': { label: 'Rhythm Subtitle — EN' },
  'programs:inclusive_section_title_id': { label: 'Judul Section Inklusi — ID' },
  'programs:inclusive_section_title_en': { label: 'Inclusion Section Title — EN' },
  'programs:inclusive_section_desc_id': { label: 'Deskripsi Section Inklusi — ID' },
  'programs:inclusive_section_desc_en': { label: 'Inclusion Section Desc — EN' },
  'programs:how_inclusion_title_id': { label: 'Judul "Cara Inklusi Bekerja" — ID' },
  'programs:how_inclusion_title_en': { label: 'How Inclusion Title — EN' },

  // Montessori
  'montessori:hero_h1_id': { label: 'Hero H1 — ID', hint: 'Judul utama halaman Metode Montessori.' },
  'montessori:hero_h1_en': { label: 'Hero H1 — EN' },
  'montessori:hero_subtitle_id': { label: 'Hero Subtitle — ID' },
  'montessori:hero_subtitle_en': { label: 'Hero Subtitle — EN' },
  'montessori:philosophy_title_id': { label: 'Judul Filosofi — ID' },
  'montessori:philosophy_title_en': { label: 'Philosophy Title — EN' },
  'montessori:philosophy_desc_id': { label: 'Deskripsi Filosofi — ID' },
  'montessori:philosophy_desc_en': { label: 'Philosophy Description — EN' },
  'montessori:advantages_title_id': { label: 'Judul Keunggulan — ID' },
  'montessori:advantages_title_en': { label: 'Advantages Title — EN' },
  'montessori:advantages_subtitle_id': { label: 'Subjudul Keunggulan — ID' },
  'montessori:advantages_subtitle_en': { label: 'Advantages Subtitle — EN' },

  // Inclusion
  'inclusion:hero_h1_id': { label: 'Hero H1 — ID', hint: 'Judul utama halaman Program Inklusi.' },
  'inclusion:hero_h1_en': { label: 'Hero H1 — EN' },
  'inclusion:hero_subtitle_id': { label: 'Hero Subtitle — ID' },
  'inclusion:hero_subtitle_en': { label: 'Hero Subtitle — EN' },
  'inclusion:seo_intro_title_id': { label: 'Judul SEO Intro — ID' },
  'inclusion:seo_intro_title_en': { label: 'SEO Intro Title — EN' },
  'inclusion:pillars_title_id': { label: 'Judul Pilar — ID' },
  'inclusion:pillars_title_en': { label: 'Pillars Title — EN' },
  'inclusion:pillars_subtitle_id': { label: 'Subjudul Pilar — ID' },
  'inclusion:pillars_subtitle_en': { label: 'Pillars Subtitle — EN' },
  'inclusion:reasons_title_id': { label: 'Judul Alasan — ID' },
  'inclusion:reasons_title_en': { label: 'Reasons Title — EN' },
  'inclusion:reassurance_title_id': { label: 'Judul Reassurance — ID' },
  'inclusion:reassurance_title_en': { label: 'Reassurance Title — EN' },
  'inclusion:reassurance_desc_id': { label: 'Deskripsi Reassurance — ID' },
  'inclusion:reassurance_desc_en': { label: 'Reassurance Description — EN' },

  // Admission
  h1_id: { label: 'H1 Halaman — Bahasa Indonesia', hint: 'Judul utama halaman pendaftaran.' },
  h1_en: { label: 'H1 Page — English', hint: 'Main heading for the admission page.' },
  brochure_desc_id: { label: 'Deskripsi Brosur — Bahasa Indonesia', hint: 'Teks yang muncul di tombol unduh brosur.' },
  brochure_desc_en: { label: 'Brochure Description — English', hint: 'Text shown on the brochure download button.' },

  // Contact
  'contact:hero_h1_id': { label: 'Hero H1 — ID', hint: 'Judul utama halaman Kontak.' },
  'contact:hero_h1_en': { label: 'Hero H1 — EN' },
  'contact:hero_subtitle_id': { label: 'Hero Subtitle — ID' },
  'contact:hero_subtitle_en': { label: 'Hero Subtitle — EN' },
  'contact:hours_title_id': { label: 'Judul Jam Operasional — ID' },
  'contact:hours_title_en': { label: 'Hours Title — EN' },
};

// Which sections of images belong to each page
const PAGE_IMAGE_SECTIONS: Record<string, { section_key: string; label: string }[]> = {
  home: [
    { section_key: 'hero_slides', label: 'Hero Slides (Slider Utama)' },
    { section_key: 'unique_child', label: 'Parallax "Setiap Anak Unik"' },
    { section_key: 'activities', label: 'Foto Aktivitas Instagram' },
  ],
  about: [
    { section_key: 'classrooms', label: 'Foto Ruang Kelas' },
  ],
  programs: [
    { section_key: 'preschool', label: 'Foto Program Preschool' },
    { section_key: 'kindergarten', label: 'Foto Program Elementary' },
    { section_key: 'inclusive', label: 'Foto Program Inklusi' },
    { section_key: 'inclusive_hero', label: 'Foto Hero Halaman Program' },
  ],
  montessori: [],
  inclusion: [],
  admission: [],
  contact: [],
};

function getSectionMeta(row: ContentRow) {
  const compositeKey = `${row.page_key}:${row.section_key}`;
  return SECTION_LABELS[compositeKey] ?? SECTION_LABELS[row.section_key];
}

export default function PageEditor() {
  const { pageKey = 'home' } = useParams<{ pageKey: string }>();
  const queryClient = useQueryClient();
  const pageTitle = PAGE_TITLES[pageKey] ?? pageKey;
  const imageSections = PAGE_IMAGE_SECTIONS[pageKey] ?? [];

  const [rows, setRows] = useState<ContentRow[]>([]);
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Images state
  const [images, setImages] = useState<ImageRow[]>([]);
  const [imgDrafts, setImgDrafts] = useState<Record<string, string>>({});
  const [imgSaving, setImgSaving] = useState<string | null>(null);
  const [showAddImg, setShowAddImg] = useState<string | null>(null);
  const [newImgUrl, setNewImgUrl] = useState('');

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    const [textRes, imgRes] = await Promise.all([
      supabase
        .from('page_content')
        .select('id, page_key, section_key, content, is_seo_critical')
        .eq('page_key', pageKey)
        .order('section_key'),
      supabase
        .from('site_images')
        .select('*')
        .eq('page_key', pageKey)
        .order('section_key')
        .order('sort_order'),
    ]);
    setLoading(false);
    if (textRes.error) { showToast('error', textRes.error.message); return; }
    if (imgRes.error) { showToast('error', imgRes.error.message); return; }
    const loadedText = (textRes.data ?? []) as ContentRow[];
    setRows(loadedText);
    const map: DraftMap = {};
    loadedText.forEach((r) => { map[r.id] = r.content; });
    setDrafts(map);

    const loadedImgs = (imgRes.data ?? []) as ImageRow[];
    setImages(loadedImgs);
    const imgMap: Record<string, string> = {};
    loadedImgs.forEach((r) => { imgMap[r.id] = r.image_url; });
    setImgDrafts(imgMap);
  };

  useEffect(() => { load(); }, [pageKey]);

  const handleSave = async (row: ContentRow) => {
    const newContent = drafts[row.id] ?? row.content;
    setSaving(row.id);
    const { error } = await supabase
      .from('page_content')
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .eq('id', row.id);
    setSaving(null);
    if (error) { showToast('error', error.message); return; }
    setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, content: newContent } : r));
    queryClient.invalidateQueries({ queryKey: ['page-content', pageKey] });
    showToast('success', 'Teks berhasil disimpan');
  };

  const isDirty = (row: ContentRow) => (drafts[row.id] ?? row.content) !== row.content;

  // Image handlers
  const handleImgSave = async (img: ImageRow) => {
    const newUrl = imgDrafts[img.id] ?? img.image_url;
    setImgSaving(img.id);
    const { error } = await supabase.from('site_images').update({ image_url: newUrl }).eq('id', img.id);
    setImgSaving(null);
    if (error) { showToast('error', error.message); return; }
    setImages((prev) => prev.map((r) => r.id === img.id ? { ...r, image_url: newUrl } : r));
    queryClient.invalidateQueries({ queryKey: ['site-images'] });
    showToast('success', 'Gambar berhasil diperbarui');
  };

  const handleImgDelete = async (img: ImageRow) => {
    if (!confirm(`Hapus gambar "${img.label}"?`)) return;
    const { error } = await supabase.from('site_images').delete().eq('id', img.id);
    if (error) { showToast('error', error.message); return; }
    setImages((prev) => prev.filter((r) => r.id !== img.id));
    queryClient.invalidateQueries({ queryKey: ['site-images'] });
    showToast('success', 'Gambar dihapus');
  };

  const handleImgAdd = async (sectionKey: string, label: string) => {
    if (!newImgUrl.trim()) return;
    const maxOrder = images
      .filter((r) => r.section_key === sectionKey)
      .reduce((max, r) => Math.max(max, r.sort_order), -1) + 1;
    const { data, error } = await supabase
      .from('site_images')
      .insert({
        page_key: pageKey,
        section_key: sectionKey,
        image_url: newImgUrl.trim(),
        label: `${label} ${maxOrder + 1}`,
        sort_order: maxOrder,
      })
      .select('*')
      .single();
    if (error) { showToast('error', error.message); return; }
    setImages((prev) => [...prev, data as ImageRow]);
    setNewImgUrl('');
    setShowAddImg(null);
    queryClient.invalidateQueries({ queryKey: ['site-images'] });
    showToast('success', 'Gambar ditambahkan');
  };

  const isImgDirty = (img: ImageRow) => (imgDrafts[img.id] ?? img.image_url) !== img.image_url;

  return (
    <AdminLayout title={pageTitle} breadcrumb="Edit Halaman">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-[#7A9A01] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
          {toast.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#7A9A01] animate-spin" />
        </div>
      ) : (
        <div className="space-y-8 max-w-3xl">
          {/* Images section (only if page has images) */}
          {imageSections.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-[#7A9A01]" />
                <h2 className="text-base font-bold text-slate-800">Gambar Halaman</h2>
              </div>
              <div className="space-y-6">
                {imageSections.map(({ section_key, label }) => {
                  const sectionImgs = images.filter((r) => r.section_key === section_key);
                  return (
                    <div key={section_key} className="bg-white rounded-2xl border border-slate-200 p-5">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">{label}</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sectionImgs.map((img) => {
                          const dirty = isImgDirty(img);
                          const saving = imgSaving === img.id;
                          return (
                            <div key={img.id} className="rounded-xl border border-slate-200 overflow-hidden">
                              <div className="aspect-video bg-slate-100 relative">
                                <img src={imgDrafts[img.id] ?? img.image_url} alt={img.label} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => handleImgDelete(img)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-lg p-1 hover:bg-red-600"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="p-2">
                                <input
                                  value={imgDrafts[img.id] ?? img.image_url}
                                  onChange={(e) => setImgDrafts((prev) => ({ ...prev, [img.id]: e.target.value }))}
                                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                                />
                                {dirty && (
                                  <button
                                    onClick={() => handleImgSave(img)}
                                    disabled={saving}
                                    className="mt-1.5 w-full inline-flex items-center justify-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40"
                                  >
                                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    Simpan
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {/* Add new image button */}
                        {showAddImg === section_key ? (
                          <div className="rounded-xl border-2 border-dashed border-slate-300 p-3 flex flex-col gap-2">
                            <input
                              value={newImgUrl}
                              onChange={(e) => setNewImgUrl(e.target.value)}
                              placeholder="Tempel URL gambar..."
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                              autoFocus
                            />
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleImgAdd(section_key, label)}
                                className="flex-1 text-xs font-semibold px-2 py-1.5 rounded-lg bg-[#7A9A01] hover:bg-[#6a8a01] text-white"
                              >
                                Tambah
                              </button>
                              <button
                                onClick={() => { setShowAddImg(null); setNewImgUrl(''); }}
                                className="text-xs font-semibold px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAddImg(section_key)}
                            className="rounded-xl border-2 border-dashed border-slate-300 hover:border-[#7A9A01] hover:bg-[#7A9A01]/5 transition-colors flex items-center justify-center min-h-[120px]"
                          >
                            <div className="text-center text-slate-400">
                              <Plus className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-xs font-medium">Tambah Gambar</span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Text content section */}
          {rows.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-3">Teks Halaman</h2>
              <div className="space-y-4">
                {rows.map((row) => {
                  const meta = getSectionMeta(row);
                  const dirty = isDirty(row);
                  const isSaving = saving === row.id;
                  return (
                    <div
                      key={row.id}
                      className={`bg-white rounded-2xl border p-5 ${
                        row.is_seo_critical ? 'border-amber-200' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-800">
                              {meta?.label ?? row.section_key}
                            </span>
                            {row.is_seo_critical && (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                <ShieldAlert className="w-3 h-3" />
                                SEO Kritis
                              </span>
                            )}
                          </div>
                          {meta?.hint && (
                            <p className="text-xs text-slate-400 mt-0.5">{meta.hint}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleSave(row)}
                          disabled={!dirty || isSaving}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-800 text-white shrink-0"
                        >
                          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          Simpan
                        </button>
                      </div>

                      {row.is_seo_critical && (
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700">
                            Kolom ini mengandung kata kunci SEO utama. Jangan hapus kata kunci inti seperti "Montessori BSD", "program inklusi ABK", atau "Tangerang Selatan".
                          </p>
                        </div>
                      )}

                      <textarea
                        rows={3}
                        value={drafts[row.id] ?? row.content}
                        onChange={(e) =>
                          setDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))
                        }
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm resize-y"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {rows.length === 0 && imageSections.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <p>Tidak ada konten yang bisa diedit untuk halaman ini.</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
