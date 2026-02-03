-- Add transaction_id column to enrollments table
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS transaction_id TEXT;

-- Add comment for documentation
COMMENT ON COLUMN enrollments.transaction_id IS 'Payment transaction ID provided by user during enrollment';
