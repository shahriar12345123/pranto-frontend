import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nlpjffxopdjjcgnvoxwk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scGpmZnhvcGRqamNnbnZveHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MjYxNzAsImV4cCI6MjEwNTIwMjE3MH0.RysbPeXlK5PYbSC7GqJb47ryVgQvBFcN8WQNEbkwdQk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
