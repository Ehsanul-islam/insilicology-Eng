import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
    email: string;
    name?: string;
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { email, name } = (await req.json()) as WelcomeEmailRequest;

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Get environment variables
        const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
        const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL") || "noreply@zymios.com";
        const SITE_URL = Deno.env.get("SITE_URL") || "https://zymios.com";

        if (!BREVO_API_KEY) {
            console.error("BREVO_API_KEY is not set");
            return new Response(
                JSON.stringify({ error: "Email service not configured" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const recipientName = name || email.split("@")[0];
        const dashboardUrl = `${SITE_URL}/dashboard`;

        // Build HTML email template
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Zymios!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Zymios! 🚀</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi <strong>${recipientName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for joining <strong>Zymios</strong>! We're excited to have you as part of our learning community.
              </p>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                To get you started, we're giving you a special welcome gift:
              </p>

              <!-- Coupon Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                      Your Welcome Coupon
                    </p>
                    <p style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 2px;">
                      WELCOME100
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 14px; color: #ffffff;">
                      Get $100 off your first course!
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Simply apply this coupon code at checkout when enrolling in any course.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Browse Courses
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                If you have any questions, feel free to reach out to us at <a href="mailto:${SENDER_EMAIL}" style="color: #667eea; text-decoration: none;">${SENDER_EMAIL}</a>.
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Happy learning!<br>
                <strong>The Zymios Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #666666;">
                © ${new Date().getFullYear()} Zymios. All rights reserved.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666666;">
                <a href="${SITE_URL}" style="color: #667eea; text-decoration: none;">Visit our website</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

        // Send email via Brevo API
        const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: "Zymios",
                    email: SENDER_EMAIL,
                },
                to: [
                    {
                        email: email,
                        name: recipientName,
                    },
                ],
                subject: "Welcome to Zymios! 🚀",
                htmlContent: htmlContent,
            }),
        });

        if (!brevoResponse.ok) {
            const errorText = await brevoResponse.text();
            console.error("Brevo API error:", errorText);
            return new Response(
                JSON.stringify({ error: "Failed to send email", details: errorText }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const result = await brevoResponse.json();
        console.log("Welcome email sent successfully:", { email, messageId: result.messageId });

        return new Response(
            JSON.stringify({ success: true, messageId: result.messageId }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
