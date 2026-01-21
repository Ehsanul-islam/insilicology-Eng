import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  schema: string;
  record: {
    id: string;
    email: string;
    raw_user_meta_data?: {
      full_name?: string;
    };
  };
  old_record: null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("BREVO_API_KEY");
    const senderEmail = Deno.env.get("SENDER_EMAIL") || "contact@zymios.com";

    if (!apiKey) {
      console.error("BREVO_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const payload: WebhookPayload = await req.json();
    const { record } = payload;

    // Safety check: ensure we have an email
    if (!record || !record.email) {
      console.error("No email in record:", record);
      return new Response(
        JSON.stringify({ error: "No email provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const email = record.email;
    const name = record.raw_user_meta_data?.full_name || "there";
    const dashboardUrl = Deno.env.get("SITE_URL") || 'https://zymios.com';

    console.log(`Sending welcome email to ${email}`);

    // Email request body
    const emailData = {
      sender: { name: "Zymios", email: senderEmail },
      to: [{ email: email, name: name }],
      subject: "Welcome to Zymios! 🚀",
      htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Zymios</title>
</head>
<body style="margin:0; padding:0; background:#f5f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, Arial, sans-serif;">
  
  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
    
    <!-- Header -->
    <div style="padding:32px 32px 16px;">
      <h1 style="margin:0; font-size:22px; font-weight:700; color:#111827;">
        Zymios
      </h1>
    </div>
    <!-- Content -->
    <div style="padding:0 32px 32px;">
      
      <p style="font-size:16px; color:#111827; margin:0 0 16px;">
        Hi ${name},
      </p>
      <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 16px;">
        Welcome to <strong>Zymios</strong>.
      </p>
      <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 24px;">
        You now have access to a learning platform built for research skills, computational science, and long-term career growth — not just courses.
      </p>
      <p style="font-size:15px; line-height:1.6; color:#374151; margin:0 0 24px;">
        As a new member, you can use the code below on your first workshop:
      </p>
      <!-- Coupon -->
      <div style="border:1px dashed #d1d5db; border-radius:8px; padding:16px; text-align:center; margin-bottom:32px;">
        <div style="font-size:24px; font-weight:700; letter-spacing:1px; color:#111827;">
          WELCOME100
        </div>
        <div style="font-size:13px; color:#6b7280; margin-top:6px;">
          Valid on your first enrollment
        </div>
      </div>
      <!-- CTA -->
      <a href="${dashboardUrl}/courses"
         style="display:inline-block; background:#111827; color:#ffffff; text-decoration:none; padding:14px 22px; border-radius:8px; font-size:15px; font-weight:600;">
        Explore Courses
      </a>
      <p style="font-size:13px; color:#6b7280; margin-top:32px;">
        If you need help, just reply to this email — we actually read them.
      </p>
      <p style="font-size:14px; color:#374151; margin-top:24px;">
        — Team Zymios
      </p>
    </div>
    <!-- Footer -->
    <div style="padding:20px 32px; border-top:1px solid #e5e7eb; font-size:12px; color:#9ca3af;">
      © ${new Date().getFullYear()} Zymios · 
      <a href="${dashboardUrl}" style="color:#6b7280; text-decoration:none;">Website</a> · 
      <a href="mailto:${senderEmail}" style="color:#6b7280; text-decoration:none;">Support</a>
    </div>
  </div>
</body>
</html>
      `,
    };

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo API error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to send email via Brevo", details: data }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Welcome email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-welcome-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
