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

// Kunci LocalStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: "emma_auth_token",
  USER_DATA: "emma_user_data",
  THEME: "emma_theme",
}
