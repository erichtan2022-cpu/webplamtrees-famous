import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, password, ...payload } = body as {
      action: string;
      password: string;
      [key: string]: unknown;
    };

    const adminPassword =
      Deno.env.get("BLOG_ADMIN_PASSWORD") ?? "palmtrees2025";

    if (!password || password !== adminPassword) {
      return json({ error: "Password salah" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "verify") {
      return json({ ok: true });
    }

    if (action === "list") {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json({ posts: data });
    }

    if (action === "create") {
      const post = payload.post as Record<string, unknown>;
      if (!post?.slug || !post?.title_id || !post?.title_en) {
        return json({ error: "slug, title_id dan title_en wajib diisi" }, 400);
      }
      const { data, error } = await supabase
        .from("blog_posts")
        .insert([post])
        .select()
        .maybeSingle();
      if (error) return json({ error: error.message }, 500);
      return json({ post: data });
    }

    if (action === "update") {
      const { id, post } = payload as {
        id: string;
        post: Record<string, unknown>;
      };
      if (!id) return json({ error: "id wajib diisi" }, 400);
      const { updated_at: _old, created_at: _c, id: _id, ...fields } =
        post as Record<string, unknown>;
      const { data, error } = await supabase
        .from("blog_posts")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) return json({ error: error.message }, 500);
      return json({ post: data });
    }

    if (action === "delete") {
      const { id } = payload as { id: string };
      if (!id) return json({ error: "id wajib diisi" }, 400);
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "Action tidak dikenal" }, 400);
  } catch (err) {
    return json(
      { error: (err as Error).message ?? String(err) },
      500
    );
  }
});
