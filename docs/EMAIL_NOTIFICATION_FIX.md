# Email Notification Fix - January 21, 2026

## Problem Summary

Users were only receiving **welcome emails** but not receiving **enrollment notification emails** (submitted, approved, rejected).

## Root Cause Analysis

### What Was Working ✅
1. **Welcome Email** - Automatically triggered via database trigger when user signs up
2. **Enrollment Submitted Email (New Enrollments)** - Called from `useEnrollment.ts` when user submits a new enrollment

### What Was Broken ❌
1. **Enrollment Submitted Email (Re-submissions)** - Not sent when user re-submits a previously cancelled enrollment
2. **Enrollment Approved Email** - Not sent when admin approves an enrollment
3. **Enrollment Rejected Email** - Not sent when admin rejects an enrollment

## Technical Details

### Issue 1: Missing Email on Re-submission
**File:** `src/hooks/useEnrollment.ts` (Lines 94-118)

**Problem:** When a user re-submits a cancelled enrollment, the code updates the enrollment status but doesn't trigger the email notification.

**Fix:** Added email notification call after successful update:
```typescript
// Send email notification (fire and forget)
supabase.functions.invoke('send-enrollment-notification', {
  body: { enrollmentId: existing.id, type: 'submitted' }
}).then(({ error }) => {
  if (error) console.error('Failed to trigger notification:', error);
}).catch(err => {
  console.error('Failed to trigger notification:', err);
});
```

### Issue 2: Missing Emails on Admin Actions
**File:** `src/hooks/useAdminData.ts` (Lines 173-204)

**Problem:** The `updateEnrollmentStatus` function updates the database but doesn't trigger email notifications when admin approves or rejects enrollments.

**Fix:** Added conditional email notifications based on status change:
```typescript
// Send email notification based on status change
if (status === 'active') {
  // Send approval email
  supabase.functions.invoke('send-enrollment-notification', {
    body: { 
      enrollmentId, 
      type: 'approved'
    }
  }).then(({ error }) => {
    if (error) console.error('Failed to send approval email:', error);
  }).catch(err => {
    console.error('Failed to send approval email:', err);
  });
} else if (status === 'cancelled' && rejectionReason) {
  // Send rejection email
  supabase.functions.invoke('send-enrollment-notification', {
    body: { 
      enrollmentId, 
      type: 'rejected',
      rejectionReason
    }
  }).then(({ error }) => {
    if (error) console.error('Failed to send rejection email:', error);
  }).catch(err => {
    console.error('Failed to send rejection email:', err);
  });
}
```

## Files Modified

1. **`src/hooks/useEnrollment.ts`**
   - Added email notification for re-submitted enrollments
   - Line ~115: Added `send-enrollment-notification` call with type 'submitted'

2. **`src/hooks/useAdminData.ts`**
   - Added email notifications for admin approval/rejection
   - Lines ~203-231: Added conditional email triggers based on status

## Email Flow After Fix

### User Journey
1. **User Signs Up** → Welcome Email ✅ (via database trigger)
2. **User Submits Enrollment** → Submitted Email ✅ (via `useEnrollment.ts`)
3. **Admin Approves** → Approved Email ✅ (via `useAdminData.ts` - **FIXED**)
4. **Admin Rejects** → Rejected Email ✅ (via `useAdminData.ts` - **FIXED**)
5. **User Re-submits After Rejection** → Submitted Email ✅ (via `useEnrollment.ts` - **FIXED**)

## Testing Instructions

### Prerequisites
Ensure these environment variables are set in Supabase Edge Functions:
```env
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=info@insilicology.com
SITE_URL=https://insilicology.com
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Test Cases

#### Test 1: New User Welcome Email
1. Create a new user account
2. **Expected:** User receives welcome email with WELCOME100 coupon

#### Test 2: Enrollment Submitted Email
1. Log in as a user
2. Submit an enrollment for a course
3. **Expected:** User receives "Enrollment Submitted" email

#### Test 3: Enrollment Approved Email (NEW FIX)
1. Log in as admin
2. Go to Admin → Enrollments
3. Approve a pending enrollment
4. **Expected:** User receives "Enrollment Approved" email with dashboard link

#### Test 4: Enrollment Rejected Email (NEW FIX)
1. Log in as admin
2. Go to Admin → Enrollments
3. Reject a pending enrollment with a reason
4. **Expected:** User receives "Enrollment Not Approved" email with rejection reason

#### Test 5: Re-submission Email (NEW FIX)
1. Have an enrollment that was previously rejected
2. Log in as that user
3. Re-submit the enrollment
4. **Expected:** User receives "Enrollment Submitted" email again

### Verification Steps

1. **Check Supabase Edge Function Logs:**
   - Go to Supabase Dashboard → Edge Functions → `send-enrollment-notification`
   - Check logs for successful invocations
   - Look for any error messages

2. **Check Brevo Dashboard:**
   - Log in to Brevo
   - Go to Campaigns → Transactional
   - Verify emails are being sent
   - Check delivery status

3. **Check Browser Console:**
   - Open browser developer tools
   - Look for any error messages related to email sending
   - Successful calls should show no errors

4. **Check Email Inbox:**
   - Verify all test emails are received
   - Check spam folder if not in inbox
   - Verify email content matches templates

## Deployment Checklist

- [x] Code changes committed
- [ ] Deploy to Vercel (frontend changes)
- [ ] Verify Supabase Edge Functions are deployed
- [ ] Test all email flows in production
- [ ] Monitor Brevo dashboard for delivery rates
- [ ] Check Supabase logs for any errors

## Environment Variables Checklist

Ensure these are set in **Supabase Edge Functions** (not Vercel):

- [ ] `BREVO_API_KEY` - Your Brevo API key
- [ ] `SENDER_EMAIL` - info@insilicology.com
- [ ] `SITE_URL` - https://insilicology.com
- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Your service role key

## Troubleshooting

### Emails Still Not Sending?

1. **Check Edge Function Deployment:**
   ```bash
   supabase functions list
   ```
   Ensure `send-enrollment-notification` is deployed

2. **Check Edge Function Logs:**
   ```bash
   supabase functions logs send-enrollment-notification
   ```

3. **Verify Environment Variables:**
   - Go to Supabase Dashboard → Settings → Edge Functions
   - Ensure all required variables are set

4. **Test Edge Function Directly:**
   ```bash
   curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-enrollment-notification' \
     -H 'Authorization: Bearer YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"enrollmentId": "test-id", "type": "submitted"}'
   ```

5. **Check Brevo API Status:**
   - Visit https://status.brevo.com/
   - Ensure service is operational

### Common Issues

**Issue:** "BREVO_API_KEY not configured"
- **Solution:** Set the environment variable in Supabase Edge Functions settings

**Issue:** "No recipient email found"
- **Solution:** Ensure user profile has email address populated

**Issue:** Emails going to spam
- **Solution:** 
  - Verify sender domain in Brevo
  - Add SPF/DKIM records to DNS
  - Test with mail-tester.com

## Related Documentation

- [Email Templates Documentation](./email-templates.md)
- [Vercel Environment Setup](./VERCEL_ENV_SETUP.md)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Brevo API Documentation](https://developers.brevo.com/)

## Notes

- Email sending is "fire and forget" - it doesn't block the UI
- Errors are logged to console but don't prevent enrollment operations
- All emails use Brevo (consolidated from previous Resend setup)
- Email templates are defined in `supabase/functions/send-enrollment-notification/index.ts`

---

**Last Updated:** January 21, 2026  
**Fixed By:** AI Assistant  
**Status:** ✅ Fixed and Ready for Testing
