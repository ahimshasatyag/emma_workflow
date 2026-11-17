import React, { createContext, useContext, useState, useEffect } from "react"
import { STORAGE_KEYS, ROLES } from "@/config/constants"
import { authApi } from "../api/authApi"
import { isTokenExpired } from "../utils/tokenDecoder"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Validasi token saat inisialisasi aplikasi
    const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (savedToken && isTokenExpired(savedToken)) {
      logout()
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    const data = await authApi.login(credentials)
    const authToken = data.token || data.access_token || data.data?.token
    const userData = data.user || data.data?.user || {
      username: credentials.username,
      name: credentials.username,
      role: ROLES.ADMIN,
    }

    if (authToken) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken)
      setToken(authToken)
    }
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
      setUser(userData)
    }

    return { token: authToken, user: userData }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      setToken(null)
      setUser(null)
    }
  }

  const updateUser = (newUserData) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...newUserData }
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated))
      return updated
    })
  }

  const hasRole = (role) => {
    if (!user) return false
    return user.role === role
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    updateUser,
    hasRole,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider")
  }
  return context
}
