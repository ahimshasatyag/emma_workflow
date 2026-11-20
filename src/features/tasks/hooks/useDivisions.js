import { useQuery } from "@tanstack/react-query"
import { divisionApi } from "../api/divisionApi"
import { isSupabaseConfigured } from "@/lib/supabaseClient"

export const DIVISION_QUERY_KEY = ["m_karyawan_divisi"]

/**
 * Hook React Query untuk memuat data divisi dari public.m_karyawan_divisi
 */
export function useDivisions() {
  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: DIVISION_QUERY_KEY,
    queryFn: divisionApi.getDivisions,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    refetchOnWindowFocus: false,
  })

  return {
    divisions: data,
    isLoading,
    isError,
    error,
    refetch,
    isSupabase: isSupabaseConfigured,
  }
}
