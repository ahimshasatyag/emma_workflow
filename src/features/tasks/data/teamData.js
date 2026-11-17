/**
 * Data Struktur Tim, Divisi/Grup Kerja, dan Karyawan Bawahan untuk Kolaborasi Kanban
 * PT Eka Maju Mesinindo
 */

export const TEAM_GROUPS = [
  {
    id: "ALL",
    name: "Semua Grup",
    badge: "SEMUA",
    color: "bg-muted text-muted-foreground border-border",
  },
  {
    id: "QC",
    name: "Quality Control & Presisi",
    badge: "QC",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "WAREHOUSE",
    name: "Gudang & Logistik WMS",
    badge: "WMS",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    id: "PROD",
    name: "Produksi & Perakitan Mesin",
    badge: "PRODUKSI",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: "PURCHASING",
    name: "Purchasing & Pengadaan",
    badge: "PURCHASING",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    id: "MAINTENANCE",
    name: "Maintenance & Mekanik",
    badge: "MEKANIK",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
]

export const TEAM_MEMBERS = [
  {
    id: "USR-01",
    name: "Budi Santoso",
    role: "Operator Senior Lapangan",
    group: "WAREHOUSE",
    avatar: "BS",
    email: "budi.santoso@ekamaju.co.id",
    isSupervisor: false,
  },
  {
    id: "USR-02",
    name: "Siti Rahma",
    role: "Staff Administrasi Gudang",
    group: "WAREHOUSE",
    avatar: "SR",
    email: "siti.rahma@ekamaju.co.id",
    isSupervisor: false,
  },
  {
    id: "USR-03",
    name: "Agus Pratama",
    role: "Teknisi QC Mesin",
    group: "QC",
    avatar: "AP",
    email: "agus.pratama@ekamaju.co.id",
    isSupervisor: false,
  },
  {
    id: "USR-04",
    name: "Dewi Lestari",
    role: "Koordinator Ekspedisi",
    group: "WAREHOUSE",
    avatar: "DL",
    email: "dewi.lestari@ekamaju.co.id",
    isSupervisor: false,
  },
  {
    id: "USR-05",
    name: "Hendra Wijaya",
    role: "Kepala Regu Produksi",
    group: "PROD",
    avatar: "HW",
    email: "hendra.wijaya@ekamaju.co.id",
    isSupervisor: false,
  },
  {
    id: "USR-06",
    name: "Rian Hidayat",
    role: "Staff Purchasing Bahan",
    group: "PURCHASING",
    avatar: "RH",
    email: "rian.hidayat@ekamaju.co.id",
    isSupervisor: false,
  },
  {
    id: "USR-07",
    name: "Fajar Nugraha",
    role: "Teknisi Mekanik & Perkakas",
    group: "MAINTENANCE",
    avatar: "FN",
    email: "fajar.nugraha@ekamaju.co.id",
    isSupervisor: false,
  },
]
