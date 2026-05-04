# Environment Variables Setup Guide for Vercel

## Required Environment Variables

Your application needs the following environment variables to work properly in Vercel:

### 1. **Supabase Configuration** (Required)

```
VITE_SUPABASE_URL=https://hmgxicjynuxsnijhmvth.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
VITE_SUPABASE_PROJECT_ID=hmgxicjynuxsnijhmvth
```

### 2. **Site Configuration** (Optional but Recommended)

```
VITE_SITE_URL=https://your-domain.vercel.app
```

### 3. **Analytics** (Optional)

```
VITE_META_PIXEL_ID=<your-meta-pixel-id>
```

---

## How to Add Environment Variables in Vercel

### Step-by-Step Instructions:

1. **Click "Add Environment Variable"** button (top right in your screenshot)

2. **Add each variable one by one:**

   **First Variable:**
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://hmgxicjynuxsnijhmvth.supabase.co`
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

   **Second Variable:**
   - **Key:** `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Value:** Get this from Supabase Dashboard
   - **Environment:** Select all
   - Click **Save**

   **Third Variable:**
   - **Key:** `VITE_SUPABASE_PROJECT_ID`
   - **Value:** `hmgxicjynuxsnijhmvth`
   - **Environment:** Select all
   - Click **Save**

   **Fourth Variable (Optional):**
   - **Key:** `VITE_SITE_URL`
   - **Value:** Your Vercel deployment URL (e.g., `https://insilicology.vercel.app`)
   - **Environment:** Select all
   - Click **Save**

3. **Redeploy your application** after adding all variables

---

## Where to Find Your Supabase Keys

### Option 1: Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **hmgxicjynuxsnijhmvth**
3. Click **Settings** (gear icon) → **API**
4. Copy the **anon/public** key (this is your `VITE_SUPABASE_PUBLISHABLE_KEY`)

### Option 2: Using Supabase CLI
Run this command in your project directory:
```bash
supabase status
```

Look for:
- **API URL** → This is your `VITE_SUPABASE_URL`
- **anon key** → This is your `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## Quick Copy-Paste Template

Here's a template with your known values. Just fill in the missing ones:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://hmgxicjynuxsnijhmvth.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_KEY_HERE
VITE_SUPABASE_PROJECT_ID=hmgxicjynuxsnijhmvth

# Site Configuration
VITE_SITE_URL=https://your-domain.vercel.app

# Analytics (Optional)
VITE_META_PIXEL_ID=your-pixel-id-here
```

---

## After Adding Variables

1. **Trigger a new deployment:**
   - Go to **Deployments** tab
   - Click the **three dots** on the latest deployment
   - Click **Redeploy**

2. **Or push a new commit:**
   ```bash
   git commit --allow-empty -m "Trigger redeploy with env vars"
   git push
   ```

---

## Verification

After deployment, your app should:
- ✅ Connect to Supabase successfully
- ✅ Allow user authentication
- ✅ Load course data
- ✅ Handle enrollments

If you see errors, check the Vercel deployment logs for missing environment variables.

---

## Important Notes

⚠️ **Never commit `.env` files to Git** - They contain sensitive keys
✅ **Always use Vercel's Environment Variables UI** for production
🔄 **Redeploy after adding/changing variables** - Changes don't apply automatically
