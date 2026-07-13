import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BASE_URL = "https://palmtreesmontessori.com";

const staticRoutes = [
  { id: "/", en: "/", priority: "1.0", changefreq: "weekly" },
  { id: "/id/beranda", en: "/en/home", priority: "1.0", changefreq: "weekly" },
  { id: "/id/pendaftaran", en: "/en/admission", priority: "0.95", changefreq: "monthly" },
  { id: "/id/program-inklusi", en: "/en/inclusive-program", priority: "0.9", changefreq: "monthly" },
  { id: "/id/tentang-kami", en: "/en/about-us", priority: "0.8", changefreq: "monthly" },
  { id: "/id/program", en: "/en/programs", priority: "0.8", changefreq: "monthly" },
  { id: "/id/metode-montessori", en: "/en/montessori-method", priority: "0.8", changefreq: "monthly" },
  { id: "/id/blog", en: "/en/blog", priority: "0.8", changefreq: "daily" },
  { id: "/id/kontak", en: "/en/contact", priority: "0.7", changefreq: "monthly" },
];

function urlEntry(loc: string, alternates: { hreflang: string; href: string }[], priority: string, changefreq: string, lastmod?: string): string {
  const alts = alternates
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
    .join("\n");
  return `  <url>
    <loc>${BASE_URL}${loc}</loc>
${alts}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
  </url>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    const entries: string[] = [];

    for (const route of staticRoutes) {
      const alternates = [
        { hreflang: "id", href: `${BASE_URL}${route.id}` },
        { hreflang: "en", href: `${BASE_URL}${route.en}` },
        { hreflang: "x-default", href: `${BASE_URL}${route.id}` },
      ];
      entries.push(urlEntry(route.id, alternates, route.priority, route.changefreq));
    }

    for (const post of (posts ?? [])) {
      const lastmod = (post.updated_at ?? post.published_at ?? "").slice(0, 10);
      const alternates = [
        { hreflang: "id", href: `${BASE_URL}/id/blog/${post.slug}` },
        { hreflang: "en", href: `${BASE_URL}/en/blog/${post.slug}` },
        { hreflang: "x-default", href: `${BASE_URL}/id/blog/${post.slug}` },
      ];
      entries.push(urlEntry(`/id/blog/${post.slug}`, alternates, "0.7", "monthly", lastmod));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
