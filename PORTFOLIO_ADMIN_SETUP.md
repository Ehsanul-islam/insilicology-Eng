# Portfolio Admin Panel Setup Guide

## Overview

The portfolio admin panel has been successfully implemented! This guide will help you set up and start using the new portfolio management system.

## What's Been Implemented

### ✅ Database Schema
- Extended `portfolio_projects` table with new fields:
  - `category` - Portfolio category (e.g., web-development, mobile-apps)
  - `team_size` - Project team size
  - `challenges` - JSON array of project challenges
  - `solutions` - JSON array of solutions implemented
  - `gallery_images` - JSON array of additional project images
- Created `portfolio_categories` table for dynamic category management
- Set up Row Level Security (RLS) policies
- Created storage bucket for portfolio images

### ✅ Admin Features
- **Portfolio List Page** (`/admin/portfolio`)
  - View all portfolios with filters (status, category)
  - Search by title, client, or country
  - Quick actions: Edit, Delete, Publish, Archive, Toggle Featured
  - Statistics dashboard
  
- **Portfolio Editor** (`/admin/portfolio/new` and `/admin/portfolio/:id/edit`)
  - Comprehensive form with 5 tabs: Basic Info, Media, Technical, Details, Settings
  - Markdown editor with live preview for descriptions
  - Image uploader with drag-and-drop support (upload to Supabase or use URLs)
  - Tag input for technologies and services
  - Dynamic JSON editors for challenges, solutions, and results
  - Auto-slug generation from title
  - Featured toggle and status management
  
- **Category Management** (`/admin/portfolio/categories`)
  - Create, edit, and delete portfolio categories
  - Set category icons (emojis)
  - Manage display order

### ✅ Frontend Updates
- **Portfolio Page** (`/portfolio`)
  - Fetches published portfolios from database
  - Dynamic category filtering
  - Displays hero images if available
  - Loading states and error handling
  
- **Portfolio Detail Page** (`/portfolio/:slug`)
  - Fetches portfolio by slug from database
  - 404 handling for non-existent portfolios
  - Renders markdown descriptions
  - Displays all portfolio data including challenges, solutions, gallery

### ✅ Reusable Components
- `MarkdownEditor` - Split-pane editor with live preview and toolbar
- `ImageUploader` - Drag-and-drop upload with URL fallback
- `TagInput` - Dynamic tag addition/removal
- `JSONArrayEditor` - Visual editor for structured data arrays

## Setup Instructions

### Step 1: Run Database Migrations

Run the following migrations in order:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the migration files in your Supabase dashboard:
# 1. supabase/migrations/20251221120000_extend_portfolio_projects.sql
# 2. supabase/migrations/20251221120100_create_portfolio_storage.sql
```

### Step 2: Seed Demo Data (Optional)

To populate the database with sample portfolios:

```bash
# Run in Supabase SQL Editor or via CLI
psql -d your_database < scripts/seed-demo-portfolios.sql

