import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oxwhyvbqegzojqfadqfl.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2h5dmJxZWd6b2pxZmFkcWZsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTcwNzU4NiwiZXhwIjoyMTExMjgzNTg2fQ.n0HvSy0wEH98sNwm4xoATMuObXDS7GfiPzNP69KnhJc'

export async function createClient() {
  return createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY)
}