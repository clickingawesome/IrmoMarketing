import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LeadCaptureData {
  name: string;
  email: string;
  company?: string;
  resourceTitle: string;
  resourceSlug: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, company, resourceTitle, resourceSlug }: LeadCaptureData = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const firstName = name.split(" ")[0];

    const adminEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111; margin-bottom: 8px;">New Lead Captured!</h2>
        <p style="color: #666; margin-bottom: 24px;">Someone just downloaded your resource.</p>

        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 16px; font-size: 16px; color: #333;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 600;">Name:</td>
              <td style="padding: 8px 0; color: #111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 600;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a></td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 600;">Company:</td>
              <td style="padding: 8px 0; color: #111;">${company}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background: #f0f7ff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px; font-size: 16px; color: #333;">Resource Downloaded</h3>
          <p style="margin: 0; color: #111; font-weight: 600;">${resourceTitle}</p>
          <p style="margin: 4px 0 0; color: #666; font-size: 14px;">${resourceSlug}</p>
        </div>

        <p style="color: #999; font-size: 13px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          This lead was captured from your portfolio website.
        </p>
      </div>
    `;

    const userEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%); border-radius: 12px 12px 0 0; padding: 40px 40px 32px;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: 400; margin: 0 0 8px; font-family: Georgia, serif; letter-spacing: -0.02em;">
            You're all set, ${firstName}!
          </h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 16px; margin: 0; line-height: 1.5;">
            Thanks for downloading <strong style="color: rgba(255,255,255,0.9);">${resourceTitle}</strong>.
          </p>
        </div>

        <div style="padding: 32px 40px; background: #f9fafb; border-radius: 0 0 12px 12px;">
          <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
            Your resource is ready — if it didn't open automatically, just reply to this email and I'll send it directly.
          </p>

          <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px;">
            <p style="margin: 0; color: #111827; font-weight: 600; font-size: 15px;">${resourceTitle}</p>
            <p style="margin: 6px 0 0; color: #6b7280; font-size: 13px;">Free resource from Irmo Marketing</p>
          </div>

          <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 8px;">
            If you have questions or want to talk strategy, feel free to reply — I read every email.
          </p>

          <p style="color: #374151; font-size: 15px; margin: 0;">
            — Nick
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0 20px;" />

          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            You're receiving this because you downloaded a free resource from <a href="https://nickeirmo.com" style="color: #6b7280; text-decoration: none;">nickeirmo.com</a>.
          </p>
        </div>
      </div>
    `;

    const [adminRes, userRes] = await Promise.all([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Nick Irmo <onboarding@resend.dev>",
          to: ["nick.irmo@gmail.com"],
          reply_to: email,
          subject: `New Lead: ${name} downloaded ${resourceTitle}`,
          html: adminEmailHtml,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Nick Irmo <onboarding@resend.dev>",
          to: [email],
          reply_to: "nick.irmo@gmail.com",
          subject: `Your free resource: ${resourceTitle}`,
          html: userEmailHtml,
        }),
      }),
    ]);

    if (!adminRes.ok) {
      const error = await adminRes.text();
      throw new Error(`Resend API error (admin): ${error}`);
    }

    if (!userRes.ok) {
      const error = await userRes.text();
      throw new Error(`Resend API error (user): ${error}`);
    }

    const data = await adminRes.json();

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
