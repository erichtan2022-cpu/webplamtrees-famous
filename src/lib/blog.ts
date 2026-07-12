import { supabase } from '@/lib/supabase';

export interface BlogPost {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  excerpt_id: string;
  excerpt_en: string;
  body_id: string;
  body_en: string;
  category: string;
  featured_image: string;
  author: string;
  published_at: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export const BLOG_CATEGORIES = ['Tips Parenting', 'Inklusi', 'Kegiatan Anak'] as const;

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error) {
    console.error('fetchPublishedPosts', error);
    return [];
  }
  return (data ?? []) as BlogPost[];
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error) {
    console.error('fetchPostBySlug', error);
    return null;
  }
  return (data as BlogPost) ?? null;
}

export async function callAdmin<T = unknown>(
  password: string,
  action: string,
  payload: Record<string, unknown> = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('blog-admin', {
      body: { action, password, ...payload },
    });
    if (error) return { error: error.message };
    if ((data as { error?: string })?.error) return { error: (data as { error: string }).error };
    return { data: data as T };
  } catch (e) {
    return { error: String((e as Error).message ?? e) };
  }
}

// Very small markdown -> HTML converter for blog bodies (headings, bold, lists, paragraphs).
export function renderMarkdown(md: string): string {
  if (!md) return '';
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      let text = escapeHtml(para.join(' '));
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      out.push(`<p>${text}</p>`);
      para = [];
    }
  };
  const closeList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      closeList();
      continue;
    }
    if (line.startsWith('## ')) {
      flushPara();
      closeList();
      out.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      flushPara();
      closeList();
      out.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushPara();
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      let item = escapeHtml(line.slice(2));
      item = item.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      item = item.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      out.push(`<li>${item}</li>`);
      continue;
    }
    closeList();
    para.push(line);
  }
  flushPara();
  closeList();
  return out.join('\n');
}
