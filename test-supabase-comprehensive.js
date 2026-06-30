import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_PROJECT_ID = process.env.VITE_SUPABASE_PROJECT_ID;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

console.log('\n==================================================');
console.log('🔍 SYSTEM-WIDE SUPABASE DIAGNOSTIC');
console.log('==================================================\n');

// Test 1: Configuration Check
console.log('✓ Test 1: Credentials & Configuration');
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('  ❌ Missing essential environment variables (URL/Publishable Key)!');
    process.exit(1);
}
console.log(`  ✅ Project ID:       ${SUPABASE_PROJECT_ID || 'Not specified'}`);
console.log(`  ✅ Supabase URL:     ${SUPABASE_URL}`);
console.log(`  ✅ Publishable Key:  ${SUPABASE_KEY.substring(0, 15)}...[omitted]`);
console.log(`  ✅ Access Token:     ${SUPABASE_ACCESS_TOKEN ? 'Present (will run Cloud Management checks)' : 'Not present'}`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test 2: Database Table Connectivity & Existence
console.log('\n✓ Test 2: Database Table Checks (schema: public)');
const tablesToCheck = [
    'profiles',
    'user_roles',
    'blog_categories',
    'portfolio_categories',
    'courses',
    'course_batches',
    'lessons',
    'enrollments',
    'lesson_progress',
    'certificates',
    'blog_posts',
    'portfolio_projects',
    'contact_submissions',
    'career_applications',
    'course_resources',
    'course_reviews',
    'visitor_analytics',
    'upcoming_programs',
    'schema_versions',
    'coupon_usages',
    'notifications'
];

for (const tableName of tablesToCheck) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

        if (error) {
            // Check if error is because table doesn't exist
            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                console.log(`  ❌ Table '${tableName}': Not found (Error code: ${error.code}, Message: ${error.message})`);
            } else {
                // If it's a permission error or other database error, the table exists but might have policies
                console.log(`  ⚠️  Table '${tableName}': Accessible but returned database error (Code: ${error.code}, Msg: ${error.message})`);
            }
        } else {
            console.log(`  ✅ Table '${tableName}': Connected & queried successfully (returned ${data.length} row(s) sample)`);
        }
    } catch (err) {
        console.log(`  ❌ Table '${tableName}': Query threw unexpected error: ${err.message}`);
    }
}

// Test 3: Storage Buckets Accessibility
console.log('\n✓ Test 3: Storage Buckets Checks');
const bucketsToCheck = [
    'course-posters',
    'avatars',
    'course-resources',
    'portfolio-images',
    'blog-images',
    'resumes',
    'payment-screenshots'
];

for (const bucketName of bucketsToCheck) {
    try {
        // Try listing items in the bucket
        const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 1 });
        if (error) {
            // Permission denied is expected for private buckets if not logged in, but confirms bucket exists
            if (error.message.includes('not found') || error.message.includes('does not exist')) {
                console.log(`  ❌ Bucket '${bucketName}': Not found (Msg: ${error.message})`);
            } else {
                console.log(`  ⚠️  Bucket '${bucketName}': Exists but restricted/returned error (Msg: ${error.message})`);
            }
        } else {
            console.log(`  ✅ Bucket '${bucketName}': Connected & listable (found ${data.length} items)`);
        }
    } catch (err) {
        console.log(`  ❌ Bucket '${bucketName}': Unexpected storage error: ${err.message}`);
    }
}

// Test 4: Edge Functions Reachability
console.log('\n✓ Test 4: Edge Functions Checks');
const edgeFunctions = [
    'issue-certificate',
    'send-enrollment-notification',
    'send-welcome-email'
];

for (const funcName of edgeFunctions) {
    try {
        // We invoke with an empty payload or simple check to see if we hit the function
        const { data, error } = await supabase.functions.invoke(funcName, {
            body: {}
        });

        // If the function is not found, we get a specific error/status code.
        // If it returns a validation error or 400, it means it's deployed and executing code!
        if (error) {
            if (error.message && (error.message.includes('404') || error.message.includes('Failed to fetch') || error.message.includes('not found'))) {
                console.log(`  ❌ Function '${funcName}': Could not reach / Not deployed (Msg: ${error.message})`);
            } else {
                console.log(`  ✅ Function '${funcName}': Responded with error (Live! Status details: ${error.message})`);
            }
        } else {
            console.log(`  ✅ Function '${funcName}': Executed and returned success!`);
        }
    } catch (err) {
        // If it throws, check if it's network-level or 404
        if (err.message.includes('404') || err.message.includes('fetch')) {
            console.log(`  ❌ Function '${funcName}': Could not reach / Not deployed (Error: ${err.message})`);
        } else {
            console.log(`  ✅ Function '${funcName}': Live! (But threw: ${err.message})`);
        }
    }
}

// Test 5: Supabase Management API (Cloud Status)
if (SUPABASE_ACCESS_TOKEN && SUPABASE_PROJECT_ID) {
    console.log('\n✓ Test 5: Cloud Management API Checks');
    try {
        // 1. Fetch Project Details
        const projectRes = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}`, {
            headers: {
                'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (projectRes.ok) {
            const projectData = await projectRes.json();
            console.log(`  ✅ Project Details retrieved successfully`);
            console.log(`     Name:    ${projectData.name}`);
            console.log(`     Region:  ${projectData.region}`);
            console.log(`     Status:  ${projectData.status}`);
        } else {
            console.log(`  ❌ Failed to fetch project details (HTTP ${projectRes.status}: ${projectRes.statusText})`);
        }

        // 2. Fetch Deployed Edge Functions
        const functionsRes = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/functions`, {
            headers: {
                'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (functionsRes.ok) {
            const functionsList = await functionsRes.json();
            console.log(`  ✅ Deployed Functions in Cloud (${functionsList.length} found):`);
            functionsList.forEach(fn => {
                console.log(`     - ${fn.name} (Status: ${fn.status}, Version: ${fn.version})`);
            });
        } else {
            console.log(`  ❌ Failed to fetch deployed functions list (HTTP ${functionsRes.status}: ${functionsRes.statusText})`);
        }
    } catch (err) {
        console.log(`  ❌ Cloud API error: ${err.message}`);
    }
}

console.log('\n==================================================');
console.log('✅ Diagnostics execution completed!');
console.log('==================================================\n');
