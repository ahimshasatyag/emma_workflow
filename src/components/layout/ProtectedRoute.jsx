import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { LoadingScreen } from "@/components/shared/LoadingScreen"

/**
 * Route Guard untuk memvalidasi otentikasi dan level role pengguna
 */
export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen message="Memverifikasi izin akses..." />
  }

  if (!isAuthenticated) {
    // Arahkan ke login dengan menyimpan URL tujuan awal
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-xl font-bold text-destructive mb-2">Akses Ditolak</h2>
        <p className="text-sm text-muted-foreground">
          Akun Anda tidak memiliki izin yang cukup untuk mengakses halaman ini.
        </p>
      </div>
    )
  }

  return children
}
