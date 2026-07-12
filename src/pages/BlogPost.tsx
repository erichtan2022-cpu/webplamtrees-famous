import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Loader2, Share2, Facebook, Twitter, Link2 } from 'lucide-react';
import { useLanguage, getRoute } from '@/contexts/LanguageContext';
import { SiteLayout } from '@/components/site/SiteLayout';
import { SectionReveal } from '@/components/site/SectionReveal';
import { FloatingLeaf } from '@/components/site/Decorations';
import { BlogPost as BlogPostType, fetchPostBySlug, fetchPublishedPosts, renderMarkdown } from '@/lib/blog';

const categoryLabels: Record<string, { id: string; en: string }> = {
  'Tips Parenting': { id: 'Tips Parenting', en: 'Parenting Tips' },
  'Inklusi': { id: 'Inklusi', en: 'Inclusion' },
  'Kegiatan Anak': { id: 'Kegiatan Anak', en: 'Kids Activities' },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [related, setRelated] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([fetchPostBySlug(slug), fetchPublishedPosts()]).then(([p, all]) => {
      setPost(p);
      if (p) {
        setRelated(all.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 3));
      }
      setLoading(false);
    });
  }, [slug]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const linkFor = (s: string) => (lang === 'id' ? `/id/blog/${s}` : `/en/blog/${s}`);

  if (loading) {
    return (
      <SiteLayout titleId="Memuat..." titleEn="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-[#7A9A01] animate-spin" />
        </div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout titleId="Artikel Tidak Ditemukan" titleEn="Article Not Found">
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <h1 className="font-quicksand font-bold text-3xl text-[#8B5E3C] mb-4">
            {t('Artikel tidak ditemukan', 'Article not found')}
          </h1>
          <p className="text-[#8B5E3C]/80 mb-6">
            {t('Mungkin artikel ini sudah dipindahkan atau dihapus.', 'It may have been moved or removed.')}
          </p>
          <Link to={getRoute('blog', lang)} className="btn-bounce inline-flex items-center gap-2 bg-[#7A9A01] text-white font-bold px-6 py-3 rounded-full">
            <ArrowLeft className="w-4 h-4" /> {t('Kembali ke Blog', 'Back to Blog')}
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const title = lang === 'id' ? post.title_id : post.title_en;
  const body = lang === 'id' ? post.body_id : post.body_en;
  const excerpt = lang === 'id' ? post.excerpt_id : post.excerpt_en;
  const html = renderMarkdown(body);
  const catLabel = lang === 'id' ? categoryLabels[post.category]?.id ?? post.category : categoryLabels[post.category]?.en ?? post.category;

  return (
    <SiteLayout titleId={`${post.title_id} | Palmtrees`} titleEn={`${post.title_en} | Palmtrees`} descId={post.excerpt_id} descEn={post.excerpt_en}>
      {/* Hero */}
      <article className="relative">
        {post.featured_image && (
          <div className="relative h-[40vh] sm:h-[55vh] min-h-[300px] overflow-hidden">
            <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3a2e22]/85 via-[#3a2e22]/40 to-transparent" />
            <div className="absolute inset-0 flex items-end pb-10 px-4 sm:px-8">
              <div className="max-w-3xl mx-auto w-full text-white">
                <Link to={getRoute('blog', lang)} className="inline-flex items-center gap-2 text-white/85 hover:text-white text-sm mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> {t('Kembali ke Blog', 'Back to Blog')}
                </Link>
                <span className="inline-block bg-[#7A9A01] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
                  {catLabel}
                </span>
                <h1 className="font-quicksand font-bold text-3xl sm:text-5xl drop-shadow-lg leading-tight">
                  {title}
                </h1>
              </div>
            </div>
          </div>
        )}

        {!post.featured_image && (
          <div className="pt-10 px-4 sm:px-8 bg-[#F5F0E6]">
            <div className="max-w-3xl mx-auto">
              <Link to={getRoute('blog', lang)} className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#7A9A01] text-sm mb-4">
                <ArrowLeft className="w-4 h-4" /> {t('Kembali ke Blog', 'Back to Blog')}
              </Link>
              <span className="inline-block bg-[#7A9A01] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">{catLabel}</span>
              <h1 className="font-quicksand font-bold text-3xl sm:text-5xl text-[#8B5E3C] leading-tight">{title}</h1>
            </div>
          </div>
        )}

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 bg-white">
          <FloatingLeaf className="hidden md:block w-12 h-12 -left-16 top-20 opacity-30" />
          <FloatingLeaf className="hidden md:block w-10 h-10 -right-16 top-60 opacity-25" color="#8B5E3C" delay={2} />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#8B5E3C]/70 mb-8 pb-6 border-b border-[#8B5E3C]/10">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(post.published_at)}</span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs">{t('Bagikan:', 'Share:')}</span>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#F5F0E6] text-[#8B5E3C] flex items-center justify-center hover:bg-[#7A9A01] hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#F5F0E6] text-[#8B5E3C] flex items-center justify-center hover:bg-[#7A9A01] hover:text-white transition-colors" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <button onClick={copyLink} className="w-8 h-8 rounded-full bg-[#F5F0E6] text-[#8B5E3C] flex items-center justify-center hover:bg-[#7A9A01] hover:text-white transition-colors relative" aria-label="Copy link">
                <Link2 className="w-4 h-4" />
                {copied && <span className="absolute -top-9 right-0 bg-[#8B5E3C] text-white text-xs px-2 py-1 rounded whitespace-nowrap">{t('Tersalin!', 'Copied!')}</span>}
              </button>
            </div>
          </div>

          {excerpt && (
            <p className="text-lg sm:text-xl text-[#8B5E3C]/85 italic font-medium leading-relaxed mb-8 pl-4 border-l-4 border-[#7A9A01]">
              {excerpt}
            </p>
          )}

          {/* Body */}
          <div
            className="blog-body text-[#3a2e22] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <style>{`
            .blog-body p { margin: 0 0 1.1em; font-size: 1.05rem; line-height: 1.75; }
            .blog-body h1 { font-family: 'Quicksand', sans-serif; font-weight: 700; color: #8B5E3C; font-size: 1.85rem; margin: 1.5em 0 0.7em; }
            .blog-body h2 { font-family: 'Quicksand', sans-serif; font-weight: 700; color: #8B5E3C; font-size: 1.5rem; margin: 1.5em 0 0.6em; display: flex; align-items: center; gap: 0.5rem; }
            .blog-body h2::before { content: '🌿'; font-size: 1.1rem; }
            .blog-body strong { color: #7A9A01; font-weight: 700; }
            .blog-body ul { list-style: none; padding-left: 0; margin: 1em 0 1.4em; }
            .blog-body li { position: relative; padding-left: 1.6rem; margin-bottom: 0.55em; line-height: 1.7; }
            .blog-body li::before { content: ''; position: absolute; left: 0; top: 0.55em; width: 8px; height: 8px; border-radius: 50%; background: #7A9A01; }
            .blog-body em { color: #8B5E3C; }
          `}</style>

          {/* Share again at bottom */}
          <div className="mt-12 pt-6 border-t border-[#8B5E3C]/10 flex items-center justify-between flex-wrap gap-4">
            <Link to={getRoute('blog', lang)} className="inline-flex items-center gap-2 text-[#7A9A01] hover:text-[#8B5E3C] font-semibold text-sm">
              <ArrowLeft className="w-4 h-4" /> {t('Semua Artikel', 'All Articles')}
            </Link>
            <div className="flex items-center gap-2 text-sm text-[#8B5E3C]/70">
              <Share2 className="w-4 h-4" />
              <span>{t('Suka artikel ini? Bagikan ke Ayah Bunda lain.', 'Like this? Share with other parents.')}</span>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 px-4 sm:px-8 bg-[#F5F0E6]">
          <div className="max-w-5xl mx-auto">
            <SectionReveal className="text-center mb-10">
              <h2 className="font-quicksand font-bold text-2xl sm:text-4xl text-[#8B5E3C] mb-2">
                {t('Artikel Terkait', 'Related Articles')}
              </h2>
              <p className="text-[#8B5E3C]/75">{t('Cerita lain yang mungkin Ayah Bunda suka', 'More stories you might enjoy')}</p>
            </SectionReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r, i) => (
                <SectionReveal key={r.id} delay={i * 60}>
                  <Link to={linkFor(r.slug)} className="group block bg-white rounded-3xl overflow-hidden border border-[#8B5E3C]/10 hover-lift h-full">
                    {r.featured_image && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={r.featured_image} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="text-xs text-[#7A9A01] font-bold uppercase tracking-wider mb-2">
                        {lang === 'id' ? categoryLabels[r.category]?.id ?? r.category : categoryLabels[r.category]?.en ?? r.category}
                      </div>
                      <h3 className="font-quicksand font-bold text-base text-[#8B5E3C] group-hover:text-[#7A9A01] transition-colors leading-snug">
                        {lang === 'id' ? r.title_id : r.title_en}
                      </h3>
                    </div>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
