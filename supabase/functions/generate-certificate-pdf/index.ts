import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CertificateData {
  id: string
  recipient_name: string
  course_name: string
  completion_date: string
  issue_date: string
  certificate_number: string
  verification_hash: string
}

// Generate a simple PDF certificate using pure TypeScript
function generateCertificatePDF(cert: CertificateData, verificationUrl: string): string {
  const completionDate = new Date(cert.completion_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  const issueDate = new Date(cert.issue_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Create PDF content using basic PDF structure
  // This is a simplified PDF that creates a certificate layout
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length 7 0 R >>
stream
BT
/F1 48 Tf
0.2 0.4 0.6 rg
200 480 Td
(CERTIFICATE) Tj
ET
BT
/F1 24 Tf
0.2 0.4 0.6 rg
220 440 Td
(OF COMPLETION) Tj
ET
BT
/F2 14 Tf
0.3 0.3 0.3 rg
180 380 Td
(This is to certify that) Tj
ET
BT
/F1 28 Tf
0 0 0 rg
${Math.max(100, 421 - cert.recipient_name.length * 7)} 340 Td
(${escapePDFString(cert.recipient_name)}) Tj
ET
BT
/F2 14 Tf
0.3 0.3 0.3 rg
150 300 Td
(has successfully completed the course) Tj
ET
BT
/F1 22 Tf
0.2 0.4 0.6 rg
${Math.max(80, 421 - cert.course_name.length * 6)} 260 Td
(${escapePDFString(cert.course_name)}) Tj
ET
BT
/F2 12 Tf
0.4 0.4 0.4 rg
280 200 Td
(Completed on: ${completionDate}) Tj
ET
BT
/F2 12 Tf
0.4 0.4 0.4 rg
300 180 Td
(Issued on: ${issueDate}) Tj
ET
BT
/F2 10 Tf
0.5 0.5 0.5 rg
250 120 Td
(Certificate Number: ${cert.certificate_number}) Tj
ET
BT
/F2 8 Tf
0.5 0.5 0.5 rg
220 100 Td
(Verification: ${cert.verification_hash}) Tj
ET
BT
/F2 8 Tf
0.2 0.4 0.6 rg
280 80 Td
(Verify at: ${verificationUrl}) Tj
ET
BT
/F1 14 Tf
0.2 0.4 0.6 rg
360 50 Td
(LearnCraft) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
7 0 obj
${getStreamLength(cert, completionDate, issueDate)}
endobj
xref
0 8
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
trailer
<< /Size 8 /Root 1 0 R >>
startxref
%%EOF`

  return pdfContent
}

function escapePDFString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function getStreamLength(cert: CertificateData, completionDate: string, issueDate: string): number {
  // Approximate stream length calculation
  return 1200 + cert.recipient_name.length + cert.course_name.length + cert.certificate_number.length + cert.verification_hash.length
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

    // Verify the user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { certificateId } = await req.json()
    
    if (!certificateId) {
      return new Response(
        JSON.stringify({ error: 'Certificate ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Generating PDF for certificate: ${certificateId}, user: ${user.id}`)

    // Fetch the certificate (user can only get their own certificates)
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', certificateId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (certError) {
      console.error('Certificate fetch error:', certError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch certificate' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!certificate) {
      console.error('Certificate not found or not authorized')
      return new Response(
        JSON.stringify({ error: 'Certificate not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate verification URL
    const verificationUrl = `learncraft.com/verify`

    // Generate PDF
    const pdfContent = generateCertificatePDF(certificate as CertificateData, verificationUrl)
    const pdfBase64 = btoa(pdfContent)

    console.log(`PDF generated successfully for certificate: ${certificate.certificate_number}`)

    return new Response(
      JSON.stringify({ 
        pdfBase64,
        certificateNumber: certificate.certificate_number 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error generating certificate PDF:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
