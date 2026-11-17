import React, { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Inbox } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * DataTable custom reusable dengan sorting, pencarian, dan pagination
 *
 * @param {Array} columns - Definisikan kolom [{ header: 'Nama', accessorKey: 'name', cell: (row) => ... }]
 * @param {Array} data - Data mentah array of objects
 * @param {string} searchPlaceholder - Placeholder kotak pencarian
 * @param {number} pageSize - Jumlah baris per halaman
 */
export function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = "Cari data...",
  pageSize = 5,
  className,
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

  // Filter pencarian
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data
    const query = searchTerm.toLowerCase()
    return data.filter((item) =>
      Object.values(item).some(
        (val) => val && String(val).toLowerCase().includes(query)
      )
    )
  }, [data, searchTerm])

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal === bVal) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal
      }
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [filteredData, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-8"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Menampilkan {filteredData.length} data
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => col.accessorKey && handleSort(col.accessorKey)}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.accessorKey && (
                        <ArrowUpDown className="h-3 w-3 opacity-50 hover:opacity-100" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-muted/40 transition-colors">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 align-middle">
                        {col.cell ? col.cell(row) : row[col.accessorKey] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="h-8 w-8 stroke-1 text-muted-foreground" />
                      <p>Tidak ada data yang ditemukan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs">
          <div className="text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Berikutnya
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
