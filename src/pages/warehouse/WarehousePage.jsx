import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/shared/PageHeader"
import { BarcodeScanner } from "@/features/warehouse/components/BarcodeScanner"
import { InventoryList } from "@/features/warehouse/components/InventoryList"
import { useInventory } from "@/features/warehouse/hooks/useInventory"
import { WarehouseSkeleton } from "./WarehouseSkeleton"

export default function WarehousePage() {
  const { isLoading: inventoryLoading } = useInventory()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const isLoading = isInitialLoading || inventoryLoading

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <WarehouseSkeleton key="warehouse-skeleton" />
      ) : (
        <motion.div
          key="warehouse-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <PageHeader
            title="Manajemen Gudang & WMS"
            description="Pelacakan ketersediaan stok fisik, pemindai barcode SKU, mutasi inbound & outbound"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Barcode Scanner */}
            <div className="lg:col-span-1">
              <BarcodeScanner />
            </div>

            {/* Right Column: Inventory Table */}
            <div className="lg:col-span-2">
              <InventoryList />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
