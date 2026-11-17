import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  KanbanSquare,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { useTasksQuery } from "@/features/tasks/hooks/useTasksQuery"
import { useInventory } from "@/features/warehouse/hooks/useInventory"
import { useTaskStore } from "@/features/tasks/stores/taskStore"
import { TaskDetailModal } from "@/features/tasks/components/TaskDetailModal"
import { DashboardSkeleton } from "./DashboardSkeleton"
import { TASK_STATUS } from "@/config/constants"
import { formatDate } from "@/lib/formatDate"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { tasks, isLoading: tasksLoading, createTask, updateTask, deleteTask } = useTasksQuery()
  const { inventory, isLoading: inventoryLoading } = useInventory()
  const { openDetailModal } = useTaskStore()

  // State transisi skeleton mulus saat login / pertama masuk ke dashboard
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const isLoading = isInitialLoading || tasksLoading || inventoryLoading

  const todoCount = tasks.filter((t) => t.status === TASK_STATUS.TODO).length
  const inProgressCount = tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length
  const doneCount = tasks.filter((t) => t.status === TASK_STATUS.DONE).length

  const lowStockCount = inventory.filter(
    (i) => i.status === "LOW_STOCK" || i.stock <= i.minStock
  ).length

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <DashboardSkeleton key="dashboard-skeleton" />
      ) : (
        <motion.div
          key="dashboard-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          <PageHeader
            title="Dashboard Ringkasan Operasional"
            description="Pantau alur kerja proyek Kanban dan pergerakan stok gudang secara real-time"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => navigate("/tasks")}>
                <KanbanSquare className="h-4 w-4 mr-2" />
                Buka Kanban Board
              </Button>
            </motion.div>
          </PageHeader>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="rounded-xl border bg-card p-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Tugas Sedang Berjalan</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">{inProgressCount}</span>
            <p className="text-xs text-muted-foreground mt-1">
              Dari total {tasks.length} tugas terdaftar
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="rounded-xl border bg-card p-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Tugas Selesai</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">{doneCount}</span>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              Tingkat penyelesaian {Math.round((doneCount / (tasks.length || 1)) * 100)}%
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="rounded-xl border bg-card p-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total SKU Gudang</span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600">
              <Warehouse className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">{inventory.length} SKU</span>
            <p className="text-xs text-muted-foreground mt-1">Terpantau aktif di sistem WMS</p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="rounded-xl border bg-card p-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Peringatan Stok Menipis</span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-amber-600">{lowStockCount} Item</span>
            <p className="text-xs text-muted-foreground mt-1">Perlu pemesanan ulang (Reorder)</p>
          </div>
        </motion.div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Tasks */}
        <motion.div variants={itemVariants} className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Aktivitas Tugas Terbaru</h2>
              <p className="text-xs text-muted-foreground">Tugas aktif dalam antrean Kanban</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")}>
              Lihat Semua
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="divide-y divide-border">
            {tasks.slice(0, 4).map((task) => (
              <motion.div
                key={task.id}
                layout
                layoutId={`task-card-${task.id}`}
                onClick={() => openDetailModal(task.id)}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                className="py-3 px-2 rounded-xl flex items-center justify-between gap-3 cursor-pointer hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {task.id}
                    </span>
                    <span className="font-medium text-sm text-foreground truncate">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>PIC: {task.assignee || "-"}</span>
                    <span>•</span>
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                </div>

                <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {task.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Quick Inventory Alert */}
        <motion.div variants={itemVariants} className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Status Cepat Gudang</h2>
              <p className="text-xs text-muted-foreground">Item yang memerlukan perhatian khusus</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/warehouse")}>
              Buka WMS
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="divide-y divide-border">
            {inventory.slice(0, 4).map((item) => (
              <motion.div
                key={item.id}
                layout
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="py-3 px-2 rounded-xl flex items-center justify-between hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-primary">{item.sku}</div>
                  <div className="text-sm font-medium text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.location}</div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold font-mono text-foreground">{item.stock}</span>
                  <p className="text-xs text-muted-foreground">{item.unit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

          {/* Modal Detail Task dengan Shared Layout Fluid Morph Transition */}
          <TaskDetailModal
            tasks={tasks}
            onCreateTask={createTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
