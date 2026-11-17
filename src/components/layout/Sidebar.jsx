import React, { useState, useRef, useEffect } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  KanbanSquare,
  Warehouse,
  Settings,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Monitor,
  Sliders,
  Image as ImageIcon,
  Grid,
  LogOut,
  Check,
  MoreHorizontal,
  X,
} from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useTasksQuery } from "@/features/tasks/hooks/useTasksQuery"
import { useInventory } from "@/features/warehouse/hooks/useInventory"
import { TASK_STATUS, ROLE_LABELS } from "@/config/constants"
import { useWindowSize } from "@/hooks/useWindowSize"
import { cn } from "@/lib/utils"
import logoIcon from "@/assets/logo_icon.png"

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const { user, logout } = useAuth()
  const { tasks } = useTasksQuery()
  const { inventory } = useInventory()
  const { isMobile } = useWindowSize()
  const navigate = useNavigate()
  const location = useLocation()

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("emma_theme_pref") || "light"
  })

  const popoverRef = useRef(null)

  // Hitung jumlah badge dinamis
  const activeTasksCount = tasks.filter((t) => t.status !== TASK_STATUS.DONE).length || 3
  const lowStockCount =
    inventory.filter((i) => i.status === "LOW_STOCK" || i.stock <= i.minStock).length || 6

  // Klik di luar popover untuk menutup
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProfileMenuOpen])

  // Pengaturan tema dengan circular wave transition
  const handleThemeChange = (mode, event) => {
    setThemeMode(mode)
    localStorage.setItem("emma_theme_pref", mode)

    const applyTheme = () => {
      if (mode === "dark") {
        document.documentElement.classList.add("dark")
      } else if (mode === "light") {
        document.documentElement.classList.remove("dark")
      } else if (mode === "system") {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (systemDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }

    if (typeof document !== "undefined" && document.startViewTransition) {
      const rect = event?.currentTarget?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : 120
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight - 80
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const transition = document.startViewTransition(() => {
        applyTheme()
      })

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
          { clipPath },
          {
            duration: 500,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      })
    } else {
      applyTheme()
    }
  }

  const handleLogout = async () => {
    setIsProfileMenuOpen(false)
    await logout()
    navigate("/login", { replace: true })
  }

  // Struktur navigasi utama
  const navSections = [
    {
      title: "WORKFLOW",
      items: [
        {
          name: "Dashboard",
          to: "/",
          icon: LayoutDashboard,
        },
        {
          name: "Kanban & Tugas",
          to: "/tasks",
          icon: KanbanSquare,
          badge: activeTasksCount.toString(),
        },
      ],
    },
    {
      title: "OPERASIONAL",
      items: [
        {
          name: "Gudang & WMS",
          to: "/warehouse",
          icon: Warehouse,
          badge: lowStockCount.toString(),
        },
      ],
    },
  ]

  const bottomItems = [
    { name: "Pengaturan", to: "/settings", icon: Settings },
    { name: "Bantuan", to: "/help", icon: HelpCircle },
  ]

  const userName = user?.name || user?.username || "Marta Seixas"
  const userRole = ROLE_LABELS[user?.role] || "Administrator"
  const userHandle = `@${user?.username || "wanderslowly"}`
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Floating Card Sidebar Container dengan Framer Motion */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? 252 : isCollapsed ? 74 : 252,
          x: isMobile ? (isOpen ? 0 : -300) : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 32,
        }}
        className={cn(
          "fixed top-3 bottom-3 left-3 z-50 flex flex-col bg-[#fbfbfa] dark:bg-[#18181b] border border-neutral-200/80 dark:border-neutral-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] rounded-[32px] select-none transition-colors duration-200",
          isCollapsed ? "px-2 py-3" : "p-3"
        )}
      >
        <div className="pb-2">
          {isCollapsed ? (
            /* ================= MODE COLLAPSED (Sesuai Gambar Referensi Baru) ================= */
            <div className="flex flex-col items-center gap-2.5 pt-0.5">
              {/* 1. Logo Icon di Paling Atas */}
              <motion.div
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleCollapse}
                className="h-11 w-11 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm flex items-center justify-center p-1.5 shrink-0 cursor-pointer"
                title="EMMA Workflow"
              >
                <img
                  src={logoIcon}
                  alt="EMMA Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </motion.div>

              {/* 2. Tombol Expand (PanelLeftOpen) Tepat di Bawah Logo */}
              <motion.button
                layout
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={onToggleCollapse}
                className="h-9 w-9 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 transition-colors cursor-pointer"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="h-4 w-4 stroke-[1.9]" />
              </motion.button>
            </div>
          ) : (
            /* ================= MODE EXPANDED ================= */
            <div className="flex items-center justify-between px-1.5 pt-1 min-h-[44px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm flex items-center justify-center p-1.5 shrink-0">
                  <img
                    src={logoIcon}
                    alt="EMMA Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[15px] leading-tight text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
                    EMMA
                  </span>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium truncate mt-0.5">
                    Workflow & WMS
                  </span>
                </div>
              </div>

              {/* Tombol Collapse di Kanan Saat Expanded */}
              <div className="relative group">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={onToggleCollapse}
                  className="hidden lg:flex h-8 w-8 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 items-center justify-center transition-colors cursor-pointer"
                  title="Collapse"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="flex lg:hidden rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Line Pembatas di Atas Icon Dashboard */}
        <div
          className={cn(
            "h-px bg-neutral-200/80 dark:bg-neutral-800 shrink-0",
            isCollapsed ? "w-9 mx-auto mb-2.5" : "w-full mb-3"
          )}
        />

        {/* Scrollable Navigation Area (Di Bawah Tombol Expand Saat Collapsed) */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 px-0.5 py-1">
          {navSections.map((section, secIdx) => (
            <div key={secIdx} className="space-y-1">
              {/* Section Title (Hanya tampil saat expanded) */}
              {!isCollapsed && (
                <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {section.title}
                </div>
              )}

              {/* Items: Dashboard, Kanban & Tugas, Gudang & WMS */}
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.name} className="relative group flex justify-center">
                    <NavLink
                      to={item.to}
                      onClick={() => {
                        if (isMobile) onClose()
                      }}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "relative flex items-center transition-colors duration-150",
                          isCollapsed
                            ? "justify-center h-11 w-12 rounded-2xl"
                            : "w-full justify-between px-3.5 py-2.5 rounded-2xl text-[13.5px]",
                          !isActive &&
                          "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Shared Layout Fluid Morph Indicator Pill (Warna Sesuai theme.ts primary: #9e0b0f) */}
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active-pill"
                              className="absolute inset-0 bg-[#9e0b0f] rounded-2xl shadow-sm shadow-red-950/20 z-0"
                              transition={{
                                type: "spring",
                                stiffness: 420,
                                damping: 32,
                              }}
                            />
                          )}

                          <div className="relative z-10 flex items-center gap-3 min-w-0">
                            <Icon
                              className={cn(
                                "shrink-0 transition-colors",
                                isCollapsed ? "h-5 w-5" : "h-[18px] w-[18px]",
                                isActive
                                  ? "text-white stroke-[2.2]"
                                  : "text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 stroke-[1.8]"
                              )}
                            />
                            {!isCollapsed && (
                              <span
                                className={cn(
                                  "truncate whitespace-nowrap transition-colors",
                                  isActive
                                    ? "text-white font-medium"
                                    : "text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
                                )}
                              >
                                {item.name}
                              </span>
                            )}
                          </div>

                          {/* Numeric Badge (Warna Sesuai theme.ts primaryContainer / onPrimaryContainer) */}
                          {item.badge && !isCollapsed && (
                            <span
                              className={cn(
                                "relative z-10 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-[#F4C4C5] text-[#600608] dark:bg-[#5E2129] dark:text-[#F4C4C5]"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}

                          {/* Titik indikator kecil saat collapsed */}
                          {item.badge && isCollapsed && (
                            <span
                              className={cn(
                                "absolute top-1.5 right-1.5 h-2 w-2 rounded-full z-10",
                                isActive
                                  ? "bg-white ring-2 ring-[#9e0b0f]"
                                  : "bg-[#9e0b0f] ring-2 ring-white dark:ring-[#18181b]"
                              )}
                            />
                          )}
                        </>
                      )}
                    </NavLink>

                    {/* Tooltip Mengambang di Atas Dashboard saat Collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-[60px] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold shadow-2xl pointer-events-none whitespace-nowrap z-[70] animate-in fade-in zoom-in-95">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded-full bg-[#9e0b0f] text-white text-[10px]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Bottom Standalone Menu Items (Pengaturan & Bantuan) */}
          <div className="pt-1.5 space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.name} className="relative group flex justify-center">
                  <NavLink
                    to={item.to}
                    end
                    onClick={() => {
                      if (isMobile) onClose()
                    }}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center transition-all duration-200",
                        isCollapsed
                          ? "justify-center h-11 w-12 rounded-2xl"
                          : "w-full px-3.5 py-2.5 rounded-2xl text-[13.5px]",
                        isActive
                          ? "bg-[#9e0b0f] text-white font-medium shadow-sm shadow-red-950/20"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 font-normal"
                      )
                    }
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn(
                          "shrink-0 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 stroke-[1.8]",
                          isCollapsed ? "h-5 w-5" : "h-[18px] w-[18px]"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate whitespace-nowrap">{item.name}</span>
                      )}
                    </div>
                  </NavLink>

                  {/* Tooltip saat perkecil */}
                  {isCollapsed && (
                    <div className="absolute left-[60px] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold shadow-2xl pointer-events-none whitespace-nowrap z-[70] animate-in fade-in zoom-in-95">
                      <span>{item.name}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Line Pembatas di Bawah Icon ? (Bantuan) */}
        <div
          className={cn(
            "h-px bg-neutral-200/80 dark:bg-neutral-800 shrink-0",
            isCollapsed ? "w-9 mx-auto my-2" : "w-full my-2.5"
          )}
        />

        {/* Bottom User Profile Section */}
        <div className="relative pt-0.5" ref={popoverRef}>
          {/* User Profile Capsule Trigger Card */}
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={cn(
              "rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 hover:bg-white dark:hover:bg-neutral-900 transition-all flex items-center shadow-2xs hover:shadow-xs",
              isCollapsed
                ? "h-11 w-11 mx-auto justify-center p-0"
                : "w-full justify-between p-1.5"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Circular Avatar with Active Green Dot */}
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-full bg-[#F4C4C5] text-[#600608] dark:bg-[#5E2129] dark:text-[#F4C4C5] font-semibold text-xs flex items-center justify-center">
                  {userInitials || "MS"}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
              </div>

              {/* User Names (Hanya saat expanded) */}
              {!isCollapsed && (
                <div className="flex flex-col text-left min-w-0 overflow-hidden whitespace-nowrap">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate leading-tight">
                    {userName}
                  </span>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-normal truncate mt-0.5">
                    {userHandle}
                  </span>
                </div>
              )}
            </div>

            {/* Three Dots Button (Hanya saat expanded) */}
            {!isCollapsed && (
              <div className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            )}
          </button>

          {/* Interactive Floating Popover Menu (Matches Image 2) */}
          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={cn(
                  "absolute bottom-[58px] z-[80] rounded-3xl bg-white dark:bg-[#1c1c20] border border-neutral-200/80 dark:border-neutral-800 shadow-[0_16px_50px_rgba(0,0,0,0.18)] p-2.5 space-y-1 text-xs select-none",
                  isCollapsed ? "left-[60px] w-64" : "left-0 right-0 w-full min-w-[240px]"
                )}
              >
                {/* Popover Header */}
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 truncate">
                  {userName.toUpperCase()} · {userRole.toUpperCase()}
                </div>

                {/* Theme Selector (Light, Dark, Match System) */}
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={(e) => handleThemeChange("light", e)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-xl px-3 py-2 transition-colors",
                      themeMode === "light"
                        ? "bg-neutral-100 dark:bg-neutral-800/80 font-medium text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="h-4 w-4 stroke-[1.8]" />
                      <span>Light</span>
                    </div>
                    {themeMode === "light" && <Check className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleThemeChange("dark", e)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-xl px-3 py-2 transition-colors",
                      themeMode === "dark"
                        ? "bg-neutral-100 dark:bg-neutral-800/80 font-medium text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Moon className="h-4 w-4 stroke-[1.8]" />
                      <span>Dark</span>
                    </div>
                    {themeMode === "dark" && <Check className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleThemeChange("system", e)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-xl px-3 py-2 transition-colors",
                      themeMode === "system"
                        ? "bg-neutral-100 dark:bg-neutral-800/80 font-medium text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Monitor className="h-4 w-4 stroke-[1.8]" />
                      <span>Match system</span>
                    </div>
                    {themeMode === "system" && <Check className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1.5" />

                {/* Additional Settings Items */}
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                      if (isMobile) onClose()
                      navigate("/account")
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                  >
                    <Sliders className="h-4 w-4 stroke-[1.8]" />
                    <span>Pengaturan Akun</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    <ImageIcon className="h-4 w-4 stroke-[1.8]" />
                    <span>Tampilan & Glass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4 stroke-[1.8]" />
                    <span>Pusat Bantuan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                      alert("Pintasan Tombol: \n• Dashboard: G D\n• Kanban: G K\n• Gudang WMS: G W\n• Perkecil Sidebar: [")
                    }}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Grid className="h-4 w-4 stroke-[1.8]" />
                      <span>Pintasan Tombol</span>
                    </div>
                    <span className="h-4 w-4 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-[10px] flex items-center justify-center font-mono text-neutral-500">
                      ?
                    </span>
                  </button>
                </div>

                <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1.5" />

                {/* Sign out button (Red styling) */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4 stroke-[1.8]" />
                  <span>Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  )
}
