-- Create payment-screenshots storage bucket
-- This bucket stores payment proof images uploaded by students during enrollment

-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own payment proofs
CREATE POLICY "Users can upload payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-screenshots' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own payment proofs
CREATE POLICY "Users can view their own payment proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-screenshots' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access (so admins and anyone can view via direct URL)
CREATE POLICY "Public read access for payment proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-screenshots');

