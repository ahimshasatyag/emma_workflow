import axiosClient from "@/api/axiosClient"
import { TASK_STATUS, TASK_PRIORITY } from "@/config/constants"

// Mock data awal jika backend CodeIgniter belum aktif
const initialMockTasks = [
  {
    id: "TSK-001",
    title: "Verifikasi PO Pembelian Bahan Baku Baja",
    description: "Cek kelengkapan dokumen purchase order supplier baja PT Krakatau Steel dan sesuaikan PO masuk.",
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.HIGH,
    group: "PURCHASING",
    assignee: "Rian Hidayat",
    assignedBy: "Marta Seixas (Manager)",
    collaborators: ["Budi Santoso"],
    dueDate: "2026-11-20",
    tags: ["Purchasing", "Baja"],
    comments: [
      {
        id: "C-1",
        author: "Marta Seixas",
        role: "Manager Operasional",
        avatar: "MS",
        text: "Tolong pastikan faktur pajak dan sertifikasi COA material sudah terlampir ya Rian.",
        createdAt: "2 jam lalu",
        isSupervisor: true,
      },
    ],
  },
  {
    id: "TSK-002",
    title: "Stock Opname Gudang Blok B & Palet Resin",
    description: "Hitung fisik palet resin dan sesuaikan selisih kuantitas pada sistem WMS sebelum closing bulanan.",
    status: TASK_STATUS.IN_PROGRESS,
    priority: TASK_PRIORITY.URGENT,
    group: "WAREHOUSE",
    assignee: "Siti Rahma",
    assignedBy: "Marta Seixas (Manager)",
    collaborators: ["Budi Santoso", "Dewi Lestari"],
    dueDate: "2026-11-18",
    tags: ["Warehouse", "Audit"],
    comments: [
      {
        id: "C-2",
        author: "Marta Seixas",
        role: "Manager Operasional",
        avatar: "MS",
        text: "Siti, jangan lupa pakai scanner barcode SKU FG-BOX-10 di rak C ya biar akurat.",
        createdAt: "1 jam lalu",
        isSupervisor: true,
      },
      {
        id: "C-3",
        author: "Siti Rahma",
        role: "Staff Administrasi Gudang",
        avatar: "SR",
        text: "Siap Bu Marta, Budi sedang hitung fisik di Blok B dan data sementara cocok.",
        createdAt: "30 menit lalu",
        isSupervisor: false,
      },
    ],
  },
  {
    id: "TSK-003",
    title: "Review Hasil Uji QC Presisi Batch #8812",
    description: "Analisis laporan toleransi dimensi dan kekasaran permukaan pada produk cetak injeksi presisi tinggi.",
    status: TASK_STATUS.REVIEW,
    priority: TASK_PRIORITY.MEDIUM,
    group: "QC",
    assignee: "Agus Pratama",
    assignedBy: "Marta Seixas (Manager)",
    collaborators: ["Fajar Nugraha"],
    dueDate: "2026-11-19",
    tags: ["QC", "Injeksi"],
    comments: [
      {
        id: "C-4",
        author: "Agus Pratama",
        role: "Teknisi QC Mesin",
        avatar: "AP",
        text: "Sampel no. 12 sampai 15 toleransinya 0.02mm, sudah masuk standar toleransi industri.",
        createdAt: "45 menit lalu",
        isSupervisor: false,
      },
    ],
  },
  {
    id: "TSK-004",
    title: "Pengiriman Kontainer Ekspor #EXP-04 Mesinindo",
    description: "Surat jalan, packing list, dan container seal telah divalidasi oleh pihak bea cukai pelabuhan.",
    status: TASK_STATUS.DONE,
    priority: TASK_PRIORITY.LOW,
    group: "WAREHOUSE",
    assignee: "Dewi Lestari",
    assignedBy: "Marta Seixas (Manager)",
    collaborators: ["Hendra Wijaya"],
    dueDate: "2026-11-15",
    tags: ["Logistik", "Ekspor"],
    comments: [],
  },
]

// Simpan state mock di memory session
let localTasks = [...initialMockTasks]

export const taskApi = {
  /**
   * Mengambil semua daftar tugas
   */
  getTasks: async (params = {}) => {
    try {
      const response = await axiosClient.get("/tasks", { params })
      return response.data || response
    } catch {
      // Fallback ke local mock tasks
      return localTasks
    }
  },

  /**
   * Mengambil detail tugas berdasarkan ID
   */
  getTaskById: async (id) => {
    try {
      const response = await axiosClient.get(`/tasks/${id}`)
      return response.data || response
    } catch {
      return localTasks.find((t) => t.id === id) || null
    }
  },

  /**
   * Menambahkan tugas baru
   */
  createTask: async (taskData) => {
    try {
      const response = await axiosClient.post("/tasks", taskData)
      return response.data || response
    } catch {
      const newTask = {
        id: `TSK-00${localTasks.length + 1}`,
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: new Date().toISOString().split("T")[0],
        ...taskData,
      }
      localTasks = [newTask, ...localTasks]
      return newTask
    }
  },

  /**
   * Memperbarui data tugas
   */
  updateTask: async (id, taskData) => {
    try {
      const response = await axiosClient.put(`/tasks/${id}`, taskData)
      return response.data || response
    } catch {
      localTasks = localTasks.map((t) => (t.id === id ? { ...t, ...taskData } : t))
      return localTasks.find((t) => t.id === id)
    }
  },

  /**
   * Memindahkan status tugas (Kanban drag-and-drop)
   */
  moveTask: async (id, newStatus) => {
    try {
      const response = await axiosClient.patch(`/tasks/${id}/move`, { status: newStatus })
      return response.data || response
    } catch {
      localTasks = localTasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      return { success: true, id, status: newStatus }
    }
  },

  /**
   * Menambahkan komentar / instruksi kerja kolaborasi pada tugas
   */
  addComment: async (id, comment) => {
    try {
      const response = await axiosClient.post(`/tasks/${id}/comments`, comment)
      return response.data || response
    } catch {
      const newComment = {
        id: `C-${Date.now()}`,
        createdAt: "Baru saja",
        ...comment,
      }
      localTasks = localTasks.map((t) =>
        t.id === id ? { ...t, comments: [...(t.comments || []), newComment] } : t
      )
      return newComment
    }
  },

  /**
   * Menghapus tugas
   */
  deleteTask: async (id) => {
    try {
      return await axiosClient.delete(`/tasks/${id}`)
    } catch {
      localTasks = localTasks.filter((t) => t.id !== id)
      return { success: true, id }
    }
  },
}
