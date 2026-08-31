import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SCHOOL_EMAIL = Deno.env.get("CONTACT_TO_EMAIL") || "info@palmtreesmontessori.com";
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "Palmtrees Montessori <onboarding@resend.dev>";

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API error: ${res.status} ${text}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Store message in database regardless of email status
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name, email, subject: subject || null, message }]);

    if (dbError) {
      console.error("Failed to store message:", dbError.message);
    }

    // If no Resend API key, still succeed — message is stored in DB
    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured — message stored in DB only");
      return new Response(
        JSON.stringify({ ok: true, stored: true, email_sent: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const emailSubject = subject || "Pesan dari Form Kontak Website";

    // 1. Send notification email to school
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #8B5E3C;">Pesan Baru dari Website Palmtrees Montessori</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #8B5E3C; width: 100px;">Nama:</td><td style="padding: 8px 0;">${name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #8B5E3C;">Email:</td><td style="padding: 8px 0;">${email}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #8B5E3C;">Subjek:</td><td style="padding: 8px 0;">${emailSubject}</td></tr>
        </table>
        <h3 style="color: #8B5E3C; margin-top: 24px;">Pesan:</h3>
        <div style="background: #F5F0E6; padding: 16px; border-radius: 12px; white-space: pre-wrap; line-height: 1.6;">${message}</div>
        <p style="margin-top: 24px; color: #999; font-size: 12px;">Email ini dikirim otomatis dari form kontak website Palmtrees Montessori.</p>
      </div>
    `;

    let emailSent = false;
    let autoreplySent = false;
    let notifyError = "";
    let autoreplyError = "";

    try {
      await sendEmail(SCHOOL_EMAIL, `[Kontak Website] ${emailSubject}`, notificationHtml);
      emailSent = true;
    } catch (err) {
      notifyError = (err as Error).message;
      console.error("Failed to send notification email:", notifyError);
    }

    // 2. Send autoreply to sender
    const autoreplyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #7A9A01; font-size: 28px;">Terima Kasih, ${name}!</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.8; color: #333;">
          Kami telah menerima pesan Anda dan sangat menghargai waktu yang Anda luangkan untuk menghubungi kami.
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #333;">
          Pihak sekolah akan menghubungi Anda secepatnya untuk menindaklanjuti pesan Anda. Mohon kesabaran jika balasan kami membutuhkan waktu 1×24 jam kerja.
        </p>
        <div style="background: #F5F0E6; padding: 20px; border-radius: 16px; margin: 24px 0;">
          <p style="margin: 0; color: #8B5E3C; font-weight: bold;">Palmtrees Montessori School</p>
          <p style="margin: 4px 0 0; color: #8B5E3C; font-size: 14px;">BSD City, Tangerang Selatan</p>
          <p style="margin: 4px 0 0; color: #8B5E3C; font-size: 14px;">Email: info@palmtreesmontessori.com</p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">
          Email ini dikirim otomatis. Mohon tidak membalas email ini secara langsung.
        </p>
      </div>
    `;

    try {
      await sendEmail(email, "Terima Kasih atas Pesan Anda - Palmtrees Montessori", autoreplyHtml);
      autoreplySent = true;
    } catch (err) {
      autoreplyError = (err as Error).message;
      console.error("Failed to send autoreply:", autoreplyError);
    }

    // Update DB record with email status
    if (emailSent || autoreplySent) {
      await supabase
        .from("contact_messages")
        .update({ email_sent: emailSent, autoreply_sent: autoreplySent })
        .eq("name", name)
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        email_sent: emailSent,
        autoreply_sent: autoreplySent,
        notify_error: notifyError || undefined,
        autoreply_error: autoreplyError || undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
