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
        <div style="background: linear-gradient(135deg, #060d1a 0%, #0a1628 50%, #1a2a4a 100%); border-radius: 12px 12px 0 0; padding: 40px 40px 36px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(0,224,150,0.08) 0%, transparent 70%); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -40px; left: -40px; width: 160px; height: 160px; background: radial-gradient(circle, rgba(0,180,216,0.06) 0%, transparent 70%); border-radius: 50%;"></div>
          <div style="position: relative;">
            <div style="display: inline-block; background: rgba(0,224,150,0.1); border: 1px solid rgba(0,224,150,0.2); border-radius: 100px; padding: 4px 14px; font-size: 11px; color: #00e096; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 16px;">
              ● You're In
            </div>
            <h1 style="color: #ffffff; font-size: 30px; font-weight: 400; margin: 0 0 10px; font-family: Georgia, serif; letter-spacing: -0.02em; line-height: 1.2;">
              You're all set, ${firstName}!
            </h1>
            <p style="color: rgba(255,255,255,0.55); font-size: 15px; margin: 0; line-height: 1.6;">
              Access to <strong style="color: rgba(255,255,255,0.9);">${resourceTitle}</strong> is ready for you below.
            </p>
          </div>
        </div>

        <div style="padding: 32px 40px 28px; background: #f9fafb;">
          <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
            Your resource is live — head back to the link to access it any time. If anything goes wrong, just reply here and I'll sort it out.
          </p>

          <div style="background: linear-gradient(135deg, #060d1a 0%, #0f1e38 100%); border: 1px solid rgba(0,224,150,0.15); border-radius: 14px; padding: 0; overflow: hidden; margin-bottom: 28px;">
            <div style="padding: 24px 24px 20px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                <div style="background: rgba(0,224,150,0.1); border: 1px solid rgba(0,224,150,0.2); border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">📘</div>
                <div>
                  <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #00e096; margin-bottom: 2px;">Mini-Course · Free</div>
                  <div style="font-size: 16px; font-weight: 600; color: #ffffff; line-height: 1.3;">${resourceTitle}</div>
                </div>
              </div>
              <div style="display: flex; gap: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06);">
                <div style="text-align: center;">
                  <div style="font-size: 18px; font-weight: 700; color: #00e096;">5</div>
                  <div style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px;">Modules</div>
                </div>
                <div style="width: 1px; background: rgba(255,255,255,0.06);"></div>
                <div style="text-align: center;">
                  <div style="font-size: 18px; font-weight: 700; color: #00e096;">17</div>
                  <div style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px;">Minutes</div>
                </div>
                <div style="width: 1px; background: rgba(255,255,255,0.06);"></div>
                <div style="text-align: center;">
                  <div style="font-size: 18px; font-weight: 700; color: #00e096;">30</div>
                  <div style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px;">Day Plan</div>
                </div>
              </div>
            </div>
          </div>

          <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 8px;">
            If you have questions or want to talk strategy, just hit reply — I read every email.
          </p>

          <p style="color: #374151; font-size: 15px; margin: 0 0 28px;">
            — Nick
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 20px;" />

          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            You're receiving this because you signed up for a free resource from <a href="https://nickeirmo.com" style="color: #6b7280; text-decoration: none;">nickeirmo.com</a>.
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
