import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar({ onOpenSidebar }) {
  const location = useLocation()
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  )
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Pantau scroll window agar navbar mobile tetap sticky mengikuti scroll dengan efek elevasi
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Pantau perubahan class 'dark' pada <html> agar sinkron dengan sidebar
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  // Toggle mode gelap / terang dengan animasi Circular Wave / View Transition persis seperti pada video
  const toggleThemeWithTransition = (event) => {
    const nextDark = !isDark

    // Ambil koordinat klik sebagai pusat lingkaran gelombang
    const rect = event?.currentTarget?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : event?.clientX ?? window.innerWidth - 60
    const y = rect ? rect.top + rect.height / 2 : event?.clientY ?? 30
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // Cek ketersediaan Document View Transition API
    if (typeof document !== "undefined" && document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        setIsDark(nextDark)
        if (nextDark) {
          document.documentElement.classList.add("dark")
          localStorage.setItem("emma_theme_pref", "dark")
        } else {
          document.documentElement.classList.remove("dark")
          localStorage.setItem("emma_theme_pref", "light")
        }
      })

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration: 500,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      })
    } else {
      // Fallback reguler jika browser belum mendukung View Transitions API
      setIsDark(nextDark)
      if (nextDark) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("emma_theme_pref", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("emma_theme_pref", "light")
      }
    }
  }

  // Resolusi judul breadcrumb berdasarkan rute aktif
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Overview"
      case "/tasks":
        return "Kanban & Tugas"
      case "/warehouse":
        return "Gudang & WMS"
      case "/account":
        return "Pengaturan Akun"
      case "/settings":
        return "Pengaturan Sistem"
      default:
        return "Overview"
    }
  }

  const notifications = [
    {
      id: 1,
      title: "Batch QC #8812 selesai diuji",
      time: "10 menit lalu",
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      id: 2,
      title: "Stok Resin ABS menipis (<20 karung)",
      time: "1 jam lalu",
      icon: AlertTriangle,
      color: "text-amber-500",
    },
    {
      id: 3,
      title: "PO Bahan Baku baru masuk antrean",
      time: "2 jam lalu",
      icon: Clock,
      color: "text-blue-500",
    },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 sm:top-3 z-40 w-full select-none transition-all duration-200",
        "px-2.5 sm:px-6",
        isScrolled ? "py-1.5 sm:py-0" : "py-2 sm:py-0"
      )}
    >
      {/* Floating Capsule Navbar Container - Selalu mengikuti scroll di layar handphone dan desktop */}
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "relative flex h-14 items-center justify-between rounded-2xl sm:rounded-[22px]",
          "bg-white/95 dark:bg-[#191b22]/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800",
          "shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)] px-3.5 sm:px-5 transition-all duration-200",
          isScrolled && "shadow-[0_8px_28px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)]"
        )}
      >
        {/* Left Side: Mobile Menu Trigger & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex lg:hidden h-8 w-8 rounded-lg items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Breadcrumb Navigation: EMMA > PageTitle dengan Shared Layout / Fluid Transition */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-sm font-medium tracking-tight truncate">
            <span className="text-neutral-400 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer truncate">
              EMMA
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 shrink-0 stroke-[2]" />
            <div className="overflow-hidden h-6 flex items-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={location.pathname}
                  initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="font-semibold text-neutral-900 dark:text-white tracking-tight truncate inline-block"
                >
                  {getPageTitle()}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons (Search, Theme, Notification Bell) - Tanpa Button Create */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 1. Search Button with Expandable Popover / Input */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                "h-9 w-9 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 bg-neutral-100/70 dark:bg-neutral-800/60 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors shadow-2xs",
                isSearchOpen && "bg-neutral-200 dark:bg-neutral-700/90 text-neutral-900 dark:text-white border-neutral-300 dark:border-neutral-600"
              )}
              title="Cari"
            >
              <Search className="h-4 w-4 stroke-[1.9]" />
            </motion.button>

            {/* Quick Search Floating Input Bar */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1e2029] p-2 shadow-2xl"
                >
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Cari tugas, data gudang, ID..."
                      className="w-full h-8 pl-8 pr-7 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg border border-neutral-200 dark:border-neutral-700/60 focus:outline-none focus:border-primary placeholder:text-neutral-400 dark:placeholder:text-neutral-500 font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Theme Pill Button (Sesuai Video: Pill 'Light' saat Dark Mode, Pill 'Dark' saat Light Mode) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={toggleThemeWithTransition}
            className={cn(
              "h-9 px-3 rounded-xl border flex items-center gap-1.5 font-medium text-xs transition-all shadow-xs cursor-pointer select-none",
              isDark
                ? "bg-white text-neutral-900 border-neutral-200/90 hover:bg-neutral-100"
                : "bg-[#181920] text-white border-neutral-700/80 hover:bg-[#22242e]"
            )}
            title={isDark ? "Beralih ke Mode Terang (Light)" : "Beralih ke Mode Gelap (Dark)"}
          >
            {/* Spinning/Morphing Icon dengan Framer Motion */}
            <motion.div
              key={isDark ? "sun-spin" : "moon-spin"}
              initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
            >
              {isDark ? (
                <Sun className="h-4 w-4 stroke-[2.2] text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 stroke-[2.2] text-[#F4C4C5]" />
              )}
            </motion.div>

            {/* Label Teks Dinamis: Light di Dark Mode, Dark di Light Mode */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? "label-light" : "label-dark"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-xs tracking-tight"
              >
                {isDark ? "Light" : "Dark"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* 3. Notification Bell Button with Badge "3" (Sesuai Gambar & theme.ts notification: #E63946) */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "relative h-9 w-9 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 bg-neutral-100/70 dark:bg-neutral-800/60 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors shadow-2xs",
                isNotificationsOpen && "bg-neutral-200 dark:bg-neutral-700/90 text-neutral-900 dark:text-white"
              )}
              title="Notifikasi"
            >
              <Bell className="h-4 w-4 stroke-[1.9]" />

              {/* Red Pill Notification Badge with "3" (Sesuai theme.ts notification: #E63946) */}
              <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-[#E63946] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#191b22] shadow-sm">
                3
              </span>
            </motion.button>

            {/* Notification Dropdown Popover */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-[#1e2029] p-3 shadow-2xl text-xs space-y-2"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800 px-1">
                    <span className="font-semibold text-neutral-900 dark:text-white">Notifikasi Terbaru</span>
                    <span className="text-[10px] text-[#E63946] dark:text-[#F4C4C5] font-medium">3 belum dibaca</span>
                  </div>

                  <div className="space-y-1.5">
                    {notifications.map((notif) => {
                      const Icon = notif.icon
                      return (
                        <div
                          key={notif.id}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/70 transition-colors cursor-pointer"
                        >
                          <div className={cn("p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0", notif.color)}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{notif.title}</p>
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{notif.time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
