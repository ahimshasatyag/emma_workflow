import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Barcode, ScanBarcode, Database } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { BarcodeScanner } from "@/features/warehouse/components/BarcodeScanner"
import { InventoryList } from "@/features/warehouse/components/InventoryList"
import { ProductSnTable } from "@/features/warehouse/components/ProductSnTable"
import { useInventory } from "@/features/warehouse/hooks/useInventory"
import { useProductSn } from "@/features/warehouse/hooks/useProductSn"
import { cn } from "@/lib/utils"

export default function WarehousePage() {
  const { inventory } = useInventory()
  const { snList, isConfigured } = useProductSn()

  // Tab aktif: "sn" (public.m_product_sn) | "stock" (Stok Fisik & Barcode Scanner)
  const [activeTab, setActiveTab] = useState("sn")

  return (
    <motion.div
      key="warehouse-content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Manajemen Gudang & WMS"
          description="Pelacakan ketersediaan stok fisik, registrasi Serial Number (SN) unit, dan pemindai barcode SKU"
        />

        {/* Provider Database Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-muted/60 border border-border px-3 py-1.5 rounded-xl text-xs font-medium">
          <Database className={cn("h-3.5 w-3.5", isConfigured ? "text-emerald-500" : "text-amber-500")} />
          <span className="text-muted-foreground">Database:</span>
          <span className={cn("font-bold font-mono", isConfigured ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
            {isConfigured ? "Supabase PostgreSQL" : "Supabase (.env belum diisi)"}
          </span>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto">
        {/* Tab 1: Master Serial Number (Supabase public.m_product_sn & public.m_product) */}
        <button
          type="button"
          onClick={() => setActiveTab("sn")}
          className={cn(
            "relative px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer select-none flex items-center gap-2 whitespace-nowrap",
            activeTab === "sn"
              ? "text-primary dark:text-[#F4C4C5]"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          {activeTab === "sn" && (
            <motion.div
              layoutId="warehouse-active-tab"
              className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/30 z-0"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <Barcode className="h-4 w-4 relative z-10 shrink-0" />
          <span className="relative z-10">Master Serial Number (public.m_product_sn)</span>
          <span
            className={cn(
              "relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-colors",
              activeTab === "sn"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {snList.length} Unit
          </span>
        </button>

        {/* Tab 2: Stok Fisik & Pemindai Barcode (WMS Movement) */}
        <button
          type="button"
          onClick={() => setActiveTab("stock")}
          className={cn(
            "relative px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer select-none flex items-center gap-2 whitespace-nowrap",
            activeTab === "stock"
              ? "text-primary dark:text-[#F4C4C5]"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          {activeTab === "stock" && (
            <motion.div
              layoutId="warehouse-active-tab"
              className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/30 z-0"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <ScanBarcode className="h-4 w-4 relative z-10 shrink-0" />
          <span className="relative z-10">Stok Fisik & Pemindai Barcode</span>
          <span
            className={cn(
              "relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-colors",
              activeTab === "stock"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {inventory.length} SKU
          </span>
        </button>
      </div>

      {/* Konten Tab Aktif */}
      <AnimatePresence mode="wait">
        {activeTab === "sn" ? (
          <motion.div
            key="tab-sn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {/* Tabel Master Serial Number */}
            <ProductSnTable />
          </motion.div>
        ) : (
          <motion.div
            key="tab-stock"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
          >
            {/* Left Column: Barcode Scanner */}
            <div className="lg:col-span-1">
              <BarcodeScanner />
            </div>

            {/* Right Column: Inventory Table */}
            <div className="lg:col-span-2">
              <InventoryList />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
