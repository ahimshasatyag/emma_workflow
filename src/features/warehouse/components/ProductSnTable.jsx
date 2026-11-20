import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Barcode,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Package,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Copy,
  Check,
  Tag,
  Boxes,
  Database,
  MapPin,
  Warehouse,
  Calendar,
} from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProductSn } from "../hooks/useProductSn"
import { ProductSnModal } from "./ProductSnModal"
import { cn } from "@/lib/utils"

export function ProductSnTable() {
  const {
    snList,
    products,
    provider,
    isConfigured,
    isLoading,
    createSn,
    updateSn,
    deleteSn,
    toggleStatus,
  } = useProductSn()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL") // "ALL" | "READY" | "SALE"
  const [productFilter, setProductFilter] = useState("ALL")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [copiedSn, setCopiedSn] = useState(null)

  // Copy to clipboard helper
  const handleCopySn = (sn) => {
    navigator.clipboard?.writeText(sn)
    setCopiedSn(sn)
    setTimeout(() => setCopiedSn(null), 2000)
  }

  // Filter Data
  const filteredData = useMemo(() => {
    return snList.filter((item) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.sn.toLowerCase().includes(q) ||
        item.code_product.toLowerCase().includes(q) ||
        (item.nm_product && item.nm_product.toLowerCase().includes(q)) ||
        (item.name_product && item.name_product.toLowerCase().includes(q)) ||
        String(item.id_product_sn).includes(q)

      // 2. Status Filter (nqty)
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "READY" && Number(item.nqty) === 1) ||
        (statusFilter === "SALE" && Number(item.nqty) === 0)

      // 3. Product Filter
      const matchProduct =
        productFilter === "ALL" ||
        String(item.id_product) === String(productFilter) ||
        item.code_product === productFilter

      return matchSearch && matchStatus && matchProduct
    })
  }, [snList, searchQuery, statusFilter, productFilter])

  // Hitung Metrik Ringkasan
  const stats = useMemo(() => {
    const total = snList.length
    const ready = snList.filter((i) => Number(i.nqty) === 1).length
    const sale = snList.filter((i) => Number(i.nqty) === 0).length
    const ratio = total > 0 ? Math.round((ready / total) * 100) : 0
    return { total, ready, sale, ratio }
  }, [snList])

  const handleOpenAddModal = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (item) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data Serial Number "${item.sn}"?`)) {
      try {
        await deleteSn(item.id_product_sn)
      } catch (err) {
        alert(err.message || "Gagal menghapus data.")
      }
    }
  }

  const handleSaveModal = async (formData) => {
    if (editingItem) {
      await updateSn(formData)
    } else {
      await createSn(formData)
    }
  }

  const columns = [
    {
      header: "ID SN",
      accessorKey: "id_product_sn",
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-muted-foreground">
          #{row.id_product_sn}
        </span>
      ),
    },
    {
      header: "Produk (m_product)",
      accessorKey: "code_product",
      cell: (row) => (
        <div>
          <button
            type="button"
            onClick={() => handleOpenEditModal(row)}
            className="font-mono font-bold text-xs text-primary hover:underline text-left cursor-pointer flex items-center gap-1"
            title="Klik untuk melihat / mengedit data unit"
          >
            <Package className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{row.code_product}</span>
          </button>
          {(row.nm_product || row.name_product) && (
            <div className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px] truncate" title={row.nm_product || row.name_product}>
              {row.nm_product || row.name_product}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Serial Number (SN)",
      accessorKey: "sn",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-muted text-foreground border border-border flex items-center gap-1.5">
            <Barcode className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {row.sn}
          </span>
          <button
            type="button"
            onClick={() => handleCopySn(row.sn)}
            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors cursor-pointer"
            title="Salin Serial Number"
          >
            {copiedSn === row.sn ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: "Status Unit (nqty)",
      accessorKey: "nqty",
      cell: (row) => {
        const isReady = Number(row.nqty) === 1
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border",
              isReady
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isReady ? "bg-emerald-500" : "bg-amber-500"
              )}
            />
            {isReady ? "READY (1)" : "SALE (0)"}
          </span>
        )
      },
    },
    {
      header: "Lokasi / Gudang",
      accessorKey: "location",
      cell: (row) => (
        <div className="text-[11px] text-muted-foreground space-y-0.5">
          {row.id_gudang ? (
            <div className="flex items-center gap-1 font-mono">
              <Warehouse className="h-3 w-3 text-muted-foreground" />
              <span>Gudang #{row.id_gudang}</span>
            </div>
          ) : null}
          {row.id_product_lokasi ? (
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span>Rak #{row.id_product_lokasi}</span>
            </div>
          ) : (
            !row.id_gudang && <span className="text-muted-foreground/60">-</span>
          )}
        </div>
      ),
    },
    {
      header: "Tanggal",
      accessorKey: "date_create",
      cell: (row) => (
        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
          <span>{row.date_create ? String(row.date_create).substring(0, 10) : "-"}</span>
        </div>
      ),
    },
    {
      header: "Aksi / Quick Action",
      accessorKey: "actions",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {/* Quick Toggle Status */}
          <button
            type="button"
            onClick={() => toggleStatus(row)}
            className="p-1.5 rounded-lg border border-input hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title={Number(row.nqty) === 1 ? "Ubah status ke SALE (Keluar)" : "Ubah status ke READY (Masuk)"}
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">
              {Number(row.nqty) === 1 ? "Set SALE" : "Set READY"}
            </span>
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 rounded-lg border border-input hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Edit Serial Number"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg border border-input hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            title="Hapus Data SN"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* 1. Barisan Kartu Metrik Unit Serial Number */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Total Unit Fisik</span>
            <Boxes className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{stats.total}</div>
          <p className="text-[11px] text-muted-foreground">Serial Number terdaftar</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Unit READY</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {stats.ready}
          </div>
          <p className="text-[11px] text-muted-foreground">Siap didistribusikan / stok</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Unit SALE</span>
            <AlertCircle className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-primary dark:text-[#F4C4C5]">
            {stats.sale}
          </div>
          <p className="text-[11px] text-muted-foreground">Sudah terjual / keluar</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Rasio Kesiapan</span>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{stats.ratio}%</div>
          <p className="text-[11px] text-muted-foreground">Persentase stok READY</p>
        </div>
      </div>

      {/* 2. Main Table Card */}
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        {/* Header Title & Button Tambah */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Barcode className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Master Serial Number & Pelacakan Unit
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-primary/10 text-primary border border-primary/20">
                <Database className="h-3 w-3" />
                Supabase PostgreSQL
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Data terintegrasi langsung dengan tabel PostgreSQL{" "}
              <code className="text-primary font-mono font-semibold">public.m_product_sn</code> &{" "}
              <code className="text-primary font-mono font-semibold">public.m_product</code>
            </p>
          </div>

          <Button
            onClick={handleOpenAddModal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Registrasi SN Baru</span>
          </Button>
        </div>

        {/* Peringatan jika Kredensial Supabase Belum Diisi */}
        {!isConfigured && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs flex items-start gap-3 text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-sm text-foreground">Koneksi Supabase Belum Diisi di .env</div>
              <p className="text-muted-foreground leading-relaxed">
                Silakan masukkan kredensial project Supabase Anda pada file <code className="font-mono font-semibold text-primary">.env</code>:
                <br />
                <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">VITE_SUPABASE_URL=https://your-project.supabase.co</code>
                <br />
                <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">VITE_SUPABASE_ANON_KEY=your-anon-key</code>
              </p>
            </div>
          </div>
        )}

        {/* Filter Bar: Pencarian, Status (nqty), dan Filter Produk */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Input Pencarian */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan Serial Number, Kode Produk, Nama Barang, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Filter Status (nqty) */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
            {[
              { id: "ALL", label: "Semua Status" },
              { id: "READY", label: "READY (1)" },
              { id: "SALE", label: "SALE (0)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                  statusFilter === tab.id
                    ? "bg-card text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter Dropdown Produk */}
          <div className="w-full sm:w-56">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary font-medium font-mono"
            >
              <option value="ALL">Semua Produk (m_product)</option>
              {products.map((prod) => (
                <option key={prod.id_product} value={prod.id_product}>
                  {prod.code_product} {prod.nm_product || prod.name_product ? `— ${prod.nm_product || prod.name_product}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabel Data Unit */}
        <DataTable
          columns={columns}
          data={filteredData}
          searchKey="sn"
          pageSize={10}
        />
      </div>

      {/* Modal Dialog Form Tambah / Edit */}
      <ProductSnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingItem={editingItem}
        products={products}
        onSubmit={handleSaveModal}
      />
    </div>
  )
}
