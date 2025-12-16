// FIX: Manually define types for import.meta.env to allow access to Vite's
// environment variables without relying on project-level TypeScript configuration
// that might be missing the 'vite/client' type definition.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { createClient } from '@supabase/supabase-js';

// For client-side code in a Vite-like environment, environment variables
// must be prefixed with VITE_ and are accessed via import.meta.env.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase client-side environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel project settings.");
}

// This client is now used ONLY for Authentication (login/logout) and
// admin actions (editing, adding, deleting data).
// Public data reading is handled by our cached serverless function.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
