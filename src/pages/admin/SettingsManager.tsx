import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Save, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { SiteSettingRow } from '@/hooks/useSiteContent';

const CATEGORY_LABELS: Record<string, string> = {
  contact: 'Kontak',
  social: 'Media Sosial',
  hours: 'Jam Operasional',
};

export default function SettingsManager() {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<SiteSettingRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
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
      .from('site_settings')
      .select('*')
      .order('category')
      .order('key');
    setLoading(false);
    if (error) { showToast('error', error.message); return; }
    const loaded = (data ?? []) as SiteSettingRow[];
    setRows(loaded);
    const map: Record<string, string> = {};
    loaded.forEach((r) => { map[r.key] = r.value; });
    setDrafts(map);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (row: SiteSettingRow) => {
    const newVal = drafts[row.key] ?? row.value;
    setSaving(row.key);
    const { error } = await supabase
      .from('site_settings')
      .update({ value: newVal, updated_at: new Date().toISOString() })
      .eq('key', row.key);
    setSaving(null);
    if (error) { showToast('error', error.message); return; }
    setRows((prev) => prev.map((r) => r.key === row.key ? { ...r, value: newVal } : r));
    queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    showToast('success', 'Pengaturan disimpan');
  };

  const isDirty = (row: SiteSettingRow) => (drafts[row.key] ?? row.value) !== row.value;

  const categoryGroups = rows.reduce<Record<string, SiteSettingRow[]>>((acc, row) => {
    (acc[row.category] ??= []).push(row);
    return acc;
  }, {});

  return (
    <AdminLayout title="Pengaturan Kontak" breadcrumb="Panel Admin">
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
        <div className="space-y-8 max-w-2xl">
          {Object.entries(categoryGroups).map(([category, catRows]) => (
            <div key={category}>
              <h2 className="text-base font-bold text-slate-800 mb-3">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="space-y-4">
                {catRows.map((row) => {
                  const dirty = isDirty(row);
                  const isSaving = saving === row.key;
                  return (
                    <div key={row.key} className="bg-white rounded-2xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-sm font-semibold text-slate-800">{row.label}</span>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">{row.key}</p>
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
                      <input
                        value={drafts[row.key] ?? row.value}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [row.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7A9A01]/30 focus:border-[#7A9A01] text-sm"
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
