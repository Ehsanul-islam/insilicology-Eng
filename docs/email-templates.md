# Automatic Email Templates

This document contains all email templates used in the Insilicology platform's automated email system.

## Email Providers

- **Brevo**: Used for welcome emails
- **Resend**: Used for enrollment notifications

## Template Overview

| Email Type | Trigger | Provider | Subject |
|------------|---------|----------|---------|
| Welcome Email | New User Sign Up | Brevo | Welcome to Insilicology! 🚀 |
| Enrollment Submitted | User submits enrollment form | Resend | Enrollment Submitted - ${courseName} |
| Enrollment Approved | Admin approves enrollment | Resend | Enrollment Approved - ${courseName} |
| Enrollment Rejected | Admin rejects enrollment | Resend | Enrollment Update - ${courseName} |

---

## 1. Welcome Email

**Trigger:** New User Sign Up  
**Provider:** Brevo  
**Subject:** `Welcome to Insilicology! 🚀`

### Variables
- `${name}` - User's name
- `${dashboardUrl}` - Dashboard URL
- `${senderEmail}` - Support email address
- `${new Date().getFullYear()}` - Current year

### Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Insilicology</title>
</head>
<body style="margin:0; padding:0; background:#f5f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, Arial, sans-serif;">
  
  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
    
    <!-- Header -->
    <div style="padding:32px 32px 16px;">
      <h1 style="margin:0; font-size:22px; font-weight:700; color:#111827;">
        Insilicology
      </h1>
    </div>
    <!-- Content -->
    <div style="padding:0 32px 32px;">
      
      <p style="font-size:16px; color:#111827; margin:0 0 16px;">
        Hi ${name},
      </p>
      <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 16px;">
        Welcome to <strong>Insilicology</strong>.
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
        — Team Insilicology
      </p>
    </div>
    <!-- Footer -->
    <div style="padding:20px 32px; border-top:1px solid #e5e7eb; font-size:12px; color:#9ca3af;">
      © ${new Date().getFullYear()} Insilicology · 
      <a href="${dashboardUrl}" style="color:#6b7280; text-decoration:none;">Website</a> · 
      <a href="mailto:${senderEmail}" style="color:#6b7280; text-decoration:none;">Support</a>
    </div>
  </div>
</body>
</html>
```

---

## 2. Enrollment Submitted

**Trigger:** User submits enrollment form  
**Provider:** Resend  
**Subject:** `Enrollment Submitted - ${courseName}`

### Variables
- `${name}` - User's name (optional, defaults to 'there')
- `${course}` - Course name
- `${courseName}` - Course name (for subject line)

### Template

```html
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #333;">Enrollment Submitted</h1>
  <p>Hi ${name || 'there'},</p>
  <p>Thank you for enrolling in <strong>${course}</strong>!</p>
  <p>We have received your enrollment request and payment proof. Our team will review it within 24-48 hours.</p>
  <p>You'll receive another email once your enrollment has been approved.</p>
  <br>
  <p>Best regards,<br>The Team</p>
</div>
```

---

## 3. Enrollment Approved

**Trigger:** Admin approves enrollment  
**Provider:** Resend  
**Subject:** `Enrollment Approved - ${courseName}`

### Variables
- `${name}` - User's name (optional, defaults to 'there')
- `${course}` - Course name
- `${courseName}` - Course name (for subject line)
- `${Deno.env.get('SITE_URL')}` - Site URL from environment

### Template

```html
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
```

---

## 4. Enrollment Rejected

**Trigger:** Admin rejects enrollment  
**Provider:** Resend  
**Subject:** `Enrollment Update - ${courseName}`

### Variables
- `${name}` - User's name (optional, defaults to 'there')
- `${course}` - Course name
- `${courseName}` - Course name (for subject line)
- `${rejectionReason}` - Optional reason for rejection

### Template

```html
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #ef4444;">Enrollment Not Approved</h1>
  <p>Hi ${name || 'there'},</p>
  <p>Unfortunately, we couldn't approve your enrollment in <strong>${course}</strong>.</p>
  ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
  <p>If you believe this is an error or would like to try again, please contact our support team or submit a new enrollment.</p>
  <br>
  <p>Best regards,<br>The Team</p>
</div>
```

---

## Implementation Notes

### Environment Variables Required

```env
# Brevo (for welcome emails)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=info@insilicology.com
BREVO_SENDER_NAME=Insilicology

# Resend (for enrollment notifications)
RESEND_API_KEY=your_resend_api_key

# General
SITE_URL=https://insilicology.com
```

### Edge Functions

1. **send-welcome-email** (Brevo)
   - Triggered by database trigger on user sign-up
   - Sends welcome email with WELCOME100 coupon

2. **send-enrollment-notification** (Resend)
   - Called from frontend on enrollment status changes
   - Handles submitted, approved, and rejected states

### Database Trigger

The welcome email is automatically sent via a PostgreSQL trigger:

```sql
-- Trigger function in: supabase/migrations/20260121123000_welcome_email_trigger.sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION send_welcome_email();
```

---

## Design Guidelines

### Welcome Email (Brevo)
- Modern, professional design
- Clean typography with system fonts
- Subtle shadows and rounded corners
- Prominent coupon code display
- Clear call-to-action button
- Responsive design for mobile

### Enrollment Emails (Resend)
- Simple, functional design
- Color-coded status indicators:
  - Submitted: Neutral (#333)
  - Approved: Success green (#22c55e)
  - Rejected: Error red (#ef4444)
- Clear next steps for users
- Consistent branding

---

## Testing

To test these templates:

1. **Welcome Email**: Create a new user account
2. **Enrollment Submitted**: Submit an enrollment form
3. **Enrollment Approved**: Approve an enrollment in admin panel
4. **Enrollment Rejected**: Reject an enrollment in admin panel

---

## Maintenance

When updating templates:

1. Update this documentation
2. Update the corresponding Edge Function
3. Test with real email addresses
4. Verify mobile responsiveness
5. Check spam score using mail-tester.com

---

*Last updated: January 21, 2026*
