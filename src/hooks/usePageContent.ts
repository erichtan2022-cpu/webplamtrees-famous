import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface PageContentRow {
  section_key: string;
  content: string;
  is_seo_critical: boolean;
}

export function usePageContent(pageKey: string) {
  const { data = [] } = useQuery<PageContentRow[]>({
    queryKey: ['page-content', pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('section_key, content, is_seo_critical')
        .eq('page_key', pageKey);
      if (error) return [];
      return (data ?? []) as PageContentRow[];
    },
    staleTime: 2 * 60 * 1000,
  });

  const getContent = (key: string, fallback: string): string => {
    const row = data.find((r) => r.section_key === key);
    return row?.content?.trim() || fallback;
  };

  return { getContent, rows: data };
}