# Or copy the contents of scripts/seed-demo-portfolios.sql
# and run it in Supabase dashboard SQL Editor
```

### Step 3: Verify Storage Bucket

Make sure the `portfolio-images` storage bucket is created:

1. Go to Supabase Dashboard → Storage
2. Check if `portfolio-images` bucket exists
3. If not, the migration should have created it automatically

### Step 4: Install Dependencies (if not already installed)

```bash
npm install react-markdown remark-gfm
```

### Step 5: Start Development Server

```bash
npm run dev
```

## Usage Guide

### Creating a New Portfolio

1. Navigate to `/admin/portfolio`
2. Click "New Portfolio" button
3. Fill in the basic information:
   - **Title** (required) - Auto-generates slug
   - **Slug** (required) - URL-friendly identifier
   - **Summary** (required) - Brief description
   - **Description** - Full markdown description
   
4. Add client details:
   - Client name, country, duration, team size
   
5. Upload media:
   - **Hero Image** - Main project image
   - **Gallery Images** - Additional project screenshots
   
6. Add technical details:
   - Select category
   - Add technologies (tags)
   - Add services provided (tags)
   
7. Add project details:
   - **Results** - Metrics and achievements
   - **Challenges** - Problems faced
   - **Solutions** - How you solved them
   
8. Configure settings:
   - Toggle "Featured" to highlight on homepage
   - Set status (Draft/Published/Archived)
   
9. Click "Create Portfolio"

### Managing Portfolios

- **Edit**: Click edit icon in the actions menu
- **Delete**: Click delete icon (requires confirmation)
- **Publish**: Changes status from draft to published
- **Archive**: Moves published portfolios to archived
- **Toggle Featured**: Quickly mark/unmark as featured

### Managing Categories

1. Navigate to `/admin/portfolio/categories`
2. Click "Add Category"
3. Enter:
   - Name (e.g., "Web Development")
   - Slug (auto-generated, e.g., "web-development")
   - Icon (emoji, e.g., "🌐")
   - Display order (lower numbers appear first)
4. Click "Create"

## File Structure

```
src/
├── hooks/
│   ├── usePortfolio.ts          # Portfolio CRUD operations
│   └── useImageUpload.ts        # Image upload to Supabase storage
├── components/admin/
│   ├── MarkdownEditor.tsx       # Markdown editor with preview
│   ├── ImageUploader.tsx        # Image upload component
│   ├── TagInput.tsx             # Tag input component
│   └── JSONArrayEditor.tsx      # JSON array editor
├── pages/
│   ├── Portfolio.tsx            # Public portfolio list
│   ├── PortfolioDetail.tsx      # Public portfolio detail
│   └── admin/
│       ├── AdminPortfolio.tsx            # Admin portfolio list
│       ├── AdminPortfolioEditor.tsx      # Portfolio create/edit
│       └── AdminPortfolioCategories.tsx  # Category management
└── App.tsx                      # Updated with new routes

supabase/migrations/
├── 20251221120000_extend_portfolio_projects.sql  # Schema extension
└── 20251221120100_create_portfolio_storage.sql   # Storage setup

scripts/
└── seed-demo-portfolios.sql     # Demo data
```

## Routes

### Public Routes
- `/portfolio` - Portfolio list page
- `/portfolio/:slug` - Portfolio detail page

### Admin Routes (Protected)
- `/admin/portfolio` - Portfolio management
- `/admin/portfolio/new` - Create new portfolio
- `/admin/portfolio/:id/edit` - Edit portfolio
- `/admin/portfolio/categories` - Manage categories

## Key Features

### Image Upload
- **Drag & Drop**: Drag images directly into the upload area
- **File Browser**: Click to browse and select files
- **URL Input**: Paste image URLs as alternative
- **Multiple Uploads**: Upload multiple gallery images at once
- **Validation**: Automatic file type and size validation (5MB limit)

### Markdown Editor
- **Live Preview**: See formatted output as you type
- **Toolbar**: Quick formatting buttons for common markdown
- **Syntax Support**: Full markdown syntax with GitHub Flavored Markdown

### Slug Management
- **Auto-generation**: Slugs auto-generate from title
- **Uniqueness Check**: Validates slug uniqueness before saving
- **Manual Override**: Edit generated slug if needed

### Status Management
- **Draft**: Work in progress, not visible to public
- **Published**: Live and visible on the website
- **Archived**: Hidden from public but not deleted

## Troubleshooting

### Images Not Uploading
1. Check storage bucket exists: Supabase Dashboard → Storage
2. Verify RLS policies are set correctly
3. Check browser console for errors
4. Ensure file size is under 5MB

### Portfolios Not Showing
1. Verify portfolio status is "published"
2. Check RLS policies allow public read access
3. Check browser console for API errors

### Slug Already Exists
1. Try a different title
2. Manually edit the slug field
3. Add a unique identifier (e.g., year or client name)

### Categories Not Loading
1. Run the migration to create portfolio_categories table
2. Check if default categories were inserted
3. Create categories manually in admin panel

## Next Steps

1. **Customize Categories**: Add your own portfolio categories
2. **Add Real Projects**: Replace demo portfolios with actual projects
3. **Upload Images**: Add real project screenshots
4. **Test Workflow**: Create, edit, publish a portfolio end-to-end
5. **User Testing**: Have admin users test the workflow

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Verify all migrations ran successfully
4. Ensure you're logged in as an admin user

## Features to Consider Adding Later

- Bulk actions (delete/publish multiple)
- Portfolio duplication
- Advanced search/filtering
- Portfolio templates
- Analytics (view counts)
- Client testimonials section
- Project timeline visualization
- Export portfolio as PDF

---

**Implementation Complete!** 🎉

All todos have been completed and the portfolio admin panel is ready to use!

