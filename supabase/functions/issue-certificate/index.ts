import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate certificate number: CERT-YYYY-XXXXXX
function generateCertificateNumber(): string {
  const year = new Date().getFullYear()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `CERT-${year}-${randomPart}`
}

// Generate verification hash
function generateVerificationHash(): string {
  return Array.from({ length: 32 }, () =>
    Math.random().toString(36).charAt(2)
  ).join('').toUpperCase()
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user is an admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    })

    if (!isAdmin) {
      console.error('User is not an admin')
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, ...params } = await req.json()
    
    console.log(`Certificate action: ${action}`, params)

    switch (action) {
      case 'issue': {
        const { userId, courseId, courseName, recipientName } = params
        
        if (!userId || !courseId || !courseName || !recipientName) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if certificate already exists
        const { data: existing } = await supabase
          .from('certificates')
          .select('id')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .eq('is_active', true)
          .maybeSingle()

        if (existing) {
          return new Response(
            JSON.stringify({ error: 'Certificate already exists for this user and course' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const certificateNumber = generateCertificateNumber()
        const verificationHash = generateVerificationHash()
        const completionDate = new Date().toISOString().split('T')[0]

        const { data: certificate, error: insertError } = await supabase
          .from('certificates')
          .insert({
            user_id: userId,
            course_id: courseId,
            course_name: courseName,
            recipient_name: recipientName,
            certificate_number: certificateNumber,
            verification_hash: verificationHash,
            completion_date: completionDate,
            issue_date: completionDate,
            is_active: true,
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error issuing certificate:', insertError)
          return new Response(
            JSON.stringify({ error: 'Failed to issue certificate' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update enrollment status to completed
        await supabase
          .from('enrollments')
          .update({ 
            status: 'completed',
            completion_date: new Date().toISOString(),
            progress_percentage: 100
          })
          .eq('user_id', userId)
          .eq('course_id', courseId)

        console.log(`Certificate issued: ${certificateNumber} for user ${userId}`)

        return new Response(
          JSON.stringify({ success: true, certificate }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'revoke': {
        const { certificateId, reason } = params
        
        if (!certificateId) {
          return new Response(
            JSON.stringify({ error: 'Certificate ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error: updateError } = await supabase
          .from('certificates')
          .update({ 
            is_active: false,
            certificate_data: { revoked_at: new Date().toISOString(), revoked_reason: reason || 'Admin revoked' }
          })
          .eq('id', certificateId)

        if (updateError) {
          console.error('Error revoking certificate:', updateError)
          return new Response(
            JSON.stringify({ error: 'Failed to revoke certificate' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log(`Certificate revoked: ${certificateId}`)

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'reinstate': {
        const { certificateId } = params
        
        if (!certificateId) {
          return new Response(
            JSON.stringify({ error: 'Certificate ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error: updateError } = await supabase
          .from('certificates')
          .update({ is_active: true })
          .eq('id', certificateId)

        if (updateError) {
          console.error('Error reinstating certificate:', updateError)
          return new Response(
            JSON.stringify({ error: 'Failed to reinstate certificate' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log(`Certificate reinstated: ${certificateId}`)

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Error in certificate action:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
