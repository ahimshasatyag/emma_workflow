import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"

/**
 * Service API Inventaris Stok Fisik & Barcode Scanner WMS
 * Berbasis langsung pada tabel PostgreSQL Supabase:
 * - public.m_product
 * - public.m_product_sn
 * Seluruh panggilan ke CodeIgniter (port 8080) telah dihapus sepenuhnya.
 */
export const warehouseApi = {
  /**
   * Mengambil ringkasan inventaris stok fisik produk
   * Dihitung secara real-time dari relasi public.m_product dan public.m_product_sn (nqty = 1)
   */
  getInventory: async () => {
    if (!isSupabaseConfigured || !supabase) {
      return []
    }

    try {
      // 1. Ambil master produk dari public.m_product
      const { data: products, error: prodErr } = await supabase
        .from("m_product")
        .select("id_product, code_product, nm_product, product_deskripsi, id_product_satuan, id_product_kategori")
        .order("code_product", { ascending: true })

      if (prodErr) throw prodErr

      // 2. Ambil seluruh data serial number dari public.m_product_sn
      const { data: snList, error: snErr } = await supabase
        .from("m_product_sn")
        .select("id_product_sn, id_product, sn, nqty, id_product_lokasi, id_gudang")

      if (snErr) throw snErr

      // 3. Kelompokkan SN berdasarkan id_product
      const snByProduct = new Map()
      ;(snList || []).forEach((item) => {
        const pId = Number(item.id_product)
        if (!snByProduct.has(pId)) {
          snByProduct.set(pId, [])
        }
        snByProduct.get(pId).push(item)
      })

      // 4. Hitung agregasi stok fisik per produk
      return (products || []).map((p) => {
        const items = snByProduct.get(Number(p.id_product)) || []
        const readyUnits = items.filter((i) => Number(i.nqty) === 1)
        const stock = readyUnits.length
        const minStock = 5

        // Tentukan lokasi display
        const firstWithLoc = items.find((i) => i.id_product_lokasi || i.id_gudang)
        const location = firstWithLoc
          ? `Gudang #${firstWithLoc.id_gudang || 1} / Rak #${firstWithLoc.id_product_lokasi || "A"}`
          : "Gudang Utama"

        let status = "IN_STOCK"
        if (stock === 0) status = "OUT_OF_STOCK"
        else if (stock <= minStock) status = "LOW_STOCK"

        return {
          id_product: String(p.id_product),
          sku: p.code_product,
          code_product: p.code_product,
          name: p.nm_product || p.code_product,
          name_product: p.nm_product || "",
          category: p.product_deskripsi || "General Product",
          location,
          stock,
          total_sn: items.length,
          minStock,
          unit: "Unit",
          status,
        }
      })
    } catch {
      return []
    }
  },

  /**
   * Memindai barcode atau nomor seri (SN) untuk mencari data barang
   * Mencari kecocokan di public.m_product_sn (sn) atau public.m_product (code_product)
   */
  scanBarcode: async (code) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Kredensial Supabase belum dikonfigurasi di file .env")
    }

    const trimmedCode = code.trim()

    // 1. Cek apakah yang discan adalah Serial Number (m_product_sn)
    const { data: snMatch } = await supabase
      .from("m_product_sn")
      .select("*")
      .eq("sn", trimmedCode)
      .maybeSingle()

    if (snMatch) {
      // Ambil detail produk
      const { data: prod } = await supabase
        .from("m_product")
        .select("id_product, code_product, nm_product")
        .eq("id_product", snMatch.id_product)
        .maybeSingle()

      return {
        sku: prod?.code_product || `PROD-${snMatch.id_product}`,
        code_product: prod?.code_product || `PROD-${snMatch.id_product}`,
        name: prod?.nm_product || prod?.code_product || trimmedCode,
        sn: snMatch.sn,
        id_product: snMatch.id_product,
        id_product_sn: snMatch.id_product_sn,
        stock: Number(snMatch.nqty) === 1 ? 1 : 0,
        status_label: Number(snMatch.nqty) === 1 ? "READY" : "SALE",
        unit: "Unit",
        location: `Gudang #${snMatch.id_gudang || 1} (Rak #${snMatch.id_product_lokasi || "-"})`,
      }
    }

    // 2. Cek apakah yang discan adalah Kode Produk (m_product)
    const { data: prodMatch } = await supabase
      .from("m_product")
      .select("*")
      .ilike("code_product", trimmedCode)
      .maybeSingle()

    if (prodMatch) {
      // Hitung stok ready
      const { data: sns } = await supabase
        .from("m_product_sn")
        .select("id_product_sn, nqty")
        .eq("id_product", prodMatch.id_product)
        .eq("nqty", 1)

      const readyCount = sns ? sns.length : 0

      return {
        sku: prodMatch.code_product,
        code_product: prodMatch.code_product,
        name: prodMatch.nm_product || prodMatch.code_product,
        id_product: prodMatch.id_product,
        stock: readyCount,
        status_label: readyCount > 0 ? "READY" : "OUT_OF_STOCK",
        unit: "Unit",
        location: "Gudang Utama",
      }
    }

    throw new Error(`Barcode / SKU / SN "${trimmedCode}" tidak ditemukan di database Supabase.`)
  },

  /**
   * Mencatat mutasi stok (Inbound / Outbound / Penyesuaian) langsung di Supabase
   */
  recordMovement: async ({ sku, type, quantity, notes }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Kredensial Supabase belum dikonfigurasi di file .env")
    }

    // Temukan produk berdasarkan sku / code_product
    const { data: prod } = await supabase
      .from("m_product")
      .select("id_product, code_product, nm_product")
      .eq("code_product", sku)
      .maybeSingle()

    if (!prod) {
      throw new Error(`Produk dengan kode "${sku}" tidak ditemukan.`)
    }

    const qty = Number(quantity) || 1

    if (type === "OUTBOUND") {
      // Ambil unit yang masih status READY (nqty = 1) dan ubah ke SALE (nqty = 0)
      const { data: availableSns } = await supabase
        .from("m_product_sn")
        .select("id_product_sn")
        .eq("id_product", prod.id_product)
        .eq("nqty", 1)
        .limit(qty)

      if (!availableSns || availableSns.length === 0) {
        throw new Error(`Stok produk "${sku}" berstatus READY tidak mencukupi untuk dikeluarkan.`)
      }

      const idsToUpdate = availableSns.map((s) => s.id_product_sn)
      const { error: updErr } = await supabase
        .from("m_product_sn")
        .update({
          nqty: 0,
          date_update: new Date().toISOString(),
        })
        .in("id_product_sn", idsToUpdate)

      if (updErr) throw updErr
      return { sukses: true, message: `Berhasil mengeluarkan ${idsToUpdate.length} unit.` }
    } else {
      // INBOUND: Buat serial number baru ke stok
      const newItems = Array.from({ length: qty }).map(() => ({
        id_product: prod.id_product,
        sn: `${prod.code_product.slice(0, 6).replace(/[^a-zA-Z0-9]/g, "")}-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        nqty: 1,
        date_create: new Date().toISOString(),
      }))

      const { error: insErr } = await supabase.from("m_product_sn").insert(newItems)
      if (insErr) throw insErr
      return { sukses: true, message: `Berhasil menambahkan ${qty} unit baru ke stok.` }
    }
  },
}
