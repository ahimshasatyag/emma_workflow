/**
 * Konstanta Global Aplikasi EMMA Workflow
 */

// Role Pengguna
export const ROLES = {
  ADMIN: 1,
  SUPERVISOR: 2,
  OPERATOR: 3,
  GUEST: 4,
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.SUPERVISOR]: "Supervisor",
  [ROLES.OPERATOR]: "Operator Lapangan",
  [ROLES.GUEST]: "Tamu / Viewer",
}

// Status Tugas / Kanban
export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE",
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.REVIEW]: "Review",
  [TASK_STATUS.DONE]: "Done",
}

// Prioritas Tugas
export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
}

// Status Gudang / Inventory
export const WAREHOUSE_MOVEMENT = {
  INBOUND: "INBOUND",
  OUTBOUND: "OUTBOUND",
  ADJUSTMENT: "ADJUSTMENT",
}

// Grup & Divisi Tim Kerja EMMA Workflow
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

// Kunci LocalStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: "emma_auth_token",
  USER_DATA: "emma_user_data",
  THEME: "emma_theme",
}
