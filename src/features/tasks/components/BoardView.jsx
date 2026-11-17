import React, { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, CheckCircle2, Clock, PlayCircle, Eye, Users } from "lucide-react"
import { TASK_STATUS, TASK_STATUS_LABELS } from "@/config/constants"
import { TaskCard } from "./TaskCard"
import { TaskDetailModal } from "./TaskDetailModal"
import { useTasksQuery } from "../hooks/useTasksQuery"
import { useDragAndDrop } from "../hooks/useDragAndDrop"
import { useTaskStore } from "../stores/taskStore"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { cn } from "@/lib/utils"

const COLUMNS = [
  {
    status: TASK_STATUS.TODO,
    label: TASK_STATUS_LABELS[TASK_STATUS.TODO],
    icon: Clock,
    color: "border-slate-300 dark:border-slate-800",
    headerBg: "bg-slate-100 dark:bg-slate-900",
  },
  {
    status: TASK_STATUS.IN_PROGRESS,
    label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS],
    icon: PlayCircle,
    color: "border-blue-300 dark:border-blue-900",
    headerBg: "bg-blue-50/60 dark:bg-blue-950/40",
  },
  {
    status: TASK_STATUS.REVIEW,
    label: TASK_STATUS_LABELS[TASK_STATUS.REVIEW],
    icon: Eye,
    color: "border-amber-300 dark:border-amber-900",
    headerBg: "bg-amber-50/60 dark:bg-amber-950/40",
  },
  {
    status: TASK_STATUS.DONE,
    label: TASK_STATUS_LABELS[TASK_STATUS.DONE],
    icon: CheckCircle2,
    color: "border-emerald-300 dark:border-emerald-900",
    headerBg: "bg-emerald-50/60 dark:bg-emerald-950/40",
  },
]

export function BoardView() {
  const { user } = useAuth()
  const { tasks, moveTask, createTask, updateTask, deleteTask, addComment } = useTasksQuery()
  const {
    openCreateModal,
    searchQuery,
    activePriorityFilter,
    activeGroupFilter,
    activeAssignmentFilter,
  } = useTaskStore()

  const {
    activeOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop(moveTask)

  const currentUserName = user?.name || "Marta Seixas"

  // Filter tasks berdasarkan search, prioritas, grup divisi, dan role kolaborasi
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query
      const q = searchQuery ? searchQuery.toLowerCase() : ""
      const matchSearch =
        !q ||
        task.title?.toLowerCase().includes(q) ||
        task.id?.toLowerCase().includes(q) ||
        task.assignee?.toLowerCase().includes(q) ||
        task.group?.toLowerCase().includes(q) ||
        task.assignedBy?.toLowerCase().includes(q) ||
        (task.collaborators && task.collaborators.some((c) => c.toLowerCase().includes(q)))

      // 2. Priority Filter
      const matchPriority =
        activePriorityFilter === "ALL" || task.priority === activePriorityFilter

      // 3. Work Group (Divisi) Filter
      const matchGroup =
        activeGroupFilter === "ALL" || task.group === activeGroupFilter

      // 4. Assignment / Collaboration Filter (Semua Tugas vs Tugas Saya / Tim & Ditugaskan oleh Saya)
      let matchAssignment = true
      if (
        activeAssignmentFilter === "MY_AND_ASSIGNED" ||
        activeAssignmentFilter === "MY_TASKS" ||
        activeAssignmentFilter === "ASSIGNED_BY_ME"
      ) {
        const u = currentUserName.toLowerCase()
        const isPIC =
          task.assignee?.toLowerCase().includes(u) ||
          task.assignee?.toLowerCase().includes("budi")
        const isCollab =
          task.collaborators &&
          task.collaborators.some(
            (c) => c.toLowerCase().includes(u) || c.toLowerCase().includes("budi")
          )
        const isAssignedByMe =
          task.assignedBy?.toLowerCase().includes("marta") ||
          task.assignedBy?.toLowerCase().includes("manager") ||
          task.assignedBy?.toLowerCase().includes("atasan") ||
          task.assignedBy?.toLowerCase().includes(u)

        if (activeAssignmentFilter === "MY_TASKS") {
          matchAssignment = isPIC || isCollab
        } else if (activeAssignmentFilter === "ASSIGNED_BY_ME") {
          matchAssignment = isAssignedByMe
        } else {
          // MY_AND_ASSIGNED: Menampilkan tugas yang dikerjakan oleh Saya/Tim DAN/ATAU Ditugaskan oleh Saya
          matchAssignment = isPIC || isCollab || isAssignedByMe
        }
      }

      return matchSearch && matchPriority && matchGroup && matchAssignment
    })
  }, [
    tasks,
    searchQuery,
    activePriorityFilter,
    activeGroupFilter,
    activeAssignmentFilter,
    currentUserName,
  ])

  return (
    <div className="relative">
      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {COLUMNS.map((col, index) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status)
          const Icon = col.icon
          const isOver = activeOverColumn === col.status

          return (
            <motion.div
              key={col.status}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={() => handleDragLeave(col.status)}
              onDrop={(e) => handleDrop(e, col.status)}
              className={cn(
                "flex flex-col rounded-xl border bg-muted/30 p-3 transition-colors min-h-[160px] md:min-h-[500px]",
                isOver && "ring-2 ring-primary bg-primary/5",
                col.color
              )}
            >
              {/* Column Header */}
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 mb-3 border font-medium text-sm",
                  col.headerBg
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{col.label}</span>
                  <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs font-bold text-muted-foreground shadow-xs">
                    {colTasks.length}
                  </span>
                </div>

                {col.status === TASK_STATUS.TODO && (
                  <button
                    onClick={openCreateModal}
                    title="Tambah Tugas Cepat"
                    className="rounded p-1 hover:bg-background/80 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Task Cards List with AnimatePresence */}
              <div className="flex flex-col gap-3 flex-1">
                <AnimatePresence mode="popLayout">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDragStart={handleDragStart}
                      onMoveTask={moveTask}
                    />
                  ))}
                </AnimatePresence>

                {colTasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground"
                  >
                    <p>Tidak ada tugas di kolom ini</p>
                    <span className="text-[10px] mt-1">
                      {searchQuery || activeGroupFilter !== "ALL" || activeAssignmentFilter !== "ALL"
                        ? "Coba sesuaikan filter pencarian atau divisi"
                        : "Tarik kartu ke sini"}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modal Detail / Buat Task */}
      <TaskDetailModal
        tasks={tasks}
        onCreateTask={createTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onAddComment={addComment}
      />
    </div>
  )
}
