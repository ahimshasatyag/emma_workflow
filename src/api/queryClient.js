import { QueryClient } from "@tanstack/react-query"

/**
 * Konfigurasi React Query Client terpusat
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 menit data dianggap segar
      gcTime: 1000 * 60 * 15, // 15 menit cache disimpan di memori
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
