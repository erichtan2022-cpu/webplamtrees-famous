import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { images as defaultImages, contactInfo as defaultContact } from '@/data/siteContent';

export interface SiteImageRow {
  id: string;
  page_key: string;
  section_key: string;
  image_url: string;
  label: string;
  sort_order: number;
}

export interface SiteCardRow {
  id: string;
  card_type: string;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  image_url: string | null;
  extra_id: string | null;
  extra_en: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface SiteSettingRow {
  key: string;
  value: string;
  label: string;
  category: string;
}

// Default fallback mapping for images keyed by `${page_key}:${section_key}`
const defaultImageMap: Record<string, string[]> = {
  'global:logo': [defaultImages.logo],
  'global:ceo': [defaultImages.ceo],
  'global:school_building': [defaultImages.schoolBuilding],
  'home:hero_slides': defaultImages.heroSlides,
  'home:unique_child': [defaultImages.uniqueChild],
  'home:activities': defaultImages.activities,
  'programs:preschool': [defaultImages.programs.preschool],
  'programs:kindergarten': [defaultImages.programs.kindergarten],
  'programs:inclusive': [defaultImages.programs.inclusive],
  'programs:inclusive_hero': [defaultImages.inclusiveHero],
  'about:classrooms': defaultImages.classrooms,
};

export function useSiteImages(pageKey?: string) {
  const { data = [] } = useQuery<SiteImageRow[]>({
    queryKey: ['site-images', pageKey ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('site_images').select('*').order('sort_order');
      if (pageKey) query = query.eq('page_key', pageKey);
      const { data, error } = await query;
      if (error) return [];
      return (data ?? []) as SiteImageRow[];
    },
    staleTime: 2 * 60 * 1000,
  });

  const getImage = (page: string, section: string, index = 0): string => {
    const matches = data.filter((r) => r.page_key === page && r.section_key === section);
    if (matches.length > 0 && matches[index]) return matches[index].image_url;
    const fallback = defaultImageMap[`${page}:${section}`];
    return fallback?.[index] ?? '';
  };

  const getImages = (page: string, section: string): string[] => {
    const matches = data.filter((r) => r.page_key === page && r.section_key === section);
    if (matches.length > 0) return matches.map((m) => m.image_url);
    return defaultImageMap[`${page}:${section}`] ?? [];
  };

  return { images: data, getImage, getImages };
}

export function useSiteCards(cardType?: string) {
  const { data = [] } = useQuery<SiteCardRow[]>({
    queryKey: ['site-cards', cardType ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('site_cards').select('*').order('sort_order');
      if (cardType) query = query.eq('card_type', cardType);
      const { data, error } = await query;
      if (error) return [];
      return (data ?? []) as SiteCardRow[];
    },
    staleTime: 2 * 60 * 1000,
  });

  return { cards: data };
}

export function useSiteSettings() {
  const { data = [] } = useQuery<SiteSettingRow[]>({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').order('category').order('key');
      if (error) return [];
      return (data ?? []) as SiteSettingRow[];
    },
    staleTime: 2 * 60 * 1000,
  });

  const getSetting = (key: string): string => {
    const row = data.find((r) => r.key === key);
    return row?.value ?? defaultContact[key] ?? '';
  };

  return { settings: data, getSetting };
}
