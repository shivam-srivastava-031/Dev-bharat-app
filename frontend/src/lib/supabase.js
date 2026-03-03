// Supabase config — using npm package
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

try {
    if (supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co') {
        supabase = createClient(supabaseUrl, supabaseAnonKey, {
            realtime: { params: { eventsPerSecond: 10 } },
        });
        console.log('✅ Supabase initialized');
    } else {
        console.log('⚠️ Supabase: No URL found, running in demo mode');
    }
} catch (error) {
    console.warn('⚠️ Supabase init error:', error.message);
}

export { supabase };
export default supabase;
