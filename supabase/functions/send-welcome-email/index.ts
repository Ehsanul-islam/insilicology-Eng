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

        console.log(`Sending welcome email to ${email}`);

        // Email request body
        const emailData = {
            sender: { name: "Zymios", email: senderEmail },
            to: [{ email: email, name: name }],
            subject: "Welcome to Zymios! 🚀",
            htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #6366f1;">Welcome to Zymios!</h1>
          <p>Hi ${name},</p>
          <p>We're thrilled to have you on board. Zymios is your gateway to mastering bioinformatics and advanced data analysis.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Here is a special welcome gift for you:</p>
            <h2 style="color: #22c55e; margin: 10px 0;">WELCOME100</h2>
            <p style="margin: 0;">Use this coupon code to get <strong>$5.00 OFF</strong> your first course enrollment!</p>
          </div>

          <p>Ready to start learning? Check out our latest courses:</p>
          <p>
            <a href="${Deno.env.get("SITE_URL") || 'https://zymios.com'}/courses" 
               style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
               Browse Courses
            </a>
          </p>
          
          <p>If you have any questions, feel free to reply to this email.</p>
          <br>
          <p>Happy Learning,<br>The Zymios Team</p>
        </div>
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
