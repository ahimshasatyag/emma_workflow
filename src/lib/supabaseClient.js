import { createClient } from "@supabase/supabase-js"
import { env } from "@/config/env"

const supabaseUrl = env.SUPABASE_URL
const supabaseAnonKey = env.SUPABASE_ANON_KEY

/**
 * Pengecekan ketersediaan kredensial Supabase
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http")
)

/**
 * Instance Supabase Client untuk tabel PostgreSQL:
 * - public.m_product
 * - public.m_product_sn
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null
