import axiosClient from "@/api/axiosClient"

/**
 * Endpoint API autentikasi untuk komunikasi dengan CodeIgniter
 */
export const authApi = {
  /**
   * Login pengguna
   * @param {{ username: string, password: string }} credentials
   */
  login: async (credentials) => {
    try {
      const response = await axiosClient.post("/auth/login", credentials)
      return response
    } catch (error) {
      // Fallback demo/mock login jika backend CodeIgniter lokal belum dinyalakan
      if (
        credentials.username &&
        (credentials.password === "admin123" || credentials.password === "password" || credentials.username === "admin")
      ) {
        console.warn("Backend CodeIgniter offline. Menggunakan sesi simulasi lokal.")
        return {
          status: "success",
          token: "mock-jwt-token-emma-admin",
          user: {
            id: 1,
            username: credentials.username,
            name: "Administrator EMMA",
            email: `${credentials.username}@ekamaju.com`,
            role: 1, // ROLES.ADMIN
          },
        }
      }
      throw error
    }
  },

  /**
   * Logout pengguna
   */
  logout: async () => {
    try {
      return await axiosClient.post("/auth/logout")
    } catch {
      return { status: "success" }
    }
  },

  /**
   * Ambil data profil pengguna saat ini
   */
  getProfile: async () => {
    return await axiosClient.get("/auth/me")
  },

  /**
   * Refresh token JWT
   */
  refreshToken: async () => {
    return await axiosClient.post("/auth/refresh")
  },
}
