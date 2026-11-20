/**
 * Pembungkus terpusat untuk environment variables (import.meta.env)
 * Memastikan fallback nilai default jika env belum diset
 */

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim()
const formattedSupabaseUrl = rawSupabaseUrl
  ? rawSupabaseUrl.startsWith("http")
    ? rawSupabaseUrl
    : `https://${rawSupabaseUrl}.supabase.co`
  : ""

export const env = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "EMMA Workflow",
  APP_ENV: import.meta.env.VITE_APP_ENV || "development",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,

  // Supabase Database PostgreSQL
  SUPABASE_URL: formattedSupabaseUrl,
  SUPABASE_ANON_KEY: (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim(),
}
