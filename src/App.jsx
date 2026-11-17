import React from "react"
import { BrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/api/queryClient"
import { AuthProvider } from "@/features/auth/hooks/useAuth"
import { AppRouter } from "@/router"

  /**
   * Root Component EMMA Workflow dengan Provider Wrapper
   */
  export default function App() {
    return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
    )
  }
