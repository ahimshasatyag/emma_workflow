import axios from "axios"
import { env } from "@/config/env"
import { STORAGE_KEYS } from "@/config/constants"

/**
 * Global Axios Client dengan Interceptor JWT dan kompatibilitas CodeIgniter
 */
const axiosClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest", // Wajib untuk deteksi request AJAX di CodeIgniter
  },
})

// Request Interceptor: Sisipkan JWT Token jika tersedia
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Tangani respon dan token kedaluwarsa (401)
axiosClient.interceptors.response.use(
  (response) => {
    // Mengembalikan langsung payload data jika API CodeIgniter membungkusnya
    return response.data
  },
  (error) => {
    const status = error.response ? error.response.status : null

    if (status === 401) {
      // Hapus token lokal jika sesi habis
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)

      // Redirect otomatis ke halaman login jika bukan sedang di /login
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login?expired=1"
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Terjadi kesalahan pada server"

    return Promise.reject(new Error(message))
  }
)

export default axiosClient
