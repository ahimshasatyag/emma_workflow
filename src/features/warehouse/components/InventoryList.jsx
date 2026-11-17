import React from "react"
import { DataTable } from "@/components/shared/DataTable"
import { useInventory } from "../hooks/useInventory"
import { cn } from "@/lib/utils"

export function InventoryList() {
  const { inventory, isLoading } = useInventory()

  const columns = [
    {
      header: "SKU / Kode",
      accessorKey: "sku",
      cell: (row) => (
        <span className="font-mono font-bold text-xs text-primary">
          {row.sku}
        </span>
      ),
    },
    {
      header: "Nama Barang",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <div className="font-medium text-foreground">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.category}</div>
        </div>
      ),
    },
    {
      header: "Lokasi Rak",
      accessorKey: "location",
      cell: (row) => <span className="text-xs text-muted-foreground">{row.location}</span>,
    },
    {
      header: "Stok Tersedia",
      accessorKey: "stock",
      cell: (row) => (
        <div className="font-mono text-sm">
          <span className="font-bold">{row.stock}</span>{" "}
          <span className="text-xs text-muted-foreground">{row.unit}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        const isOut = row.status === "OUT_OF_STOCK" || row.stock === 0
        const isLow = row.status === "LOW_STOCK" || (row.stock <= row.minStock && row.stock > 0)

        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              isOut
                ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                : isLow
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            )}
          >
            {isOut ? "Habis" : isLow ? "Menipis" : "Tersedia"}
          </span>
        )
      },
    },
  ]

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Daftar Stok Fisik Gudang</h2>
        <p className="text-xs text-muted-foreground">Monitoring ketersediaan barang dan batas minimum stok</p>
      </div>

      <DataTable
        columns={columns}
        data={inventory}
        searchPlaceholder="Cari berdasarkan SKU, nama, lokasi..."
        pageSize={6}
      />
    </div>
  )
}
