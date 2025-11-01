import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucpylqriavjrgkthloxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcHlscXJpYXZqcmdrdGhsb3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTMwMjcsImV4cCI6MjA3NjE2OTAyN30.bXph85ytc5ILSamhh4kyN1SY2Ni5LhXpgl_Q6kJzty4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
