-- =====================================================
-- Certificate System Enhancement Migration
-- Adds download permissions, 6-digit verification codes,
-- and tracking fields for the new certificate workflow
-- =====================================================

-- Add download permission control to certificates table
ALTER TABLE certificates 
  ADD COLUMN IF NOT EXISTS download_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS enabled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS enabled_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS downloaded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;

-- Add 6-digit verification code (easier for users to type)
ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6);

-- Add completion tracking to enrollments
ALTER TABLE enrollments 
  ADD COLUMN IF NOT EXISTS marked_complete_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS marked_complete_at TIMESTAMPTZ;

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_certificates_download_enabled 
  ON certificates(download_enabled);

CREATE INDEX IF NOT EXISTS idx_certificates_enabled_at 
  ON certificates(enabled_at);

CREATE INDEX IF NOT EXISTS idx_certificates_verification_code 
  ON certificates(verification_code);

CREATE INDEX IF NOT EXISTS idx_enrollments_status_completion 
  ON enrollments(status, completion_date) 
  WHERE status = 'completed';

-- Add helpful comments for schema documentation
COMMENT ON COLUMN certificates.download_enabled IS 
  'Admin approval flag - false means certificate exists but pending approval for download';

COMMENT ON COLUMN certificates.verification_code IS 
  'User-friendly 6-digit code for easy certificate verification (e.g., 123456)';

COMMENT ON COLUMN certificates.enabled_at IS 
  'Timestamp when admin enabled certificate download';

COMMENT ON COLUMN certificates.enabled_by IS 
  'Admin user ID who approved certificate for download';

COMMENT ON COLUMN certificates.downloaded_at IS 
  'Timestamp of first certificate download';

COMMENT ON COLUMN certificates.download_count IS 
  'Number of times certificate has been downloaded';

-- Function to generate unique 6-digit verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR(6) AS $$
DECLARE
  new_code VARCHAR(6);
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 6-digit number (100000 to 999999)
    new_code := LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
    
    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM certificates WHERE verification_code = new_code
    ) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate verification code if not provided
CREATE OR REPLACE FUNCTION set_verification_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_code IS NULL THEN
    NEW.verification_code := generate_verification_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_verification_code
  BEFORE INSERT ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION set_verification_code();

-- Update existing certificates with verification codes and download enabled
-- (This ensures backward compatibility - existing certs are immediately available)
DO $$
DECLARE
  cert_record RECORD;
BEGIN
  FOR cert_record IN 
    SELECT id FROM certificates WHERE verification_code IS NULL
  LOOP
    UPDATE certificates 
    SET 
      verification_code = generate_verification_code(),
      download_enabled = true,  -- Enable existing certificates by default
      enabled_at = NOW()
    WHERE id = cert_record.id;
  END LOOP;
END $$;

-- Grant necessary permissions for the new columns
-- (Assuming RLS is enabled, adjust based on your security policies)

-- Allow users to view their own certificates with download status
-- Allow admins to manage all certificates

COMMENT ON TABLE certificates IS 
  'Stores course completion certificates with download permission controls and verification codes';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Certificate enhancement migration completed successfully!';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  - Download permission control (download_enabled)';
  RAISE NOTICE '  - 6-digit verification codes';
  RAISE NOTICE '  - Download tracking (count, timestamp)';
  RAISE NOTICE '  - Audit trail (enabled_by, enabled_at)';
  RAISE NOTICE 'All existing certificates have been enabled for download by default.';
END $$;
