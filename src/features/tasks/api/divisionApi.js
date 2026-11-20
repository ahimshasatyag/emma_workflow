import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"

/**
 * Service API untuk tabel public.m_karyawan_divisi (PostgreSQL Supabase)
 * Skema:
 * - id_karyawan_divisi: bigint not null (PK)
 * - nm_karyawan_divisi: text null
 * - date_create: text null
 * - date_update: text null
 */
export const divisionApi = {
  /**
   * Mengambil daftar divisi karyawan dari public.m_karyawan_divisi
   */
  getDivisions: async () => {
    if (!isSupabaseConfigured || !supabase) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from("m_karyawan_divisi")
        .select("id_karyawan_divisi, nm_karyawan_divisi")
        .order("id_karyawan_divisi", { ascending: true })

      if (error) {
        return []
      }

      if (Array.isArray(data)) {
        return data
      }
    } catch {
      return []
    }

    return []
  },
}
