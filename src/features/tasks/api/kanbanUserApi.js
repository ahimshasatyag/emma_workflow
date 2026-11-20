import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"

/**
 * Service API untuk tabel public.t_kanban (PostgreSQL Supabase)
 * Skema:
 * - id: character varying(50) (PK)
 * - name: character varying(100)
 * - email: character varying(100) (UNIQUE)
 * - created_at: timestamp with time zone
 */
export const kanbanUserApi = {
  /**
   * Mengambil daftar seluruh anggota Kanban dari public.t_kanban
   */
  getUsers: async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("t_kanban")
          .select("*")
          .order("created_at", { ascending: true })

        if (error) {
          console.warn("Gagal memuat public.t_kanban dari Supabase:", error.message)
          return []
        }

        if (Array.isArray(data) && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            created_at: item.created_at,
            role: "Anggota Tim",
            group: "ALL",
            avatar: item.name
              ? item.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "US",
          }))
        }
      } catch (err) {
        console.warn("Exception saat memuat t_kanban:", err)
      }
    }

    return []
  },

  /**
   * Menambahkan anggota baru ke public.t_kanban
   */
  createUser: async ({ id, name, email }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Kredensial Supabase belum dikonfigurasi di file .env")
    }

    const payload = {
      id: id?.trim() || `USR-${String(Date.now()).slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("t_kanban")
      .insert([payload])
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        throw new Error(`Email "${email}" sudah digunakan oleh anggota lain di t_kanban.`)
      }
      throw error
    }

    return data
  },

  /**
   * Menghapus anggota dari public.t_kanban
   */
  deleteUser: async (id) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Kredensial Supabase belum dikonfigurasi di file .env")
    }

    const { error } = await supabase.from("t_kanban").delete().eq("id", id)
    if (error) throw error
    return { success: true, id }
  },
}
