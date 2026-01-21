import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
    type: string;
    table: string;
    schema: string;
    record: {
        id: string;
        email: string;
        raw_user_meta_data?: {
            full_name?: string;
            name?: string;
        };
    };
    old_record: null | Record<string, unknown>;
}

const handler = async (req: Request): Promise<Response> => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const brevoApiKey = Deno.env.get("BREVO_API_KEY");

        if (!brevoApiKey) {
            console.error("BREVO_API_KEY not configured");
            return new Response(
                JSON.stringify({ error: "Configuration Error: BREVO_API_KEY missing" }),
                { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
        }

        const payload: WebhookPayload = await req.json();
        console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

        // Extract email and name from the payload
        const userEmail = payload.record.email;
        const userName =
            payload.record.raw_user_meta_data?.full_name ||
            payload.record.raw_user_meta_data?.name ||
            "Learner";

        if (!userEmail) {
            console.error("No email found in payload");
            return new Response(
                JSON.stringify({ error: "No email found in payload" }),
                { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
        }

        console.log(`Sending welcome email to: ${userEmail} (${userName})`);

        // Brevo API Endpoint
        const url = "https://api.brevo.com/v3/smtp/email";

        // Sender configuration
        const senderEmail = Deno.env.get("SENDER_EMAIL") || "info@insilicology.com";
        const senderName = "Insilicology";

        const emailPayload = {
            sender: {
                name: senderName,
                email: senderEmail,
            },
            to: [
                {
                    email: userEmail,
                    name: userName,
                },
            ],
            subject: "Welcome to Insilicology - Start Your Learning Journey!",
            htmlContent: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Insilicology! 🎉</h1>
          </div>
          
          <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${userName},</p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining <strong>Insilicology</strong> - your gateway to mastering bioinformatics and computational biology!
            </p>
            
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 10px; margin: 30px 0; text-align: center;">
              <p style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">🎁 Special Welcome Gift!</p>
              <p style="color: white; font-size: 14px; margin: 0 0 15px 0;">Use this coupon code to get started:</p>
              <div style="background-color: white; padding: 15px 25px; border-radius: 8px; display: inline-block;">
                <code style="color: #f5576c; font-size: 24px; font-weight: 700; letter-spacing: 2px;">WELCOME100</code>
              </div>
              <p style="color: white; font-size: 13px; margin: 15px 0 0 0; opacity: 0.9;">Apply at checkout for exclusive benefits!</p>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              We're excited to have you on board. Explore our courses, connect with fellow learners, and start your journey towards becoming a bioinformatics expert.
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${Deno.env.get('SITE_URL') || 'https://insilicology.com'}/courses" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                Explore Courses
              </a>
            </div>
            
            <div style="border-top: 2px solid #f0f0f0; margin-top: 30px; padding-top: 20px;">
              <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                <strong>What's next?</strong>
              </p>
              <ul style="color: #666; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                <li>Browse our comprehensive course catalog</li>
                <li>Complete your profile to personalize your experience</li>
                <li>Join our community of learners</li>
                <li>Start your first course today!</li>
              </ul>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
              Happy learning! 🚀
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 20px;">
              Best regards,<br>
              <strong>The Insilicology Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p style="margin: 5px 0;">© 2026 Insilicology. All rights reserved.</p>
            <p style="margin: 5px 0;">
              <a href="${Deno.env.get('SITE_URL') || 'https://insilicology.com'}" style="color: #667eea; text-decoration: none;">Visit Website</a> | 
              <a href="${Deno.env.get('SITE_URL') || 'https://insilicology.com'}/contact" style="color: #667eea; text-decoration: none;">Contact Us</a>
            </p>
          </div>
        </div>
      `,
        };

        console.log("Sending email via Brevo to:", userEmail);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": brevoApiKey,
                "content-type": "application/json",
            },
            body: JSON.stringify(emailPayload),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Brevo API error:", data);
            return new Response(
                JSON.stringify({ error: "Failed to send email via Brevo", details: data }),
                { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
        }

        console.log("Brevo email sent successfully:", data);

        return new Response(
            JSON.stringify({ success: true, messageId: data.messageId }),
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
