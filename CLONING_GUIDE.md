# How to Clone This Project as a Template

This guide will help you create a copy of this web application (frontend) and its database (backend) to use as a starting point for a new project.

## Part 1: Copying the Frontend

1.  **Duplicate the Folder**
    *   Copy the entire `learn-grow-hub-1` folder and paste it into a new location.
    *   Rename the folder to your new project name (e.g., `my-new-project`).

2.  **Clean Up Project-Specific Files**
    *   Open your new folder.
    *   **Delete the `.git` folder**: This removes the version control history found in the previous project. (You may need to enable "Hidden items" in Windows Explorer View settings to see it).
    *   **Delete the `.env` file**: This contains the old API keys. You will create a new one later.
    *   **Delete `node_modules` folder**: It's best to reinstall dependencies fresh.
    *   **Delete `dist` folder** (if valid): This is the build output.

3.  **Initialize Clean Project**
    *   Open a terminal in your new folder.
    *   Run `git init` to start a fresh git repository.
    *   Run `npm install` (or `bun install`) to install all dependencies listed in `package.json`.

## Part 2: Copying the Backend (Supabase)

1.  **Create a New Supabase Project**
    *   Go to [database.new](https://database.new) and create a new project.
    *   Save your database password securely.

2.  **Run the Database Schema**
    *   In your new Supabase dashboard, go to the **SQL Editor** (icon on the left sidebar).
    *   Click **"New Query"**.
    *   Open the file `COMPLETE_DATABASE_SCHEMA.sql` from this project.
    *   Copy the **entire content** of the file and paste it into the Supabase SQL Editor.
    *   Click **Run** (bottom right).
    *   *Success Check*: You should see "Success" or "No rows returned".

3.  **Set Up Storage Buckets**
    *   Clear the SQL Editor or create a new query.
    *   Open the file `STORAGE_BUCKETS_SETUP.sql`.
    *   Copy/Paste the content into the SQL Editor.
    *   Click **Run**.
    *   *Success Check*: This will create buckets like `avatars`, `course-posters`, etc.

4.  **Create an Admin User (Optional but Recommended)**
    *   Go to the **Table Editor** -> `auth.users` (not directly editable usually, so go to **Authentication** -> **Users** in the sidebar).
    *   Click **Add User** -> "Create New User" and sign up with an email/password.
    *   Go back to the **SQL Editor** and run this command to make yourself an admin (replace with your email):
        ```sql
        UPDATE public.user_roles 
        SET role = 'admin' 
        WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
        ```

## Part 3: Connecting Them

1.  **Get New API Keys**
    *   In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
    *   Copy the **Project URL**.
    *   Copy the **anon public** key.

2.  ** Configure Environment Variables**
    *   In your new frontend folder, create a new file named `.env`.
    *   Add the following lines:
        ```env
        VITE_SUPABASE_URL=your_project_url_here
        VITE_SUPABASE_ANON_KEY=your_anon_key_here
        ```

3.  **Start the New Project**
    *   Run `npm run dev`.
    *   Your new site should now be running and connected to your new, empty database!

## Summary of Files Used
*   **`COMPLETE_DATABASE_SCHEMA.sql`**: Contains all tables, functions, and security policies.
*   **`STORAGE_BUCKETS_SETUP.sql`**: Sets up file storage.
