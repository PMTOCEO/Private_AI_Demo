import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../Database/lib/database.types';

// Validate environment variables at startup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Single source of truth for Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Re-export for convenience
export type { Database } from '../../Database/lib/database.types';