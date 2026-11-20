import { useQuery } from "@tanstack/react-query"
import { karyawanApi } from "../api/karyawanApi"
import { isSupabaseConfigured } from "@/lib/supabaseClient"

export const KARYAWAN_QUERY_KEY = ["m_karyawan"]

/**
 * Hook React Query untuk memuat data karyawan dari public.m_karyawan
 */
export function useKaryawan() {
  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: KARYAWAN_QUERY_KEY,
    queryFn: karyawanApi.getKaryawan,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    refetchOnWindowFocus: false,
  })

  return {
    karyawanList: data,
    isLoading,
    isError,
    error,
    refetch,
    isSupabase: isSupabaseConfigured,
  }
}
