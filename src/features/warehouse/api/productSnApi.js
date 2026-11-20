import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"

export const productSnApi = {
  /**
   * Status koneksi provider
   */
  getProvider: () => "supabase",

  /**
   * Cek apakah Supabase sudah terkonfigurasi
   */
  isConfigured: () => isSupabaseConfigured,

  /**
   * Mengambil data list serial number dari public.m_product_sn join public.m_product
   */
  getData: async () => {
    if (!isSupabaseConfigured || !supabase) {
      return []
    }

    try {
      // 1. Ambil master produk untuk relasi join
      const { data: products, error: prodErr } = await supabase
        .from("m_product")
        .select("id_product, code_product, nm_product, product_deskripsi, flag_active")

      if (prodErr) throw prodErr

      // 2. Ambil seluruh data serial number
      const { data: snList, error: snErr } = await supabase
        .from("m_product_sn")
        .select("*")
        .order("id_product_sn", { ascending: false })

      if (snErr) throw snErr

      const productMap = new Map((products || []).map((p) => [Number(p.id_product), p]))

      return (snList || []).map((item) => {
        const prod = productMap.get(Number(item.id_product))
        const isReady = Number(item.nqty) === 1
        return {
          id_product_sn: String(item.id_product_sn),
          id_product: String(item.id_product || ""),
          code_product: prod?.code_product || `PROD-${item.id_product}`,
          nm_product: prod?.nm_product || "",
          name_product: prod?.nm_product || "",
          product_deskripsi: prod?.product_deskripsi || "",
          sn: String(item.sn || ""),
          nqty: isReady ? 1 : 0,
          status_label: isReady ? "READY" : "SALE",
          id_product_lokasi: item.id_product_lokasi ?? null,
          id_gudang: item.id_gudang ?? null,
          date_create: item.date_create || null,
          date_update: item.date_update || null,
        }
      })
    } catch (err) {
      console.warn("Gagal mengambil data dari Supabase:", err.message)
      return []
    }
  },

  /**
   * Mengambil daftar master produk dari public.m_product
   */
  getDataBarang: async () => {
    if (!isSupabaseConfigured || !supabase) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from("m_product")
        .select("*")
        .order("code_product", { ascending: true })

      if (error) throw error

      return (data || []).map((p) => ({
        ...p,
        id_product: String(p.id_product),
        name_product: p.nm_product || "",
      }))
    } catch (err) {
      console.warn("Gagal mengambil master produk dari Supabase:", err.message)
      return []
    }
  },

  /**
   * Cek keunikan serial number di public.m_product_sn
   */
  cekSn: async (id_product, sn, id_product_sn = 0) => {
    if (!isSupabaseConfigured || !supabase) {
      return false
    }

    try {
      let query = supabase
        .from("m_product_sn")
        .select("id_product_sn")
        .eq("sn", sn.trim())

      if (id_product_sn && Number(id_product_sn) !== 0) {
        query = query.neq("id_product_sn", Number(id_product_sn))
      }

      const { data, error } = await query
      if (error) throw error
      return Boolean(data && data.length > 0)
    } catch {
      return false
    }
  },

  /**
   * Simpan data serial number baru ke public.m_product_sn
   */
  simpan: async ({ id_product, sn, nqty = 1, id_product_lokasi = null, id_gudang = null }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        "Kredensial Supabase belum dikonfigurasi di file .env (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)."
      )
    }

    // Cek duplikasi SN di database Supabase
    const exists = await productSnApi.cekSn(id_product, sn, 0)
    if (exists) {
      throw new Error(`Serial Number "${sn}" sudah terdaftar dalam sistem database Supabase.`)
    }

    const insertPayload = {
      id_product: Number(id_product),
      sn: sn.trim(),
      nqty: Number(nqty),
      date_create: new Date().toISOString(),
      id_product_lokasi: id_product_lokasi ? Number(id_product_lokasi) : null,
      id_gudang: id_gudang ? Number(id_gudang) : null,
    }

    const { data, error } = await supabase
      .from("m_product_sn")
      .insert([insertPayload])
      .select()
      .single()

    if (error) throw error
    return { sukses: true, kode: data.id_product_sn, data }
  },

  /**
   * Update data serial number di public.m_product_sn
   */
  update: async ({
    id_product_sn,
    id_product,
    sn,
    nqty,
    id_product_lokasi = undefined,
    id_gudang = undefined,
  }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        "Kredensial Supabase belum dikonfigurasi di file .env."
      )
    }

    // Cek duplikasi SN dengan ID lain
    const exists = await productSnApi.cekSn(id_product, sn, id_product_sn)
    if (exists) {
      throw new Error(`Serial Number "${sn}" sudah digunakan oleh unit lain di Supabase.`)
    }

    const updatePayload = {
      id_product: Number(id_product),
      sn: sn.trim(),
      nqty: Number(nqty),
      date_update: new Date().toISOString(),
    }

    if (id_product_lokasi !== undefined) {
      updatePayload.id_product_lokasi = id_product_lokasi ? Number(id_product_lokasi) : null
    }
    if (id_gudang !== undefined) {
      updatePayload.id_gudang = id_gudang ? Number(id_gudang) : null
    }

    const { data, error } = await supabase
      .from("m_product_sn")
      .update(updatePayload)
      .eq("id_product_sn", Number(id_product_sn))
      .select()
      .single()

    if (error) throw error
    return { sukses: true, kode: id_product_sn, data }
  },

  /**
   * Hapus data serial number dari public.m_product_sn
   */
  delete: async (id_product_sn) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        "Kredensial Supabase belum dikonfigurasi di file .env."
      )
    }

    const { error } = await supabase
      .from("m_product_sn")
      .delete()
      .eq("id_product_sn", Number(id_product_sn))

    if (error) throw error
    return { sukses: true, kode: id_product_sn }
  },
}
