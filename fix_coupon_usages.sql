-- Check if coupon_usages table exists and create if needed
CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    coupon_code TEXT NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, coupon_code)
);

-- Enable RLS
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own coupon usages" ON public.coupon_usages;
DROP POLICY IF EXISTS "Users can insert their own coupon usages" ON public.coupon_usages;

-- Create RLS policies
CREATE POLICY "Users can view their own coupon usages"
    ON public.coupon_usages
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usages"
    ON public.coupon_usages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT ON public.coupon_usages TO authenticated;
GRANT SELECT ON public.coupon_usages TO anon;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user_id ON public.coupon_usages(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_code ON public.coupon_usages(coupon_code);

COMMENT ON TABLE public.coupon_usages IS 'Tracks which users have used which coupons';
