import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { warehouseApi } from "../api/warehouseApi"

export function useInventory() {
  const queryClient = useQueryClient()

  const inventoryQuery = useQuery({
    queryKey: ["warehouse", "inventory"],
    queryFn: warehouseApi.getInventory,
    retry: false, // Hindari retry berulang yang memperlambat render
    staleTime: 1000 * 30, // Cache 30 detik
    refetchOnWindowFocus: false,
  })

  const movementMutation = useMutation({
    mutationFn: warehouseApi.recordMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse", "inventory"] })
    },
  })

  return {
    inventory: inventoryQuery.data || [],
    isLoading: inventoryQuery.isLoading,
    isError: inventoryQuery.isError,
    recordMovement: movementMutation.mutateAsync,
    isSubmitting: movementMutation.isPending,
  }
}
