import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { warehouseApi } from "../api/warehouseApi"

export function useInventory() {
  const queryClient = useQueryClient()

  const inventoryQuery = useQuery({
    queryKey: ["warehouse", "inventory"],
    queryFn: warehouseApi.getInventory,
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
