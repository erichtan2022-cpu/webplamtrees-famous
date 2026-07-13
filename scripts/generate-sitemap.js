#!/usr/bin/env node
/**
 * Sitemap generator for palmtreesmontessori.com
 * Reads static routes and optionally fetches published blog post slugs from Supabase.
 * Run: npm run sitemap
 */

import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = 'https://palmtreesmontessori.com';
const TODAY = new Date().toISOString().split('T')[0];

// Read VITE_ env vars from .env file (simple parser, no dotenv dependency)
function loadEnv() {
  try {
    const content = readFileSync(resolve(ROOT, '.env'), 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
    return env;
  } catch {
    return {};
  }
}

// Static bilingual route pairs [idPath, enPath, priority, changefreq]
const staticRoutes = [
  ['/', '/', '1.0', 'weekly'],
  ['/id/beranda', '/en/home', '0.9', 'weekly'],
  ['/id/tentang-kami', '/en/about-us', '0.8', 'monthly'],
  ['/id/program', '/en/programs', '0.85', 'monthly'],
  ['/id/metode-montessori', '/en/montessori-method', '0.8', 'monthly'],
  ['/id/program-inklusi', '/en/inclusive-program', '0.9', 'monthly'],
  ['/id/pendaftaran', '/en/admission', '0.95', 'weekly'],
  ['/id/blog', '/en/blog', '0.7', 'weekly'],
  ['/id/kontak', '/en/contact', '0.75', 'monthly'],
];

// Static HTML documents served directly from /public/
const staticDocs = [
  '/palmtrees_icp.html',
  '/panduan-orangtua-montessori.html',
  '/ebook-panduan-orangtua-montessori-html.html',
  '/omnichannel-palmtrees.html',
  '/PalmTrees_Montessori_Strategy_2026.html',
];

function urlEntry(loc, { priority = '0.6', changefreq = 'monthly', lastmod = TODAY, idAlt = null, enAlt = null } = {}) {
  const alts = [];
  if (idAlt) alts.push(`    <xhtml:link rel="alternate" hreflang="id" href="${BASE_URL}${idAlt}"/>`);
  if (enAlt) alts.push(`    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${enAlt}"/>`);
  return [
    '  <url>',
    `    <loc>${BASE_URL}${loc}</loc>`,
    ...alts,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

async function fetchBlogSlugs(supabaseUrl, supabaseKey) {
  if (!supabaseUrl || !supabaseKey) return [];
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=slug,published_at&is_published=eq.true&order=published_at.desc`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function generate() {
  const env = loadEnv();
  const supabaseUrl = env['VITE_SUPABASE_URL'];
  const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

  const entries = [];

  // Static routes
  for (const [idPath, enPath, priority, changefreq] of staticRoutes) {
    if (idPath === '/') {
      entries.push(urlEntry('/', { priority, changefreq }));
    } else {
      entries.push(urlEntry(idPath, { priority, changefreq, idAlt: idPath, enAlt: enPath }));
      entries.push(urlEntry(enPath, { priority, changefreq, idAlt: idPath, enAlt: enPath }));
    }
  }

  // Blog posts
  const posts = await fetchBlogSlugs(supabaseUrl, supabaseKey);
  for (const post of posts) {
    const lastmod = post.published_at ? post.published_at.split('T')[0] : TODAY;
    entries.push(urlEntry(`/id/blog/${post.slug}`, {
      priority: '0.6', changefreq: 'monthly', lastmod,
      idAlt: `/id/blog/${post.slug}`, enAlt: `/en/blog/${post.slug}`,
    }));
    entries.push(urlEntry(`/en/blog/${post.slug}`, {
      priority: '0.6', changefreq: 'monthly', lastmod,
      idAlt: `/id/blog/${post.slug}`, enAlt: `/en/blog/${post.slug}`,
    }));
  }

  // Static documents
  for (const doc of staticDocs) {
    entries.push(urlEntry(doc, { priority: '0.4', changefreq: 'yearly' }));
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    '',
    entries.join('\n\n'),
    '',
    '</urlset>',
  ].join('\n');

  const outPath = resolve(ROOT, 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`Sitemap written to ${outPath} (${entries.length / 2 | 0}+ URLs)`);
}

generate().catch((e) => { console.error(e); process.exit(1); });
