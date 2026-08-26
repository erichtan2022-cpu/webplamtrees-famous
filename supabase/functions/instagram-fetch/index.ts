import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InstagramPost {
  image_url: string;
  post_url: string;
  caption: string;
}

async function fetchInstagramPost(url: string): Promise<InstagramPost> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Googlebot/2.1 (+http://www.google.com/bot.html)",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Instagram page (${response.status})`);
  }

  const html = await response.text();

  // Extract og:image meta tag
  const ogImageMatch = html.match(
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
  );
  if (!ogImageMatch) {
    throw new Error("Could not find image in Instagram post");
  }

  // Decode HTML entities (&amp; -> &)
  const imageUrl = ogImageMatch[1].replace(/&amp;/g, "&");

  // Extract og:title for caption
  const ogTitleMatch = html.match(
    /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i,
  );
  const caption = ogTitleMatch ? ogTitleMatch[1] : "";

  return {
    image_url: imageUrl,
    post_url: url,
    caption,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || !url.includes("instagram.com")) {
      return new Response(
        JSON.stringify({ error: "Valid Instagram URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const post = await fetchInstagramPost(url);

    return new Response(
      JSON.stringify(post),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to fetch Instagram post" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
