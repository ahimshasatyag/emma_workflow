import React from "react"
import { motion } from "framer-motion"
import logoImg from "@/assets/logo_ekamaju_login.png"

/**
 * Komponen Loading Screen custom dengan pesan "Selamat Datang" bertenaga Framer Motion
 */
export function LoadingScreen({
  message = "Memuat data aplikasi...",
  title = "Selamat Datang di EMMA Workflow",
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center max-w-sm text-center px-4"
      >
        <div className="relative mb-6">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(59, 130, 246, 0.2)",
                "0 0 0 16px rgba(59, 130, 246, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center p-3 ring-4 ring-primary/20 shadow-xl"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              src={logoImg}
              alt="EMMA Workflow Logo"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
          </motion.div>

          {/* Glowing Ring Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-2xl border-2 border-primary border-t-transparent pointer-events-none"
          />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-xl font-bold tracking-tight text-foreground mb-2"
        >
          {title}
        </motion.h2>

        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm text-muted-foreground"
        >
          {message}
        </motion.p>

        {/* Staggered Pulsing Dots */}
        <div className="mt-8 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
