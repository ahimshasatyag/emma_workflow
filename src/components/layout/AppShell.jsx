import React, { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"
import { useWindowSize } from "@/hooks/useWindowSize"

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isMobile } = useWindowSize()
  const location = useLocation()

  return (
    <LayoutGroup id="emma-view-transition">
      {/* Container utama dengan overflowX: clip agar tidak memotong position: sticky navbar pada mobile */}
      <div
        className="relative min-h-screen bg-background text-foreground flex antialiased"
        style={{ overflowX: "clip" }}
      >
        {/* Floating Modern Sorvo-Style Sidebar (z-50 di atas Dashboard) */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Body Area: Animasi PaddingLeft Tersinkronisasi Penuh dengan Framer Motion */}
        <motion.div
          initial={false}
          animate={{
            paddingLeft: isMobile ? 0 : isCollapsed ? 96 : 272,
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 32,
          }}
          className="flex-1 flex flex-col min-w-0"
        >
          {/* Floating Capsule Navbar (Sticky di mobile dan desktop) */}
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

          {/* Content Outlet with Native-like Fluid View Transition */}
          <div className="flex-1 p-3 sm:p-6 lg:p-7 max-w-7xl w-full">
            <AnimatePresence mode="wait" initial={false}>
              <motion.main
                key={location.pathname}
                initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.main>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </LayoutGroup>
  )
}
