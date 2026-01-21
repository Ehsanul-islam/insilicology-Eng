import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

interface EnrollmentNotificationRequest {
    enrollmentId: string;
    type: "submitted" | "approved" | "rejected";
    recipientEmail?: string;
    recipientName?: string;
    courseName?: string;
    rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const brevoApiKey = Deno.env.get("BREVO_API_KEY");
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!brevoApiKey) {
            console.error("BREVO_API_KEY not configured");
            return new Response(
                JSON.stringify({ error: "Configuration Error: BREVO_API_KEY missing" }),
                { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
        }

        const {
            enrollmentId,
            type,
            recipientEmail,
            recipientName,
            courseName,
            rejectionReason,
        }: EnrollmentNotificationRequest = await req.json();

        if (!enrollmentId || !type) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: enrollmentId and type" }),
                { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
        }

        let email = recipientEmail;
        let name = recipientName;
        let course = courseName;
        let reason = rejectionReason;

        // If email/name/course not provided, fetch from database
        if (!email || !name || !course) {
            if (!supabaseUrl || !supabaseServiceKey) {
                return new Response(
                    JSON.stringify({ error: "Supabase credentials not configured" }),
                    { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
                );
            }

            const supabase = createClient(supabaseUrl, supabaseServiceKey);

            const { data: enrollment, error: fetchError } = await supabase
                .from("enrollments")
                .select(`
          id,
          user_email,
          user_name,
          course_title,
          rejection_reason
        `)
                .eq("id", enrollmentId)
                .single();

            if (fetchError || !enrollment) {
                console.error("Error fetching enrollment:", fetchError);
                return new Response(
                    JSON.stringify({ error: "Enrollment not found" }),
                    { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
                );
            }

            email = enrollment.user_email;
            name = enrollment.user_name || "Student";
            course = enrollment.course_title;
            reason = enrollment.rejection_reason || rejectionReason;
        }

        console.log(`Sending ${type} email to: ${email} for course: ${course}`);

        // Brevo API Endpoint
        const url = "https://api.brevo.com/v3/smtp/email";

        // Sender configuration
        const senderEmail = Deno.env.get("SENDER_EMAIL") || "noreply@zymios.com";
        const senderName = "Zymios";
        const siteUrl = Deno.env.get("SITE_URL") || "https://zymios.com";

        // Email content based on type
        let subject = "";
        let htmlContent = "";

        switch (type) {
            case "submitted":
                subject = `Enrollment Submitted - ${course}`;
                htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Enrollment Received! ✅</h1>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${name},</p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Thank you for your interest in <strong>${course}</strong>!
              </p>
              
              <div style="background-color: #f0f7ff; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0;">
                  <strong>📋 What's Next?</strong><br><br>
                  Our team is reviewing your enrollment request. We'll verify your payment details and get back to you within <strong>24-48 hours</strong>.
                </p>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                You'll receive a confirmation email once your enrollment is approved. In the meantime, feel free to explore our other courses!
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${siteUrl}/courses" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                  Browse More Courses
                </a>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Best regards,<br>
                <strong>The Zymios Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p style="margin: 5px 0;">© 2026 Zymios. All rights reserved.</p>
            </div>
          </div>
        `;
                break;

            case "approved":
                subject = `Enrollment Approved - ${course} 🎉`;
                htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
            <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Enrollment Approved! 🎉</h1>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${name},</p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Great news! Your enrollment in <strong>${course}</strong> has been approved!
              </p>
              
              <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 10px; margin: 30px 0; text-align: center;">
                <p style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">🚀 You're All Set!</p>
                <p style="color: white; font-size: 14px; margin: 0 0 20px 0;">
                  Further details, including the workshop schedule, joining links, and preparatory instructions, will be shared via email and will also be available on your dashboard.
                </p>
                <a href="${siteUrl}/dashboard" 
                   style="display: inline-block; background-color: white; color: #f5576c; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                  Go to Dashboard
                </a>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                We're excited to have you on board. Get ready for an amazing learning experience!
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Happy learning! 🚀
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                Best regards,<br>
                <strong>The Zymios Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p style="margin: 5px 0;">© 2026 Zymios. All rights reserved.</p>
            </div>
          </div>
        `;
                break;

            case "rejected":
                subject = `Enrollment Update - ${course}`;
                htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Enrollment Update</h1>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${name},</p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Thank you for your interest in <strong>${course}</strong>.
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Unfortunately, we were unable to approve your enrollment at this time.
              </p>
              
              ${reason ? `
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 5px;">
                  <p style="color: #856404; font-size: 15px; line-height: 1.6; margin: 0;">
                    <strong>Reason:</strong><br><br>
                    ${reason}
                  </p>
                </div>
              ` : ''}
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                If you have any questions or would like to discuss this further, please don't hesitate to contact us. We're here to help!
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${siteUrl}/contact" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                  Contact Us
                </a>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                We appreciate your understanding and hope to see you in our courses soon!
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                Best regards,<br>
                <strong>The Zymios Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p style="margin: 5px 0;">© 2026 Zymios. All rights reserved.</p>
            </div>
          </div>
        `;
                break;

            default:
                return new Response(
                    JSON.stringify({ error: "Invalid email type" }),
                    { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
                );
        }

        const emailPayload = {
            sender: {
                name: senderName,
                email: senderEmail,
            },
            to: [
                {
                    email: email,
                    name: name,
                },
            ],
            subject: subject,
            htmlContent: htmlContent,
        };

        console.log("Sending email via Brevo to:", email);

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
        console.error("Error in send-enrollment-notification:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }
};

serve(handler);

