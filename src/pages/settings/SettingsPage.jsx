import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  Warehouse,
  KanbanSquare,
  Server,
  Save,
  CheckCircle2,
  AlertCircle,
  Database,
  Download,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SettingsSkeleton } from "./SettingsSkeleton"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")

  // Tab 1: Profil Perusahaan
  const [companySettings, setCompanySettings] = useState({
    companyName: "PT Eka Maju Mesinindo",
    legalName: "PT Eka Maju Mesinindo - Industrial Machinery & Automation",
    npwp: "01.234.567.8-042.000",
    factoryLocation: "Kawasan Industri Jababeka Blok C No. 12, Cikarang, Jawa Barat",
    operatingHours: "Senin - Jumat: 08:00 - 17:00 WIB",
    timezone: "Asia/Jakarta (WIB / UTC+7)",
    contactEmail: "operasional@ekamaju.co.id",
  })

  // Tab 2: Standar Gudang & WMS
  const [warehouseSettings, setWarehouseSettings] = useState({
    defaultMinStock: "10",
    rawMaterialPrefix: "RM-",
    finishedGoodsPrefix: "FG-",
    sparepartPrefix: "SP-",
    auditTolerance: "2.0",
    valuationMethod: "FIFO (First-In, First-Out)",
    autoLowStockAlert: true,
  })

  // Tab 3: Alur Kerja & Kanban
  const [workflowSettings, setWorkflowSettings] = useState({
    wipLimitPerPic: "5",
    standardSlaHours: "48",
    urgentSlaHours: "12",
    requireQcApproval: true,
    autoArchiveDoneTasks: true,
  })

  // Tab 4: Server & Integrasi
  const [serverSettings, setServerSettings] = useState({
    apiEndpoint: import.meta.env.VITE_API_BASE_URL || "https://api.ekamaju.co.id/v1",
    databaseStatus: "Terhubung (PostgreSQL / CodeIgniter Engine)",
    lastBackupTime: "17 Nov 2026, 02:00 WIB",
    autoBackupDaily: true,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = (tabName) => {
    setSuccessMessage(`Pengaturan ${tabName} berhasil disimpan dan diperbarui.`)
    setTimeout(() => setSuccessMessage(""), 4000)
  }

  const tabs = [
    { id: "company", label: "Profil Perusahaan", icon: Building2 },
    { id: "warehouse", label: "Standar Gudang & WMS", icon: Warehouse },
    { id: "workflow", label: "Alur Kerja Kanban", icon: KanbanSquare },
    { id: "system", label: "Integrasi & Server", icon: Server },
  ]

  return (
    <AnimatePresence mode="wait">
      {isInitialLoading ? (
        <SettingsSkeleton key="settings-skeleton" />
      ) : (
        <motion.div
          key="settings-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <PageHeader
            title="Pengaturan Sistem & Operasional"
            description="Konfigurasi parameter operasional alur kerja perusahaan, aturan WMS, dan integrasi server EMMA"
          />

          {/* Feedback Toast */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-sm text-emerald-700 dark:text-emerald-300 shadow-xs"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs Bar */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-border bg-card shadow-xs overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold rounded-xl transition-colors cursor-pointer select-none whitespace-nowrap shrink-0",
                    isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="settings-active-tab"
                      className="absolute inset-0 bg-[#9e0b0f] rounded-xl shadow-xs z-0"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <Icon className={cn("h-4 w-4 relative z-10 shrink-0", isActive && "text-white")} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab 1: Profil Perusahaan */}
          {activeTab === "company" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6"
            >
              <div className="pb-3 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Identitas & Operasional Perusahaan</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Informasi entitas legal pabrik dan jadwal operasional resmi PT Eka Maju Mesinindo
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Nama Resmi Entitas</label>
                  <Input
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Nomor Pokok Wajib Pajak (NPWP)</label>
                  <Input
                    value={companySettings.npwp}
                    onChange={(e) => setCompanySettings({ ...companySettings, npwp: e.target.value })}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Jam Kerja Operasional Gudang & QC</label>
                  <Input
                    value={companySettings.operatingHours}
                    onChange={(e) => setCompanySettings({ ...companySettings, operatingHours: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Zona Waktu Sistem</label>
                  <Input
                    value={companySettings.timezone}
                    disabled
                    className="bg-muted/50 cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Alamat Pabrik & Gudang Utama</label>
                <textarea
                  rows={2}
                  value={companySettings.factoryLocation}
                  onChange={(e) => setCompanySettings({ ...companySettings, factoryLocation: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button onClick={() => handleSave("Profil Perusahaan")}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Profil Perusahaan
                </Button>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Standar Gudang & WMS */}
          {activeTab === "warehouse" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6"
            >
              <div className="pb-3 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Standar Gudang & Manajemen Inventaris</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Format penomoran SKU otomatis, batas minimum stok, dan metode valuasi persediaan
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Warehouse className="h-5 w-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Prefix Bahan Baku (Raw Material)</label>
                  <Input
                    value={warehouseSettings.rawMaterialPrefix}
                    onChange={(e) => setWarehouseSettings({ ...warehouseSettings, rawMaterialPrefix: e.target.value })}
                    className="font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Prefix Produk Jadi (Finished Goods)</label>
                  <Input
                    value={warehouseSettings.finishedGoodsPrefix}
                    onChange={(e) => setWarehouseSettings({ ...warehouseSettings, finishedGoodsPrefix: e.target.value })}
                    className="font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Prefix Komponen (Sparepart)</label>
                  <Input
                    value={warehouseSettings.sparepartPrefix}
                    onChange={(e) => setWarehouseSettings({ ...warehouseSettings, sparepartPrefix: e.target.value })}
                    className="font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Ambang Batas Minimum Stok Default</label>
                  <Input
                    type="number"
                    value={warehouseSettings.defaultMinStock}
                    onChange={(e) => setWarehouseSettings({ ...warehouseSettings, defaultMinStock: e.target.value })}
                    className="font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">Peringatan otomatis muncul jika stok di bawah angka ini.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Toleransi Selisih Stock Opname (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={warehouseSettings.auditTolerance}
                    onChange={(e) => setWarehouseSettings({ ...warehouseSettings, auditTolerance: e.target.value })}
                    className="font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">Batas deviasi kuantitas fisik sebelum wajib investigasi supervisor.</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Metode Penilaian Persediaan</label>
                <Input
                  value={warehouseSettings.valuationMethod}
                  disabled
                  className="bg-muted/50 cursor-not-allowed opacity-80"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button onClick={() => handleSave("Standar Gudang & WMS")}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Standar WMS
                </Button>
              </div>
            </motion.div>
          )}

          {/* Tab 3: Alur Kerja Kanban */}
          {activeTab === "workflow" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6"
            >
              <div className="pb-3 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Parameter Alur Kerja & Kanban</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Batas beban pengerjaan (WIP Limit), target SLA, dan tahapan verifikasi alur kerja
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                  <KanbanSquare className="h-5 w-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Batas Maksimum Tugas Aktif (WIP Limit per PIC)</label>
                  <Input
                    type="number"
                    value={workflowSettings.wipLimitPerPic}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, wipLimitPerPic: e.target.value })}
                    className="font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">Mencegah overload pekerjaan per PIC pada fase IN_PROGRESS.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Waktu SLA Standar (Jam)</label>
                  <Input
                    type="number"
                    value={workflowSettings.standardSlaHours}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, standardSlaHours: e.target.value })}
                    className="font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">Batas waktu normal sebelum kartu tugas ditandai terlambat.</p>
                </div>
              </div>

              {/* Status Checks */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="text-xs font-bold text-foreground">Wajib Verifikasi Supervisor sebelum Status DONE</div>
                    <div className="text-[11px] text-muted-foreground">Kartu dari fase REVIEW hanya bisa dipindahkan oleh level Supervisor/Admin</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={workflowSettings.requireQcApproval}
                    onChange={(e) => setWorkflowSettings({ ...workflowSettings, requireQcApproval: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-[#9e0b0f] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button onClick={() => handleSave("Alur Kerja Kanban")}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Parameter Kanban
                </Button>
              </div>
            </motion.div>
          )}

          {/* Tab 4: Server & Integrasi */}
          {activeTab === "system" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6"
            >
              <div className="pb-3 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Integrasi Server & Pemeliharaan Database</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Koneksi backend CodeIgniter, pemantauan status database, dan pencadangan data berkala
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Server className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Database className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-xs font-bold text-foreground">Status Database Backend</div>
                        <div className="text-[11px] text-muted-foreground">CodeIgniter RESTful Engine v4</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Online & Optimal
                    </span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground pt-1">
                    API Base URL: <span className="text-foreground font-semibold">{serverSettings.apiEndpoint}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-foreground">Pencadangan Terakhir (Database Snapshot)</div>
                    <div className="text-[11px] text-muted-foreground">
                      Pencadangan otomatis berhasil dijalankan pada {serverSettings.lastBackupTime}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      alert("Memulai unduhan cadangan data inventaris & tugas EMMA...")
                    }}
                  >
                    <Download className="h-4 w-4 mr-1.5" />
                    Unduh Cadangan
                  </Button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button onClick={() => handleSave("Integrasi Server")}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Konfigurasi Server
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
