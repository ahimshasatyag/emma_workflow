import React from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  User,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  ShieldCheck,
  Building2,
  Users,
} from "lucide-react"
import { TASK_PRIORITY, TASK_STATUS, TASK_STATUS_LABELS } from "@/config/constants"
import { formatDate } from "@/lib/formatDate"
import { useTaskStore } from "../stores/taskStore"
import { TEAM_GROUPS } from "../data/teamData"
import { cn } from "@/lib/utils"

const priorityColors = {
  [TASK_PRIORITY.URGENT]: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800",
  [TASK_PRIORITY.HIGH]: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
  [TASK_PRIORITY.MEDIUM]: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  [TASK_PRIORITY.LOW]: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-800",
}

const statusOrder = [
  TASK_STATUS.TODO,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.REVIEW,
  TASK_STATUS.DONE,
]

export function TaskCard({ task, onDragStart, onMoveTask }) {
  const { openDetailModal } = useTaskStore()

  const currentIndex = statusOrder.indexOf(task.status)
  const canMoveLeft = currentIndex > 0
  const canMoveRight = currentIndex < statusOrder.length - 1

  // Cari config grup
  const groupInfo = TEAM_GROUPS.find((g) => g.id === task.group) || {
    badge: task.group || "TIM",
    color: "bg-muted text-muted-foreground border-border",
  }

  const collaborators = task.collaborators || []
  const commentsCount = task.comments ? task.comments.length : 0

  return (
    <motion.div
      layout
      layoutId={`task-card-${task.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => openDetailModal(task.id)}
      className="group relative cursor-grab rounded-lg border bg-card p-4 shadow-xs transition-shadow hover:border-primary/50 hover:shadow-md active:cursor-grabbing"
    >
      {/* Top Header: ID & Group & Priority Badges */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            {task.id}
          </span>
          {task.group && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                groupInfo.color
              )}
            >
              {groupInfo.badge}
            </span>
          )}
        </div>

        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border",
            priorityColors[task.priority] || priorityColors[TASK_PRIORITY.LOW]
          )}
        >
          {task.priority}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 leading-snug">
        {task.title}
      </h3>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Penugasan oleh Atasan (Supervisor Attribution) */}
      {task.assignedBy && (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2">
          <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
          <span className="truncate">
            Ditugaskan oleh: <strong className="text-foreground font-medium">{task.assignedBy}</strong>
          </span>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Info: Stacked Collaborators & Due Date & Comments */}
      <div className="flex items-center justify-between pt-2.5 border-t text-xs text-muted-foreground">
        {/* Stacked Avatars for Primary Assignee + Collaborators */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {/* Primary Assignee Avatar */}
            <div
              title={`PIC: ${task.assignee || "Belum ditugaskan"}`}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold ring-2 ring-background z-10"
            >
              {task.assignee ? task.assignee.charAt(0) : "U"}
            </div>

            {/* Collaborator Avatars */}
            {collaborators.slice(0, 2).map((collab, i) => (
              <div
                key={i}
                title={`Kolaborator: ${collab}`}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground/25 text-foreground text-[9px] font-semibold ring-2 ring-background z-0"
              >
                {collab.charAt(0)}
              </div>
            ))}

            {collaborators.length > 2 && (
              <div
                title={`${collaborators.length - 2} kolaborator lainnya`}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-[9px] font-bold ring-2 ring-background"
              >
                +{collaborators.length - 2}
              </div>
            )}
          </div>

          <span className="text-[11px] truncate max-w-[85px] font-medium text-foreground">
            {task.assignee ? task.assignee.split(" ")[0] : "Belum"}
          </span>
        </div>

        {/* Due Date & Comments Counter */}
        <div className="flex items-center gap-2 text-[11px]">
          {commentsCount > 0 && (
            <div
              title={`${commentsCount} diskusi/instruksi atasan`}
              className="flex items-center gap-0.5 text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded"
            >
              <MessageSquare className="h-3 w-3" />
              <span>{commentsCount}</span>
            </div>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Move Action Bar (Selalu terlihat di Handphone/Touchscreen, muncul saat hover di Desktop) */}
      <div
        className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Quick Status Dropdown (Paling praktis di layar HP untuk pindah status langsung) */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] text-muted-foreground font-medium shrink-0">Pindah:</span>
          <select
            value={task.status}
            onChange={(e) => {
              e.stopPropagation()
              onMoveTask({ id: task.id, newStatus: e.target.value })
            }}
            className="h-7 text-xs font-semibold rounded-md border border-input bg-muted/70 hover:bg-muted text-foreground px-1.5 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary truncate"
          >
            <option value={TASK_STATUS.TODO}>To Do</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.REVIEW}>Review</option>
            <option value={TASK_STATUS.DONE}>Done</option>
          </select>
        </div>

        {/* Stepper Buttons (Tombol panah mundur / maju fase kerja) */}
        <div className="flex items-center gap-1 shrink-0">
          {canMoveLeft && (
            <button
              type="button"
              title={`Mundur ke ${TASK_STATUS_LABELS[statusOrder[currentIndex - 1]]}`}
              onClick={(e) => {
                e.stopPropagation()
                onMoveTask({ id: task.id, newStatus: statusOrder[currentIndex - 1] })
              }}
              className="h-7 w-7 rounded-md border border-input bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors shadow-2xs active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {canMoveRight && (
            <button
              type="button"
              title={`Maju ke ${TASK_STATUS_LABELS[statusOrder[currentIndex + 1]]}`}
              onClick={(e) => {
                e.stopPropagation()
                onMoveTask({ id: task.id, newStatus: statusOrder[currentIndex + 1] })
              }}
              className="h-7 px-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 flex items-center gap-1 text-[11px] font-semibold transition-colors shadow-2xs active:scale-95"
            >
              <span>{TASK_STATUS_LABELS[statusOrder[currentIndex + 1]]}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
