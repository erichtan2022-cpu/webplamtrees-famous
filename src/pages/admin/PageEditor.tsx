import { useEffect, useState } from 'react';
import { Save, Loader as Loader2, CircleAlert as AlertCircle, ShieldAlert } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';

interface ContentRow {
  id: string;
  page_key: string;
  section_key: string;
  content: string;
  is_seo_critical: boolean;
}

type DraftMap = Record<string, string>;

const PAGE_LABELS: Record<string, string> = {
  home: 'Homepage',
  admission: 'Halaman Pendaftaran',
};

const SECTION_LABELS: Record<string, { label: string; hint?: string }> = {
  hero_h1_id: { label: 'Hero H1 — Bahasa Indonesia', hint: 'Ditampilkan sebagai judul utama (H1) di slider homepage.' },
  hero_h1_en: { label: 'Hero H1 — English', hint: 'Displayed as the main heading (H1) in the homepage slider.' },
  geo_intro_id: { label: 'Teks Geo Intro — Bahasa Indonesia', hint: 'Teks pendek di bawah slider mengenai wilayah layanan.' },
  geo_intro_en: { label: 'Geo Intro Text — English', hint: 'Short text below slider about service area.' },
  h1_id: { label: 'H1 Halaman — Bahasa Indonesia', hint: 'Judul utama halaman pendaftaran.' },
  h1_en: { label: 'H1 Page — English', hint: 'Main heading for the admission page.' },
  brochure_desc_id: { label: 'Deskripsi Brosur — Bahasa Indonesia', hint: 'Teks yang muncul di tombol unduh brosur.' },
  brochure_desc_en: { label: 'Brochure Description — English', hint: 'Text shown on the brochure download button.' },
};

export default function PageEditor() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('page_content')
      .select('id, page_key, section_key, content, is_seo_critical')
      .order('page_key')
      .order('section_key');
    setLoading(false);
    if (error) { showToast('error', error.message); return; }
    const loaded = (data ?? []) as ContentRow[];
    setRows(loaded);
    const map: DraftMap = {};
    loaded.forEach((r) => { map[r.id] = r.content; });
    setDrafts(map);
  };

  useEffect(() => { load(); }, []);

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
    showToast('success', 'Konten berhasil disimpan');
  };

  const isDirty = (row: ContentRow) => (drafts[row.id] ?? row.content) !== row.content;

  const pageGroups = rows.reduce<Record<string, ContentRow[]>>((acc, row) => {
    (acc[row.page_key] ??= []).push(row);
    return acc;
  }, {});

  return (
    <AdminLayout title="Edit Konten Halaman" breadcrumb="Panel Admin">
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
          {Object.entries(pageGroups).map(([pageKey, pageRows]) => (
            <div key={pageKey}>
              <h2 className="text-base font-bold text-slate-800 mb-3">
                {PAGE_LABELS[pageKey] ?? pageKey}
              </h2>
              <div className="space-y-4">
                {pageRows.map((row) => {
                  const meta = SECTION_LABELS[row.section_key];
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
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
