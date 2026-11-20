import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Barcode,
  Package,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  Tag,
  Warehouse,
  MapPin,
  Database,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { cn } from "@/lib/utils"

export function ProductSnModal({
  isOpen,
  onClose,
  editingItem = null,
  products = [],
  onSubmit,
}) {
  const isEditing = !!editingItem

  const [formData, setFormData] = useState({
    id_product: "",
    sn: "",
    nqty: 1, // 1 = READY, 0 = SALE
    id_product_lokasi: "",
    id_gudang: "",
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setFormData({
        id_product: String(editingItem.id_product || ""),
        sn: editingItem.sn || "",
        nqty: Number(editingItem.nqty ?? 1),
        id_product_lokasi: editingItem.id_product_lokasi != null ? String(editingItem.id_product_lokasi) : "",
        id_gudang: editingItem.id_gudang != null ? String(editingItem.id_gudang) : "",
      })
    } else {
      setFormData({
        id_product: products.length > 0 ? String(products[0].id_product) : "",
        sn: "",
        nqty: 1,
        id_product_lokasi: "",
        id_gudang: "1",
      })
    }
    setError("")
  }, [editingItem, products, isOpen])

  const handleGenerateSn = () => {
    const selectedProd = products.find((p) => String(p.id_product) === String(formData.id_product))
    const prefix = selectedProd ? selectedProd.code_product.slice(0, 6).replace(/[^a-zA-Z0-9]/g, "") : "SN"
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase()
    const now = new Date().toISOString().slice(2, 10).replace(/-/g, "")
    const generated = `${prefix}-${now}-${randomHex}`
    setFormData((prev) => ({ ...prev, sn: generated }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.id_product) {
      setError("Silakan pilih kode produk terlebih dahulu.")
      return
    }
    if (!formData.sn.trim()) {
      setError("Serial Number (SN) wajib diisi.")
      return
    }

    setError("")
    setIsSubmitting(true)
    try {
      await onSubmit({
        id_product_sn: editingItem?.id_product_sn,
        id_product: formData.id_product,
        sn: formData.sn.trim(),
        nqty: Number(formData.nqty),
        id_product_lokasi: formData.id_product_lokasi ? Number(formData.id_product_lokasi) : null,
        id_gudang: formData.id_gudang ? Number(formData.id_gudang) : null,
      })
      onClose()
    } catch (err) {
      setError(err.message || "Gagal menyimpan data Serial Number.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedProduct = products.find(
    (p) => String(p.id_product) === String(formData.id_product)
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b bg-muted/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold flex items-center gap-1">
              <Database className="h-3 w-3" />
              {isEditing ? `EDIT #${editingItem.id_product_sn}` : "REGISTRASI SN BARU"}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              public.m_product_sn
            </span>
          </div>
          <DialogTitle className="text-xl">
            {isEditing ? "Perbarui Serial Number Produk" : "Tambah Data Serial Number (SN)"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Form manajemen serial number unit gudang terintegrasi dengan tabel PostgreSQL Supabase:{" "}
            <code className="text-primary font-mono font-semibold">public.m_product</code> &{" "}
            <code className="text-primary font-mono font-semibold">public.m_product_sn</code>.
          </DialogDescription>
        </div>

        {/* Body Form */}
        <form id="product-sn-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-xs text-destructive border border-destructive/20"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. Pilih Master Produk dari tabel public.m_product */}
          <FormItem>
            <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-muted-foreground" />
              Produk (<code className="font-mono text-primary font-semibold">public.m_product</code>)
            </FormLabel>
            <FormControl>
              <select
                required
                value={formData.id_product}
                onChange={(e) => setFormData({ ...formData, id_product: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary font-medium font-mono"
              >
                <option value="" disabled>
                  -- Pilih Produk dari Tabel m_product --
                </option>
                {products.map((prod) => (
                  <option key={prod.id_product} value={prod.id_product}>
                    {prod.code_product} {prod.nm_product || prod.name_product ? `— ${prod.nm_product || prod.name_product}` : ""}
                  </option>
                ))}
              </select>
            </FormControl>
            {selectedProduct && (
              <div className="text-[11px] text-muted-foreground bg-muted/40 p-2 rounded border border-border/50 flex flex-col gap-0.5">
                <div>
                  Kode Produk: <strong className="font-mono text-foreground">{selectedProduct.code_product}</strong> (ID: {selectedProduct.id_product})
                </div>
                {(selectedProduct.nm_product || selectedProduct.name_product) && (
                  <div>
                    Nama: <span className="font-medium text-foreground">{selectedProduct.nm_product || selectedProduct.name_product}</span>
                  </div>
                )}
                {selectedProduct.product_deskripsi && (
                  <div className="text-[10px] text-muted-foreground line-clamp-1 italic">
                    {selectedProduct.product_deskripsi}
                  </div>
                )}
              </div>
            )}
          </FormItem>

          {/* 2. Serial Number (sn) */}
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                <Barcode className="h-3.5 w-3.5 text-muted-foreground" />
                Nomor Seri / Serial Number (sn)
              </FormLabel>
              <button
                type="button"
                onClick={handleGenerateSn}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                title="Generate otomatis nomor seri unik"
              >
                <Sparkles className="h-3 w-3" />
                Auto-Generate SN
              </button>
            </div>
            <FormControl>
              <Input
                required
                placeholder="Contoh: SN-BOX-202611-001"
                value={formData.sn}
                onChange={(e) => setFormData({ ...formData, sn: e.target.value })}
                className="font-mono text-sm tracking-wide"
              />
            </FormControl>
            <p className="text-[11px] text-muted-foreground">
              Nomor seri unik untuk masing-masing unit fisik (dicek keunikannya di tabel <code className="font-mono">m_product_sn</code>).
            </p>
          </FormItem>

          {/* 3. Status Kuantitas Unit (nqty): 1 = READY, 0 = SALE */}
          <FormItem>
            <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Status Ketersediaan Fisik (nqty)
            </FormLabel>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, nqty: 1 })}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5",
                  Number(formData.nqty) === 1
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold ring-1 ring-emerald-500"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                )}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-xs font-bold">READY (nqty = 1)</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Tersedia di rak gudang</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, nqty: 0 })}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5",
                  Number(formData.nqty) === 0
                    ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold ring-1 ring-amber-500"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                )}
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="text-xs font-bold">SALE / KELUAR (nqty = 0)</div>
                  <div className="text-[10px] text-muted-foreground font-normal">Sudah terdistribusi</div>
                </div>
              </button>
            </div>
          </FormItem>

          {/* 4. Lokasi & Gudang (Kolom id_product_lokasi & id_gudang) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <FormItem>
              <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Lokasi Rak (<code className="font-mono text-[10px]">id_product_lokasi</code>)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ID Lokasi (opsional)"
                  value={formData.id_product_lokasi}
                  onChange={(e) => setFormData({ ...formData, id_product_lokasi: e.target.value })}
                  className="font-mono text-xs"
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                <Warehouse className="h-3.5 w-3.5 text-muted-foreground" />
                Gudang (<code className="font-mono text-[10px]">id_gudang</code>)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ID Gudang (misal: 1)"
                  value={formData.id_gudang}
                  onChange={(e) => setFormData({ ...formData, id_gudang: e.target.value })}
                  className="font-mono text-xs"
                />
              </FormControl>
            </FormItem>
          </div>
        </form>

        {/* Footer Actions */}
        <DialogFooter className="p-4 border-t bg-muted/20 flex sm:justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Batal
          </Button>

          <Button
            type="submit"
            form="product-sn-form"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Menyimpan ke Supabase...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? "Perbarui Data" : "Simpan ke Database"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
