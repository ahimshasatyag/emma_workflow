import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScanBarcode, Camera, ArrowDownLeft, ArrowUpRight, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { warehouseApi } from "../api/warehouseApi"
import { useInventory } from "../hooks/useInventory"

export function BarcodeScanner({ onScanSuccess }) {
  const { recordMovement } = useInventory()
  const [barcodeInput, setBarcodeInput] = useState("")
  const [scannedItem, setScannedItem] = useState(null)
  const [error, setError] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [movementQty, setMovementQty] = useState(1)
  const [successMessage, setSuccessMessage] = useState("")

  const handleScan = async (codeToScan) => {
    const code = codeToScan || barcodeInput
    if (!code.trim()) return

    setError("")
    setSuccessMessage("")
    setIsScanning(true)

    try {
      const item = await warehouseApi.scanBarcode(code.trim())
      setScannedItem(item)
      onScanSuccess?.(item)
    } catch (err) {
      setError(err.message)
      setScannedItem(null)
    } finally {
      setIsScanning(false)
    }
  }

  const handleQuickMovement = async (type) => {
    if (!scannedItem) return
    try {
      await recordMovement({
        sku: scannedItem.sku,
        type,
        quantity: Number(movementQty),
        notes: `Scan transaksi cepat ${type}`,
      })
      setSuccessMessage(`Berhasil mencatat ${type} sebanyak ${movementQty} ${scannedItem.unit}.`)
      setScannedItem((prev) => ({
        ...prev,
        stock:
          type === "INBOUND"
            ? prev.stock + Number(movementQty)
            : Math.max(0, prev.stock - Number(movementQty)),
      }))
    } catch (err) {
      setError(err.message || "Gagal mencatat mutasi barang.")
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <ScanBarcode className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Pemindai Barcode / SKU</h2>
            <p className="text-xs text-muted-foreground">Scan label fisik atau masukkan kode SKU barang</p>
          </div>
        </div>
      </div>

      {/* Simulated Camera Scanner Viewfinder dengan Framer Motion Laser */}
      <div className="relative overflow-hidden rounded-xl bg-slate-950 p-6 text-center text-slate-300">
        <div className="mx-auto w-64 h-36 border-2 border-dashed border-primary/70 rounded-lg relative flex flex-col items-center justify-center bg-black/40 overflow-hidden">
          {/* Animated Laser Scan Line bertenaga Framer Motion */}
          <motion.div
            animate={{
              y: [-60, 60, -60],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444]"
          />
          <Camera className="h-8 w-8 text-primary/60 mb-2 relative z-10" />
          <span className="text-xs text-slate-400 font-mono relative z-10">Area Pemindai Barcode</span>
        </div>

        {/* Quick Sample Barcode Pills */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400">Contoh Barcode:</span>
          {["RM-STL-01", "RM-RSN-09", "FG-BOX-10"].map((sample) => (
            <motion.button
              key={sample}
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => {
                setBarcodeInput(sample)
                handleScan(sample)
              }}
              className="rounded bg-slate-800 px-2 py-1 font-mono text-primary hover:bg-slate-700 transition-colors"
            >
              {sample}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input Text Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleScan()
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Ketik kode barcode atau SKU..."
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          className="font-mono text-sm flex-1"
        />
        <motion.div whileTap={{ scale: 0.95 }} className="shrink-0">
          <Button type="submit" disabled={isScanning}>
            {isScanning ? "Memindai..." : "Cari / Scan"}
          </Button>
        </motion.div>
      </form>

      {/* Error & Success Messages with AnimatePresence */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-emerald-500/15 p-3 text-sm text-emerald-600 dark:text-emerald-400"
          >
            <Check className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanned Item Info Card with Framer Motion */}
      <AnimatePresence>
        {scannedItem && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <span className="font-mono text-xs text-primary font-bold">{scannedItem.sku}</span>
                <h4 className="text-base font-semibold text-foreground leading-snug">{scannedItem.name}</h4>
                <p className="text-xs text-muted-foreground">{scannedItem.location}</p>
              </div>
              <div className="text-right shrink-0 pl-2">
                <span className="text-2xl font-bold font-mono text-foreground leading-none">{scannedItem.stock}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{scannedItem.unit}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border space-y-3">
              {/* Stepper Kuantitas Mutasi Responsif */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">Kuantitas:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMovementQty((prev) => Math.max(1, prev - 1))}
                    className="h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted text-foreground flex items-center justify-center font-bold text-base transition-colors cursor-pointer select-none"
                    title="Kurangi kuantitas"
                  >
                    -
                  </button>
                  <Input
                    type="number"
                    min="1"
                    value={movementQty}
                    onChange={(e) => setMovementQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-8 text-center font-bold text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setMovementQty((prev) => prev + 1)}
                    className="h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted text-foreground flex items-center justify-center font-bold text-base transition-colors cursor-pointer select-none"
                    title="Tambah kuantitas"
                  >
                    +
                  </button>
                  <span className="text-xs font-semibold text-muted-foreground pl-1">{scannedItem.unit}</span>
                </div>
              </div>

              {/* Grid 2 Kolom untuk Inbound & Outbound agar Selalu Pas di Dalam Card */}
              <div className="grid grid-cols-2 gap-2 pt-1 w-full">
                <motion.div whileTap={{ scale: 0.96 }} className="w-full">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickMovement("INBOUND")}
                    className="w-full h-10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold text-[11px] sm:text-xs flex items-center justify-center gap-1 px-1.5"
                  >
                    <ArrowDownLeft className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span className="truncate">Inbound (+Masuk)</span>
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.96 }} className="w-full">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickMovement("OUTBOUND")}
                    className="w-full h-10 border-primary/40 text-primary dark:text-[#F4C4C5] hover:bg-primary/10 hover:text-primary dark:hover:text-[#F4C4C5] font-semibold text-[11px] sm:text-xs flex items-center justify-center gap-1 px-1.5"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">Outbound (-Keluar)</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
