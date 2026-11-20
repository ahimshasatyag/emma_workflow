import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { kanbanUserApi } from "../api/kanbanUserApi"
import { isSupabaseConfigured } from "@/lib/supabaseClient"

export const KANBAN_USER_QUERY_KEY = ["t_kanban", "users"]

/**
 * Hook React Query untuk mengelola data anggota public.t_kanban
 */
export function useKanbanUsers() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: KANBAN_USER_QUERY_KEY,
    queryFn: kanbanUserApi.getUsers,
    retry: false,
    staleTime: 1000 * 60, // Cache 1 menit
    refetchOnWindowFocus: false,
  })

  const createMutation = useMutation({
    mutationFn: kanbanUserApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KANBAN_USER_QUERY_KEY })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: kanbanUserApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KANBAN_USER_QUERY_KEY })
    },
  })

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    isSupabase: isSupabaseConfigured,
    createUser: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteUser: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    refetch: usersQuery.refetch,
  }
}
