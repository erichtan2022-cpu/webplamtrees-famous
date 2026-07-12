import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { SectionReveal } from '@/components/site/SectionReveal';
import { BlogPost, BLOG_CATEGORIES, fetchPublishedPosts } from '@/lib/blog';

const categoryLabels: Record<string, { id: string; en: string }> = {
  'Tips Parenting': { id: 'Tips Parenting', en: 'Parenting Tips' },
  'Inklusi': { id: 'Inklusi', en: 'Inclusion' },
  'Kegiatan Anak': { id: 'Kegiatan Anak', en: 'Kids Activities' },
};

export default function Blog() {
  const { t, lang } = useLanguage();
  const [cat, setCat] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedPosts().then((p) => {
      setPosts(p);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (!query) return true;
      const title = lang === 'id' ? p.title_id : p.title_en;
      const excerpt = lang === 'id' ? p.excerpt_id : p.excerpt_en;
      const q = query.toLowerCase();
      return title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q);
    });
  }, [cat, query, lang, posts]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const linkFor = (slug: string) => (lang === 'id' ? `/id/blog/${slug}` : `/en/blog/${slug}`);

  return (
    <SiteLayout
      titleId="Blog & Berita | Palmtrees Montessori BSD"
      titleEn="Blog & News | Palmtrees Montessori BSD"
      descId="Cerita, tips parenting Montessori, dan kegiatan anak di Palmtrees Montessori BSD."
      descEn="Stories, Montessori parenting tips, and kids activities at Palmtrees Montessori BSD."
    >
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-[#F5F0E6] to-white text-center">
        <SectionReveal>
          <span className="inline-block bg-[#7A9A01]/15 text-[#7A9A01] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            {t('Blog & Berita', 'Blog & News')}
          </span>
          <h1 className="font-quicksand font-bold text-4xl sm:text-6xl text-[#8B5E3C] mb-4">
            {t('Cerita dari Kebun Kami', 'Stories from Our Garden')}
          </h1>
          <p className="text-[#8B5E3C]/80 max-w-2xl mx-auto text-lg">
            {t('Tips, refleksi, dan momen-momen kecil yang membuat hari kami berharga.', 'Tips, reflections, and small moments that make our days meaningful.')}
          </p>
        </SectionReveal>
      </section>

      <section className="px-4 sm:px-8 bg-white pb-16">
        <div className="max-w-6xl mx-auto">
          <SectionReveal>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCat('all')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    cat === 'all' ? 'bg-[#7A9A01] text-white shadow' : 'bg-[#F5F0E6] text-[#8B5E3C] hover:bg-[#8B5E3C]/15'
                  }`}
                >
                  {t('Semua', 'All')}
                </button>
                {BLOG_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      cat === c ? 'bg-[#7A9A01] text-white shadow' : 'bg-[#F5F0E6] text-[#8B5E3C] hover:bg-[#8B5E3C]/15'
                    }`}
                  >
                    {lang === 'id' ? categoryLabels[c].id : categoryLabels[c].en}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('Cari artikel...', 'Search articles...')}
                  className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#F5F0E6] text-sm border border-transparent focus:outline-none focus:border-[#7A9A01]"
                />
              </div>
            </div>
          </SectionReveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#7A9A01] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-[#8B5E3C]/70">
              <p className="text-lg">
                {posts.length === 0
                  ? t('Belum ada artikel.', 'No articles yet.')
                  : t('Belum ada artikel yang cocok.', 'No matching articles.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <SectionReveal key={p.id} delay={i * 50}>
                  <Link to={linkFor(p.slug)} className="block h-full">
                    <article className="bg-white rounded-3xl overflow-hidden border border-[#8B5E3C]/10 hover-lift cursor-pointer group h-full flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F0E6]">
                        {p.featured_image && (
                          <img
                            src={p.featured_image}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        <span className="absolute top-3 left-3 bg-[#7A9A01] text-white text-xs font-bold px-3 py-1 rounded-full">
                          {lang === 'id'
                            ? categoryLabels[p.category]?.id ?? p.category
                            : categoryLabels[p.category]?.en ?? p.category}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="text-xs text-[#8B5E3C]/60 mb-2">{formatDate(p.published_at)}</div>
                        <h3 className="font-quicksand font-bold text-lg text-[#8B5E3C] mb-2 group-hover:text-[#7A9A01] transition-colors leading-snug">
                          {lang === 'id' ? p.title_id : p.title_en}
                        </h3>
                        <p className="text-sm text-[#8B5E3C]/75 line-clamp-3 mb-4 flex-1">
                          {lang === 'id' ? p.excerpt_id : p.excerpt_en}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#7A9A01] group-hover:gap-2 transition-all">
                          {t('Baca selengkapnya', 'Read more')} <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </article>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
