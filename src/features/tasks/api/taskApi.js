import { TASK_STATUS, TASK_PRIORITY } from "@/config/constants"
import { kanbanItemApi } from "./kanbanItemApi"

const STORAGE_KEY = "emma_workflow_tasks"

function getStoredTasks() {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  return []
}

function saveStoredTasks(tasks) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {}
  }
}

let memoryTasks = getStoredTasks()

export const taskApi = {
  /**
   * Mengambil semua daftar tugas Kanban
   */
  getTasks: async (params = {}) => {
    return memoryTasks
  },

  /**
   * Mengambil detail satu tugas berdasarkan ID
   */
  getTaskById: async (id) => {
    return memoryTasks.find((t) => t.id === id) || null
  },

  /**
   * Menambahkan tugas baru ke papan Kanban
   */
  createTask: async (taskData) => {
    const timestamp = Date.now()
    const numericKanbanId =
      taskData.kanbanId || Number(String(timestamp).slice(-6))
    const newId = taskData.id || `TSK-${numericKanbanId}`

    const newTask = {
      id: newId,
      kanbanId: numericKanbanId,
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.MEDIUM,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      comments: [],
      ...taskData,
    }

    memoryTasks = [newTask, ...memoryTasks]
    saveStoredTasks(memoryTasks)

    // Simpan relasi anggota kolaborasi ke public.t_kanban_item di Supabase
    if (Array.isArray(taskData.collaboratorIds) && taskData.collaboratorIds.length > 0) {
      await kanbanItemApi.syncKanbanItems(numericKanbanId, taskData.collaboratorIds)
    }

    return newTask
  },

  /**
   * Memperbarui detail tugas
   */
  updateTask: async (id, taskData) => {
    const existing = memoryTasks.find((t) => t.id === id)
    const numericKanbanId =
      taskData.kanbanId ||
      existing?.kanbanId ||
      Number(String(id).replace(/\D/g, "")) ||
      Date.now()

    memoryTasks = memoryTasks.map((t) =>
      t.id === id ? { ...t, ...taskData, kanbanId: numericKanbanId } : t
    )
    saveStoredTasks(memoryTasks)

    // Simpan relasi anggota kolaborasi ke public.t_kanban_item di Supabase
    if (Array.isArray(taskData.collaboratorIds)) {
      await kanbanItemApi.syncKanbanItems(numericKanbanId, taskData.collaboratorIds)
    }

    return memoryTasks.find((t) => t.id === id)
  },

  /**
   * Memindahkan status tugas (Kanban Move / Drag-and-Drop)
   */
  moveTask: async (id, newStatus) => {
    memoryTasks = memoryTasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    saveStoredTasks(memoryTasks)
    return { success: true, id, status: newStatus }
  },

  /**
   * Menambahkan komentar diskusi atau instruksi atasan pada tugas
   */
  addComment: async (id, comment) => {
    const newComment = {
      id: `C-${Date.now()}`,
      createdAt: "Baru saja",
      ...comment,
    }

    memoryTasks = memoryTasks.map((t) =>
      t.id === id ? { ...t, comments: [...(t.comments || []), newComment] } : t
    )
    saveStoredTasks(memoryTasks)
    return newComment
  },

  /**
   * Menghapus tugas dari papan Kanban
   */
  deleteTask: async (id) => {
    const existing = memoryTasks.find((t) => t.id === id)
    const numericKanbanId =
      existing?.kanbanId || Number(String(id).replace(/\D/g, ""))

    if (numericKanbanId) {
      await kanbanItemApi.deleteByKanbanId(numericKanbanId)
    }

    memoryTasks = memoryTasks.filter((t) => t.id !== id)
    saveStoredTasks(memoryTasks)
    return { success: true, id }
  },
}
