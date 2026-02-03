import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnrollmentNotificationRequest {
    enrollmentId: string;
    type: "submitted" | "approved" | "rejected";
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { enrollmentId, type } = (await req.json()) as EnrollmentNotificationRequest;

        if (!enrollmentId || !type) {
            return new Response(
                JSON.stringify({ error: "enrollmentId and type are required" }),
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
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

        // Create Supabase client with service role key
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Fetch enrollment details with user and course information
        const { data: enrollment, error: fetchError } = await supabase
            .from("enrollments")
            .select(`
        id,
        status,
        rejection_reason,
        user_id,
        course_id,
        profiles!enrollments_user_id_fkey (
          full_name,
          email
        ),
        courses (
          title,
          slug
        )
      `)
            .eq("id", enrollmentId)
            .single();

        if (fetchError || !enrollment) {
            console.error("Error fetching enrollment:", fetchError);
            return new Response(
                JSON.stringify({ error: "Enrollment not found" }),
                {
                    status: 404,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const userEmail = enrollment.profiles?.email;
        const userName = enrollment.profiles?.full_name || userEmail?.split("@")[0] || "Student";
        const courseTitle = enrollment.courses?.title || "Course";
        const courseSlug = enrollment.courses?.slug || "";
        const dashboardUrl = `${SITE_URL}/dashboard`;
        const courseUrl = `${SITE_URL}/courses/${courseSlug}`;

        if (!userEmail) {
            console.error("User email not found for enrollment:", enrollmentId);
            return new Response(
                JSON.stringify({ error: "User email not found" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        let subject = "";
        let htmlContent = "";

        // Build email based on type
        switch (type) {
            case "submitted":
                subject = `Enrollment Submitted - ${courseTitle}`;
                htmlContent = buildSubmittedEmail(userName, courseTitle, SENDER_EMAIL, SITE_URL);
                break;

            case "approved":
                subject = `Enrollment Approved - ${courseTitle} 🎉`;
                htmlContent = buildApprovedEmail(userName, courseTitle, dashboardUrl, SENDER_EMAIL, SITE_URL);
                break;

            case "rejected": {
                subject = `Enrollment Update - ${courseTitle}`;
                const rejectionReason = enrollment.rejection_reason || "Please contact support for more details.";
                htmlContent = buildRejectedEmail(userName, courseTitle, rejectionReason, courseUrl, SENDER_EMAIL, SITE_URL);
                break;
            }

            default:
                return new Response(
                    JSON.stringify({ error: "Invalid notification type" }),
                    {
                        status: 400,
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    }
                );
        }

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
                        email: userEmail,
                        name: userName,
                    },
                ],
                subject: subject,
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
        console.log(`Enrollment ${type} email sent successfully:`, {
            enrollmentId,
            email: userEmail,
            messageId: result.messageId
        });

        return new Response(
            JSON.stringify({ success: true, messageId: result.messageId }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error sending enrollment notification:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});

// Email template builders
function buildSubmittedEmail(userName: string, courseTitle: string, senderEmail: string, siteUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enrollment Submitted</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Enrollment Submitted ✓</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for your interest in <strong>${courseTitle}</strong>!
              </p>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                We have received your enrollment request and payment information. Our team will review your submission within <strong>24-48 hours</strong>.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8f9fa; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                      <strong>What happens next?</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #666666; line-height: 1.8;">
                      <li>We'll verify your payment information</li>
                      <li>You'll receive a confirmation email once approved</li>
                      <li>You'll get instant access to the course dashboard</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                If you have any questions, please contact us at <a href="mailto:${senderEmail}" style="color: #667eea; text-decoration: none;">${senderEmail}</a>.
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Zymios Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #666666;">
                © ${new Date().getFullYear()} Zymios. All rights reserved.
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
}

function buildApprovedEmail(userName: string, courseTitle: string, dashboardUrl: string, senderEmail: string, siteUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enrollment Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Enrollment Approved! 🎉</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; color: #333333; font-weight: 600;">
                Congratulations! Your enrollment in <strong>${courseTitle}</strong> has been approved! 🎊
              </p>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                You now have full access to all course materials, lessons, and resources. We're excited to have you on this learning journey!
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #166534;">
                      <strong>Ready to get started?</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #166534; line-height: 1.8;">
                      <li>Access your course dashboard</li>
                      <li>Start with the first lesson</li>
                      <li>Join our community discussions</li>
                      <li>Track your progress</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                If you need any help, we're here for you at <a href="mailto:${senderEmail}" style="color: #10b981; text-decoration: none;">${senderEmail}</a>.
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Happy learning!<br>
                <strong>The Zymios Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #666666;">
                © ${new Date().getFullYear()} Zymios. All rights reserved.
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
}

function buildRejectedEmail(userName: string, courseTitle: string, rejectionReason: string, courseUrl: string, senderEmail: string, siteUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enrollment Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Enrollment Update</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for your interest in <strong>${courseTitle}</strong>.
              </p>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Unfortunately, we couldn't approve your enrollment at this time. Here's why:
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                      <strong>Reason:</strong><br>
                      ${rejectionReason}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                <strong>What you can do:</strong>
              </p>

              <ul style="margin: 0 0 20px 0; padding-left: 20px; font-size: 16px; color: #333333; line-height: 1.8;">
                <li>Review the reason above and make necessary corrections</li>
                <li>Contact us at <a href="mailto:${senderEmail}" style="color: #f59e0b; text-decoration: none;">${senderEmail}</a> for clarification</li>
                <li>Submit a new enrollment request with updated information</li>
              </ul>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${courseUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Try Again
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                We're here to help! If you have any questions or need assistance, please don't hesitate to reach out.
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Zymios Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #666666;">
                © ${new Date().getFullYear()} Zymios. All rights reserved.
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
}
