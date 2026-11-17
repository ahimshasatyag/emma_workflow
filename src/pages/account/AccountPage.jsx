import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Shield,
  KeyRound,
  Bell,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle,
  Save,
  Laptop,
  Lock,
  Camera,
  Eye,
  EyeOff,
  Sliders,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { ROLES, ROLE_LABELS } from "@/config/constants"
import { AccountSkeleton } from "./AccountSkeleton"
import { cn } from "@/lib/utils"

export default function AccountPage() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Feedback notifications
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.username || "Marta Seixas",
    username: user?.username || "wanderslowly",
    email: user?.email || "marta.seixas@ekamaju.co.id",
    phone: user?.phone || "+62 812-9876-5432",
    department: user?.department || "Operasional & Quality Control Mesinindo",
    location: user?.location || "Head Office - Pabrik Cikarang Blok B",
    bio: user?.bio || "Manajer Alur Kerja & Pengawasan WMS PT Eka Maju Mesinindo",
  })

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Notifications Preferences State
  const [preferences, setPreferences] = useState({
    emailTaskAssigned: true,
    emailLowStock: true,
    emailDailyReport: false,
    desktopNotifications: true,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!profileData.name.trim()) {
      setErrorMessage("Nama lengkap tidak boleh kosong.")
      return
    }

    updateUser({
      name: profileData.name,
      username: profileData.username,
      email: profileData.email,
      phone: profileData.phone,
      department: profileData.department,
      location: profileData.location,
      bio: profileData.bio,
    })

    setSuccessMessage("Profil akun berhasil diperbarui dan disimpan.")
    setTimeout(() => setSuccessMessage(""), 4000)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!passwordData.currentPassword) {
      setErrorMessage("Masukkan kata sandi saat ini.")
      return
    }
    if (passwordData.newPassword.length < 6) {
      setErrorMessage("Kata sandi baru minimal harus terdiri dari 6 karakter.")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi baru tidak cocok.")
      return
    }

    setSuccessMessage("Kata sandi akun Anda berhasil diperbarui.")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setTimeout(() => setSuccessMessage(""), 4000)
  }

  const userRole = ROLE_LABELS[user?.role] || "Administrator"
  const userInitials = (profileData.name || "MS")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const tabs = [
    { id: "profile", label: "Profil & Info", icon: User },
    { id: "security", label: "Keamanan & Sandi", icon: KeyRound },
    { id: "preferences", label: "Notifikasi & Sistem", icon: Bell },
  ]

  return (
    <AnimatePresence mode="wait">
      {isInitialLoading ? (
        <AccountSkeleton key="account-skeleton" />
      ) : (
        <motion.div
          key="account-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <PageHeader
            title="Pengaturan Akun & Profil"
            description="Kelola informasi profil personal, kredensial keamanan, divisi kerja, dan preferensi akun Anda"
          />

          {/* Feedback Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-sm text-emerald-700 dark:text-emerald-300 shadow-xs"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">{successMessage}</span>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2.5 rounded-xl bg-destructive/15 border border-destructive/30 p-3.5 text-sm text-destructive shadow-xs"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Profile Summary Capsule Card */}
            <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                {/* Avatar with Status Dot & Hover Change */}
                <div className="relative group cursor-pointer">
                  <div className="h-24 w-24 rounded-full bg-[#F4C4C5] text-[#600608] dark:bg-[#5E2129] dark:text-[#F4C4C5] font-bold text-2xl flex items-center justify-center ring-4 ring-background shadow-md">
                    {userInitials}
                  </div>
                  <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-card shadow-xs" />
                  <div className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-foreground leading-tight">
                    {profileData.name}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    @{profileData.username}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-container text-on-primary-container border border-primary/20">
                  <Shield className="h-3.5 w-3.5" />
                  <span>{userRole}</span>
                </div>
              </div>

              {/* Quick Details List */}
              <div className="pt-4 border-t border-border space-y-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </span>
                  <span className="font-medium text-foreground truncate max-w-[160px]">
                    {profileData.email}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> No. Telepon
                  </span>
                  <span className="font-medium text-foreground">{profileData.phone}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" /> Divisi
                  </span>
                  <span className="font-medium text-foreground truncate max-w-[160px]">
                    Operasional
                  </span>
                </div>
              </div>

              {/* Active Session Info Box */}
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Laptop className="h-4 w-4 text-primary" />
                  <span>Sesi Aktif Saat Ini</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Browser Google Chrome di Windows 11 (IP: 192.168.1.42)
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Terotentikasi & Aktif Sekarang</span>
                </div>
              </div>
            </div>

            {/* Right Column: Settings Tabs & Form Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab Navigation Pill Bar */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-border bg-card shadow-xs">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "relative flex items-center justify-center gap-2 py-2 px-3.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer select-none flex-1 sm:flex-initial",
                        isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="account-active-tab"
                          className="absolute inset-0 bg-[#9e0b0f] rounded-xl shadow-xs z-0"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <Icon className={cn("h-4 w-4 relative z-10 shrink-0", isActive && "text-white")} />
                      <span className="relative z-10 truncate">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab 1: Profile & Personal Details */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6"
                >
                  <div className="pb-3 border-b border-border">
                    <h3 className="text-base font-bold text-foreground">Informasi Profil</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Perbarui rincian nama, kontak, dan departemen operasional Anda di EMMA
                    </p>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          placeholder="Masukkan nama lengkap..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>Username</span>
                          <span className="text-[10px] text-muted-foreground font-normal">Terkunci</span>
                        </label>
                        <Input
                          value={profileData.username}
                          disabled
                          className="bg-muted/50 cursor-not-allowed opacity-80 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Alamat Email</label>
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          placeholder="nama@ekamaju.co.id"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">No. Handphone / WhatsApp</label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+62 8..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Departemen / Divisi</label>
                      <Input
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        placeholder="Contoh: Operasional & WMS"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Lokasi Kerja</label>
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="Contoh: Pabrik Cikarang Blok B"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Catatan / Keterangan Profil</label>
                      <textarea
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Tuliskan catatan peran kerja Anda..."
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          Simpan Perubahan
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Tab 2: Security & Password */}
              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6"
                >
                  <div className="pb-3 border-b border-border">
                    <h3 className="text-base font-bold text-foreground">Keamanan & Kata Sandi</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Kelola kata sandi akun dan proteksi keamanan autentikasi
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Kata Sandi Saat Ini</label>
                      <div className="relative">
                        <Input
                          type={showPassword.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Masukkan kata sandi saat ini..."
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Kata Sandi Baru</label>
                        <div className="relative">
                          <Input
                            type={showPassword.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Minimal 6 karakter..."
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Konfirmasi Kata Sandi Baru</label>
                        <div className="relative">
                          <Input
                            type={showPassword.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="Ulangi kata sandi baru..."
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 2FA Protection Card */}
                    <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-center justify-between gap-4 mt-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold text-foreground">Autentikasi Dua Faktor (2FA)</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Tambahkan lapisan keamanan ekstra menggunakan kode OTP saat login
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                        Aktif
                      </span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit">
                          <KeyRound className="h-4 w-4 mr-2" />
                          Perbarui Kata Sandi
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Tab 3: Preferences & Notifications */}
              {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6"
                >
                  <div className="pb-3 border-b border-border">
                    <h3 className="text-base font-bold text-foreground">Preferensi Notifikasi & Sistem</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Atur cara Anda menerima pembaruan tugas Kanban dan peringatan stok gudang
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
                      <div>
                        <div className="text-xs font-bold text-foreground">Notifikasi Email Tugas Kanban</div>
                        <div className="text-[11px] text-muted-foreground">
                          Kirimkan email saat tugas baru ditugaskan kepada Anda atau status bergeser
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailTaskAssigned}
                        onChange={(e) => setPreferences({ ...preferences, emailTaskAssigned: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-[#9e0b0f] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
                      <div>
                        <div className="text-xs font-bold text-foreground">Peringatan Stok Gudang Menipis</div>
                        <div className="text-[11px] text-muted-foreground">
                          Kirimkan alert ketika stok barang SKU berada di bawah ambang minimum
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailLowStock}
                        onChange={(e) => setPreferences({ ...preferences, emailLowStock: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-[#9e0b0f] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
                      <div>
                        <div className="text-xs font-bold text-foreground">Ringkasan Laporan Harian (Digest)</div>
                        <div className="text-[11px] text-muted-foreground">
                          Kirimkan rekapitulasi mutasi inbound/outbound setiap pukul 17:00 WIB
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailDailyReport}
                        onChange={(e) => setPreferences({ ...preferences, emailDailyReport: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-[#9e0b0f] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setSuccessMessage("Preferensi notifikasi berhasil disimpan.")
                        setTimeout(() => setSuccessMessage(""), 4000)
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Preferensi
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
