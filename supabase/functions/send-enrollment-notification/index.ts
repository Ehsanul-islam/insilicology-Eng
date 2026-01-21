import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EnrollmentNotificationRequest {
  enrollmentId: string;
  type: 'submitted' | 'approved' | 'rejected';
  recipientEmail?: string;
  courseName?: string;
  userName?: string;
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");

    if (!brevoApiKey) {
      console.log("BREVO_API_KEY not configured - skipping email");
      return new Response(
        JSON.stringify({ success: true, message: "Email skipped - no API key" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const {
      enrollmentId,
      type,
      recipientEmail,
      courseName,
      userName,
      rejectionReason
    }: EnrollmentNotificationRequest = await req.json();

    // Get enrollment details if not provided
    let email = recipientEmail;
    let course = courseName;
    let name = userName;

    if (!email || !course || !name) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses:course_id (title),
          profiles:user_id (full_name, email)
        `)
        .eq('id', enrollmentId)
        .single();

      if (enrollment) {
        email = email || enrollment.profiles?.email;
        course = course || enrollment.courses?.title;
        name = name || enrollment.profiles?.full_name;
      }
    }

    if (!email) {
      return new Response(
        JSON.stringify({ error: "No recipient email found" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Build email content based on type
    let subject = "";
    let html = "";

    switch (type) {
      case 'submitted':
        subject = `Enrollment Submitted - ${course}`;
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Enrollment Submitted</h1>
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for enrolling in <strong>${course}</strong>!</p>
            <p>We have received your enrollment request and payment proof. Our team will review it within 24-48 hours.</p>
            <p>You'll receive another email once your enrollment has been approved.</p>
            <br>
            <p>Best regards,<br>The Team</p>
          </div>
        `;
        break;

      case 'approved':
        subject = `Enrollment Approved - ${course}`;
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #22c55e;">🎉 Enrollment Approved!</h1>
            <p>Hi ${name || 'there'},</p>
            <p>Great news! Your enrollment in <strong>${course}</strong> has been approved!</p>
            <p>You can now access all course materials by logging into your dashboard.</p>
            <p><a href="${Deno.env.get('SITE_URL') || ''}/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Go to Dashboard</a></p>
            <p>Happy learning!</p>
            <br>
            <p>Best regards,<br>The Team</p>
          </div>
        `;
        break;

      case 'rejected':
        subject = `Enrollment Update - ${course}`;
        html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ef4444;">Enrollment Not Approved</h1>
            <p>Hi ${name || 'there'},</p>
            <p>Unfortunately, we couldn't approve your enrollment in <strong>${course}</strong>.</p>
            ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
            <p>If you believe this is an error or would like to try again, please contact our support team or submit a new enrollment.</p>
            <br>
            <p>Best regards,<br>The Team</p>
          </div>
        `;
        break;
    }

    // Send email via Brevo
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY not configured");
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Zymios", // Or fetch from env if needed
          email: Deno.env.get("SENDER_EMAIL") || "contact@zymios.com"
        },
        to: [{ email: email, name: name }],
        subject: subject,
        htmlContent: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Brevo error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to send email via Brevo", details: data }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent successfully via Brevo:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-enrollment-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
