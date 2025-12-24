import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('\n🔍 Supabase Connection Test\n');
console.log('='.repeat(50));

// Test 1: Configuration Check
console.log('\n✓ Test 1: Configuration Check');
if (SUPABASE_URL && SUPABASE_KEY) {
    console.log(`  ✅ URL: ${SUPABASE_URL}`);
    console.log(`  ✅ Key: ${SUPABASE_KEY.substring(0, 20)}...`);
} else {
    console.log('  ❌ Missing environment variables!');
    process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test 2: Database Connection
console.log('\n✓ Test 2: Database Connection');
try {
    const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

    if (error) {
        console.log(`  ❌ Database Error: ${error.message}`);
        console.log(`  Details: ${error.hint || error.details || 'No additional details'}`);
    } else {
        console.log('  ✅ Database connected successfully!');
        console.log(`  Query executed without errors`);
    }
} catch (err) {
    console.log(`  ❌ Connection Error: ${err.message}`);
}

// Test 3: Authentication Service
console.log('\n✓ Test 3: Authentication Service');
try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.log(`  ❌ Auth Error: ${error.message}`);
    } else {
        console.log('  ✅ Auth service is working!');
        if (session) {
            console.log(`  User: ${session.user.email}`);
        } else {
            console.log('  No active session (not logged in)');
        }
    }
} catch (err) {
    console.log(`  ❌ Auth Check Error: ${err.message}`);
}

console.log('\n' + '='.repeat(50));
console.log('✅ Connection test complete!\n');
