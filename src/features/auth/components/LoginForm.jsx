import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, User, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { useAuth } from "../hooks/useAuth"
import logoImg from "@/assets/logo_ekamaju_login.png"

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !password) {
      setError("Username dan password wajib diisi.")
      return
    }

    try {
      setLoading(true)
      await login({ username, password })
      navigate("/", { replace: true })
    } catch (err) {
      setError(err.message || "Login gagal. Periksa kembali username dan password Anda.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-md rounded-2xl border bg-card/90 backdrop-blur-md p-8 shadow-2xl"
    >
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="h-16 w-auto mb-4 flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border"
        >
          <img
            src={logoImg}
            alt="EMMA Workflow Logo"
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.target.style.display = "none"
            }}
          />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Masuk ke EMMA
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sistem Workflow & Manajemen Operasional Terpadu
        </p>
      </div>

      {/* Error Alert dengan AnimatePresence */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 overflow-hidden"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormItem>
          <FormLabel htmlFor="username">Username / NIK</FormLabel>
          <FormControl>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username atau NIK"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9"
                required
                disabled={loading}
              />
            </div>
          </FormControl>
        </FormItem>

        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel htmlFor="password">Kata Sandi</FormLabel>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                alert("Silakan hubungi Administrator IT untuk mereset kata sandi.")
              }}
              className="text-xs text-primary hover:underline"
            >
              Lupa sandi?
            </a>
          </div>
          <FormControl>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
                disabled={loading}
              />
            </div>
          </FormControl>
        </FormItem>

        <div className="pt-2">
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
          </motion.div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2">
          Demo akun default: <span className="font-mono font-medium text-foreground">admin</span> / <span className="font-mono font-medium text-foreground">admin123</span>
        </div>
      </form>
    </motion.div>
  )
}
