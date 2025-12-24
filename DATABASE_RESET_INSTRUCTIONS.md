# Database Reset Instructions

## ⚠️ WARNING
**This will DELETE ALL DATA including:**
- All users (you'll need to create a new admin account)
- All courses, enrollments, and progress
- All blog posts and portfolio projects
- All uploaded files and images

## Step-by-Step Reset Process

### 1. Backup Current Data (Optional)
If you want to save any data, export it first:
- Go to Supabase Dashboard → Database → Tables
- Export important tables as CSV

### 2. Reset the Database
In your Supabase Dashboard:
1. Go to **Settings** → **Database**
2. Scroll to **Reset Database Password** section
3. You'll see an option to **Reset Database** completely
   - OR manually drop all tables/schemas if your plan doesn't support full reset

### 3. Run Main Schema Script
1. Go to **SQL Editor** in your Supabase Dashboard
2. Click **New Query**
3. Open the file: `COMPLETE_DATABASE_SCHEMA.sql` (in your project root)
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run**
7. Wait for "Schema setup complete!" message

### 4. Run Storage Setup Script
1. Still in **SQL Editor**, click **New Query**
2. Open the file: `STORAGE_BUCKETS_SETUP.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click **Run**
6. Wait for "Storage buckets and policies created successfully!" message

### 5. Create Your Admin Account
1. Go to your app at `http://localhost:8082/auth`
2. Click **Sign Up**
3. Fill in your details and register
4. **Important**: Check your email and confirm your account

### 6. Grant Admin Role
1. Go back to Supabase Dashboard → **SQL Editor**
2. Run this query (replace `YOUR-USER-ID` with your actual user ID):
```sql
-- First, find your user ID
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 1;

-- Then grant admin role (replace the ID)
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'YOUR-USER-ID-HERE';
```

3. Alternatively, you can run:
```sql
-- One-liner to make the most recent user an admin
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1);
```

### 7. Verify Everything Works
1. Sign out and sign back in
2. Navigate to `/admin` - you should have full access
3. Try creating a program again - it should work!

## Files Created
- **COMPLETE_DATABASE_SCHEMA.sql** - Main database schema (all tables, functions, policies)
- **STORAGE_BUCKETS_SETUP.sql** - Storage buckets and file upload policies

## If Anything Goes Wrong
If you encounter errors:
1. Check that you're running the scripts in order (main schema first, then storage)
2. Make sure the database is completely empty before running the main schema
3. Check the error message - it will tell you which step failed
4. You can safely re-run the scripts (they have IF NOT EXISTS checks)

## Alternative: Keep Current Database
**Instead of resetting**, you can:
- Just keep using your current database (it's working now!)
- Clear specific tables if needed: `TRUNCATE TABLE table_name CASCADE;`
- The consolidated scripts are here for future reference or new deployments
