import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { taskApi } from "../api/taskApi"

export const TASK_QUERY_KEYS = {
  all: ["tasks"],
  list: (filters) => ["tasks", "list", filters],
  detail: (id) => ["tasks", "detail", id],
}

/**
 * Hook React Query untuk mengelola data tugas dan mutasi kanban
 */
export function useTasksQuery(filters = {}) {
  const queryClient = useQueryClient()

  // Query Mengambil Data Tasks
  const tasksQuery = useQuery({
    queryKey: TASK_QUERY_KEYS.list(filters),
    queryFn: () => taskApi.getTasks(filters),
  })

  // Mutasi Pindah Kolom (Move Task / Drag & Drop) dengan Optimistic Update
  const moveTaskMutation = useMutation({
    mutationFn: ({ id, newStatus }) => taskApi.moveTask(id, newStatus),
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.list(filters) })
      const previousTasks = queryClient.getQueryData(TASK_QUERY_KEYS.list(filters))

      queryClient.setQueryData(TASK_QUERY_KEYS.list(filters), (old = []) =>
        old.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
      )

      return { previousTasks }
    },
    onError: (err, newStatus, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASK_QUERY_KEYS.list(filters), context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all })
    },
  })

  // Mutasi Buat Task Baru
  const createTaskMutation = useMutation({
    mutationFn: (newTask) => taskApi.createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all })
    },
  })

  // Mutasi Update Task
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, ...data }) => taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all })
    },
  })

  // Mutasi Hapus Task
  const deleteTaskMutation = useMutation({
    mutationFn: (id) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all })
    },
  })

  // Mutasi Tambah Komentar Kolaborasi
  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => taskApi.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all })
    },
  })

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
    moveTask: moveTaskMutation.mutate,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    addComment: addCommentMutation.mutate,
  }
}
