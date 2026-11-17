import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Filter, Building2, ChevronDown } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BoardView } from "@/features/tasks/components/BoardView"
import { useTaskStore } from "@/features/tasks/stores/taskStore"
import { useTasksQuery } from "@/features/tasks/hooks/useTasksQuery"
import { TEAM_GROUPS } from "@/features/tasks/data/teamData"
import { KanbanSkeleton } from "./KanbanSkeleton"
import { TASK_PRIORITY } from "@/config/constants"
import { cn } from "@/lib/utils"

export default function KanbanPage() {
  const {
    openCreateModal,
    searchQuery,
    setSearchQuery,
    activePriorityFilter,
    setActivePriorityFilter,
    activeGroupFilter,
    setActiveGroupFilter,
  } = useTaskStore()

  const { isLoading: tasksLoading } = useTasksQuery()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const isLoading = isInitialLoading || tasksLoading

  const priorityOptions = [
    { label: "Semua", value: "ALL" },
    { label: "Urgent", value: TASK_PRIORITY.URGENT },
    { label: "High", value: TASK_PRIORITY.HIGH },
    { label: "Medium", value: TASK_PRIORITY.MEDIUM },
    { label: "Low", value: TASK_PRIORITY.LOW },
  ]

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <KanbanSkeleton key="kanban-skeleton" />
      ) : (
        <motion.div
          key="kanban-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          <PageHeader
            title="Manajemen Alur Kerja & Kolaborasi Kanban"
            description="Delegasikan tugas atasan ke bawahan, kolaborasi lintas divisi, dan pantau progres kerja real-time"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={openCreateModal}>
                <Plus className="h-4 w-4 mr-2" />
                Delegasikan Tugas Baru
              </Button>
            </motion.div>
          </PageHeader>

          {/* Filter Toolbar: Search, Dropdown Divisi, & Filter Prioritas */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-card p-3.5 rounded-xl border shadow-xs"
          >
            {/* Left: Search Bar & Dropdown Pilihan Divisi */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari tugas, PIC, divisi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-9"
                />
              </div>

              {/* Dropdown Filter Divisi */}
              <div className="relative min-w-[210px]">
                <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <select
                  value={activeGroupFilter}
                  onChange={(e) => setActiveGroupFilter(e.target.value)}
                  className={cn(
                    "w-full h-9 pl-8 pr-8 text-xs rounded-lg border appearance-none transition-colors cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    activeGroupFilter !== "ALL"
                      ? "bg-primary/10 border-primary text-primary font-semibold"
                      : "bg-background border-input text-foreground hover:bg-muted/50"
                  )}
                >
                  {TEAM_GROUPS.map((grp) => (
                    <option key={grp.id} value={grp.id}>
                      {grp.id === "ALL" ? "Semua Divisi" : `Divisi: ${grp.name} (${grp.badge})`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Right: Filter Prioritas Pills */}
            <div className="flex items-center gap-1.5 flex-wrap self-start lg:self-auto">
              <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Prioritas:
              </span>
              {priorityOptions.map((opt) => {
                const isActive = activePriorityFilter === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setActivePriorityFilter(opt.value)}
                    className="relative px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer select-none"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="kanban-filter-active-pill"
                        className="absolute inset-0 bg-primary rounded-md shadow-xs z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10 transition-colors",
                        isActive
                          ? "text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Main Board View */}
          <BoardView />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
