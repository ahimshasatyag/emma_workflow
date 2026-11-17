import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"

import LoginPage from "@/pages/auth/LoginPage"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import KanbanPage from "@/pages/projects/KanbanPage"
import WarehousePage from "@/pages/warehouse/WarehousePage"
import AccountPage from "@/pages/account/AccountPage"
import SettingsPage from "@/pages/settings/SettingsPage"

/**
 * Konfigurasi Routing Global EMMA Workflow
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute Terproteksi dengan AppShell Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="tasks" element={<KanbanPage />} />
        <Route path="warehouse" element={<WarehousePage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback Rute Tidak Ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
