-- Add payment configuration columns to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS payment_link TEXT,
ADD COLUMN IF NOT EXISTS payment_qr_code_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN courses.payment_link IS 'Razorpay or payment gateway link for manual payments';
COMMENT ON COLUMN courses.payment_qr_code_url IS 'URL to QR code image stored in Supabase storage';
