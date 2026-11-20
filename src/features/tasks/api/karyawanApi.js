import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"

/**
 * Service API untuk tabel public.m_karyawan (PostgreSQL Supabase)
 * Skema:
 * - id_karyawan: bigint not null (PK)
 * - nm_karyawan: text null
 * - id_karyawan_divisi: bigint null
 * - id_karyawan_posisi: bigint null
 * - karyawan_email: text null
 * - flag_status: smallint null (1 = Aktif, 0 = Non-aktif)
 */
export const karyawanApi = {
  /**
   * Mengambil daftar seluruh karyawan aktif dari public.m_karyawan
   */
  getKaryawan: async () => {
    if (!isSupabaseConfigured || !supabase) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from("m_karyawan")
        .select("id_karyawan, nm_karyawan, id_karyawan_divisi, flag_status")
        .eq("flag_status", 1)
        .order("nm_karyawan", { ascending: true })

      if (error) {
        // Fallback jika flag_status tidak ada
        const { data: fallbackData } = await supabase
          .from("m_karyawan")
          .select("id_karyawan, nm_karyawan, id_karyawan_divisi")
          .order("nm_karyawan", { ascending: true })

        return Array.isArray(fallbackData) ? fallbackData : []
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
