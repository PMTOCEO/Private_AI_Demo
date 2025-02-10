import { createClient } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';
import type { Database } from '../lib/database.types';

// Define custom JWT payload type
interface Auth0JWTPayload {
  sub: string;
  email?: string;
  'https://supabase.com/jwt/token'?: string;
  [key: string]: any;
}

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client instance
export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Update auth header with Supabase token from Auth0
export const setSupabaseToken = async (auth0Token: string) => {
  try {
    // Extract Supabase token from Auth0 token claims
    const decoded = jwtDecode<Auth0JWTPayload>(auth0Token);
    const supabaseToken = decoded['https://supabase.com/jwt/token'];

    if (!supabaseToken) {
      throw new Error('No Supabase token found in Auth0 token claims');
    }

    // Set the session with the Supabase token
    const { data: { session }, error } = await supabase.auth.setSession({
      access_token: supabaseToken,
      refresh_token: supabaseToken // Using same token since we'll refresh via Auth0
    });

    if (error) {
      console.error('Supabase session error:', error);
      throw error;
    }

    return session;
  } catch (error) {
    console.error('Failed to set Supabase token:', error);
    throw error;
  }
};

// Clear auth header
export const clearSupabaseToken = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error clearing Supabase session:', error);
  }
};