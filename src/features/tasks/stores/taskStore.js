import { create } from "zustand"
import { TASK_STATUS } from "@/config/constants"

/**
 * Zustand Store untuk State Manajemen Lokal Kanban Task
 */
export const useTaskStore = create((set) => ({
  selectedTaskId: null,
  isDetailModalOpen: false,
  isCreateModalOpen: false,
  searchQuery: "",
  activePriorityFilter: "ALL",
  activeGroupFilter: "ALL",
  activeAssignmentFilter: "ALL",
  draggedTaskId: null,

  setSelectedTaskId: (id) => set({ selectedTaskId: id, isDetailModalOpen: !!id }),
  openDetailModal: (id) => set({ selectedTaskId: id, isDetailModalOpen: true }),
  closeDetailModal: () => set({ selectedTaskId: null, isDetailModalOpen: false }),

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActivePriorityFilter: (priority) => set({ activePriorityFilter: priority }),
  setActiveGroupFilter: (group) => set({ activeGroupFilter: group }),
  setActiveAssignmentFilter: (filter) => set({ activeAssignmentFilter: filter }),

  setDraggedTaskId: (id) => set({ draggedTaskId: id }),
}))
