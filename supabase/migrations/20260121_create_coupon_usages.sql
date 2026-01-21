-- Create table to track coupon usage
CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    coupon_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Ensure a user can only use a specific coupon code once
    UNIQUE(user_id, coupon_code)
);

-- Enable RLS
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can read their own usage
CREATE POLICY "Users can read own coupon usage" 
ON public.coupon_usages FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can insert their own usage (server-side verification recommended, but RLS needed for client insert)
CREATE POLICY "Users can insert own coupon usage" 
ON public.coupon_usages FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);
