import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trash2,
  CheckCircle2,
  Calendar,
  User,
  Tag,
  Clock,
  Users,
  Building2,
  MessageSquare,
  Send,
  UserCheck,
  Info,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { TASK_STATUS, TASK_PRIORITY } from "@/config/constants"
import { useTaskStore } from "../stores/taskStore"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useDivisions } from "../hooks/useDivisions"
import { useKaryawan } from "../hooks/useKaryawan"
import { kanbanItemApi } from "../api/kanbanItemApi"
import { cn } from "@/lib/utils"

export function TaskDetailModal({
  tasks = [],
  onUpdateTask,
  onCreateTask,
  onDeleteTask,
  onAddComment,
}) {
  const { user } = useAuth()
  const {
    selectedTaskId,
    isDetailModalOpen,
    isCreateModalOpen,
    closeDetailModal,
    closeCreateModal,
  } = useTaskStore()

  const { karyawanList = [] } = useKaryawan()
  const { divisions = [] } = useDivisions()

  const isCreating = isCreateModalOpen
  const isOpen = isDetailModalOpen || isCreateModalOpen

  const currentTask = tasks.find((t) => t.id === selectedTaskId)

  const [activeTab, setActiveTab] = useState("detail") // 'detail' | 'collaboration'
  const [commentText, setCommentText] = useState("")

  const supervisorName = user?.name ? `${user.name} (Atasan)` : "Atasan"
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    group: "",
    assignee: "",
    assignedBy: supervisorName,
    collaborators: [],
    collaboratorIds: [],
    startDate: today,
    endDate: today,
    dueDate: today,
    tags: "",
  })

  useEffect(() => {
    if (isCreating) {
      setFormData({
        title: "",
        description: "",
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        group: "",
        assignee: "",
        assignedBy: supervisorName,
        collaborators: [],
        collaboratorIds: [],
        startDate: today,
        endDate: today,
        dueDate: today,
        tags: "",
      })
      setActiveTab("detail")
      setCommentText("")
    } else if (currentTask) {
      const taskStart = currentTask.startDate || currentTask.dueDate || today
      const taskEnd = currentTask.endDate || currentTask.dueDate || today

      let collabs = currentTask.collaborators || []
      let collabIds = currentTask.collaboratorIds || []

      if (collabs.length > 0 && collabIds.length === 0 && karyawanList.length > 0) {
        collabIds = collabs
          .map((name) => karyawanList.find((k) => k.nm_karyawan === name)?.id_karyawan)
          .filter(Boolean)
      } else if (collabIds.length > 0 && collabs.length === 0 && karyawanList.length > 0) {
        collabs = collabIds
          .map((id) => karyawanList.find((k) => Number(k.id_karyawan) === Number(id))?.nm_karyawan)
          .filter(Boolean)
      }

      setFormData({
        title: currentTask.title || "",
        description: currentTask.description || "",
        status: currentTask.status || TASK_STATUS.TODO,
        priority: currentTask.priority || TASK_PRIORITY.MEDIUM,
        group: currentTask.group || "",
        assignee: currentTask.assignee || "",
        assignedBy: currentTask.assignedBy || supervisorName,
        collaborators: collabs,
        collaboratorIds: collabIds,
        startDate: taskStart,
        endDate: taskEnd,
        dueDate: taskEnd,
        tags: currentTask.tags ? currentTask.tags.join(", ") : "",
      })
      setCommentText("")
    }
  }, [currentTask, isCreating, isOpen, supervisorName, today, karyawanList])

  // Sinkronisasi data anggota kolaborasi langsung dari public.t_kanban_item di Supabase
  useEffect(() => {
    let isMounted = true

    async function fetchSavedItems() {
      if (!currentTask || isCreating) return
      const numericId =
        currentTask.kanbanId ||
        Number(String(currentTask.id).replace(/\D/g, ""))

      if (!numericId) return

      try {
        const items = await kanbanItemApi.getItemsByKanbanId(numericId)
        if (!isMounted || !Array.isArray(items) || items.length === 0) return

        const loadedIds = items.map((it) => Number(it.id_karyawan)).filter(Boolean)
        const loadedNames = loadedIds
          .map((id) => karyawanList.find((k) => Number(k.id_karyawan) === id)?.nm_karyawan)
          .filter(Boolean)

        setFormData((prev) => ({
          ...prev,
          collaboratorIds: loadedIds,
          collaborators: loadedNames.length > 0 ? loadedNames : prev.collaborators,
        }))
      } catch (err) {
        console.warn("Gagal mengambil data dari t_kanban_item:", err)
      }
    }

    if (isOpen && !isCreating && currentTask) {
      fetchSavedItems()
    }

    return () => {
      isMounted = false
    }
  }, [currentTask, isCreating, isOpen, karyawanList])

  const handleClose = () => {
    if (isCreating) closeCreateModal()
    else closeDetailModal()
  }

  const toggleCollaborator = (nameOrId) => {
    setFormData((prev) => {
      const karyawan = karyawanList.find(
        (k) =>
          Number(k.id_karyawan) === Number(nameOrId) ||
          k.nm_karyawan === nameOrId
      )
      const targetName = karyawan?.nm_karyawan || String(nameOrId)
      const targetId = karyawan ? Number(karyawan.id_karyawan) : Number(nameOrId)

      const exists =
        prev.collaborators.includes(targetName) ||
        (targetId && prev.collaboratorIds.includes(targetId))

      if (exists) {
        return {
          ...prev,
          collaborators: prev.collaborators.filter((c) => c !== targetName),
          collaboratorIds: prev.collaboratorIds.filter((id) => Number(id) !== targetId),
        }
      } else {
        return {
          ...prev,
          collaborators: [...prev.collaborators, targetName],
          collaboratorIds: targetId ? [...prev.collaboratorIds, targetId] : prev.collaboratorIds,
        }
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const tagsArray = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : []

    if (isCreating) {
      onCreateTask?.({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        group: formData.group,
        divisionId: selectedDivision?.id_karyawan_divisi || null,
        assignee: formData.assignee,
        assignedBy: formData.assignedBy,
        collaborators: formData.collaborators,
        collaboratorIds: formData.collaboratorIds,
        startDate: formData.startDate,
        endDate: formData.endDate,
        dueDate: formData.endDate || formData.startDate,
        tags: tagsArray,
        comments: [
          {
            id: `C-${Date.now()}`,
            author: user?.name || "Atasan",
            role: "Atasan / Manager",
            avatar: user?.name
              ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
              : "AT",
            text: `Tugas ditugaskan kepada anggota tim. Harap segera dikerjakan sesuai SOP.`,
            createdAt: "Baru saja",
            isSupervisor: true,
          },
        ],
      })
      closeCreateModal()
    } else if (currentTask) {
      onUpdateTask?.({
        id: currentTask.id,
        kanbanId: currentTask.kanbanId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        group: formData.group,
        divisionId: selectedDivision?.id_karyawan_divisi || null,
        assignee: formData.assignee,
        assignedBy: formData.assignedBy,
        collaborators: formData.collaborators,
        collaboratorIds: formData.collaboratorIds,
        startDate: formData.startDate,
        endDate: formData.endDate,
        dueDate: formData.endDate || formData.startDate,
        tags: tagsArray,
      })
      closeDetailModal()
    }
  }

  const handleSendComment = (e) => {
    e.preventDefault()
    if (!commentText.trim() || !currentTask) return

    onAddComment?.({
      id: currentTask.id,
      comment: {
        author: user?.name || "Atasan",
        role: "Atasan / Supervisor",
        avatar: user?.name
          ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
          : "AT",
        text: commentText.trim(),
        isSupervisor: true,
      },
    })
    setCommentText("")
  }

  const handleDelete = () => {
    if (currentTask && confirm(`Apakah Anda yakin ingin menghapus tugas ${currentTask.id}?`)) {
      onDeleteTask?.(currentTask.id)
      closeDetailModal()
    }
  }

  // Cari objek divisi yang dipilih berdasarkan formData.group (nama divisi atau ID)
  const selectedDivision = useMemo(() => {
    if (!formData.group) return null
    return (
      divisions.find(
        (d) =>
          d.nm_karyawan_divisi?.toLowerCase() === formData.group?.toLowerCase() ||
          String(d.id_karyawan_divisi) === String(formData.group)
      ) || null
    )
  }, [divisions, formData.group])

  // Filter daftar karyawan berdasarkan id_karyawan_divisi yang sesuai dengan divisi terpilih
  const filteredKaryawan = useMemo(() => {
    if (!formData.group) return []
    if (!selectedDivision) {
      // Fallback jika nama divisi belum terdaftar di tabel m_karyawan_divisi
      return karyawanList
    }
    return karyawanList.filter(
      (k) => Number(k.id_karyawan_divisi) === Number(selectedDivision.id_karyawan_divisi)
    )
  }, [karyawanList, selectedDivision, formData.group])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        layoutId={!isCreating && selectedTaskId ? `task-card-${selectedTaskId}` : undefined}
        className="sm:max-w-[620px] max-h-[92vh] flex flex-col p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-3 border-b bg-muted/20">
          <div className="flex items-center justify-between pr-8 mb-1">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {isCreating ? "TUGAS BARU" : currentTask?.id}
            </span>

            {/* Division Badge */}
            {formData.group && (
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                Divisi: {formData.group}
              </span>
            )}
          </div>
          <DialogTitle className="text-xl">
            {isCreating ? "Tambah Tugas Baru" : "Detail & Kolaborasi Tugas"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isCreating
              ? "Kelola tugas baru, pilih divisi kerja, dan tambahkan anggota kolaborasi tim."
              : "Pantau progres tugas dan lakukan diskusi kerja tim."}
          </DialogDescription>

          {/* Modal Tab Navigation (Detail Form vs Diskusi/Instruksi Tim) */}
          {!isCreating && currentTask && (
            <div className="flex items-center gap-2 mt-4 border-b border-border/50">
              <button
                type="button"
                onClick={() => setActiveTab("detail")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5",
                  activeTab === "detail"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <UserCheck className="h-3.5 w-3.5" />
                Detail & Penugasan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("collaboration")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5 relative",
                  activeTab === "collaboration"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Diskusi & Instruksi Atasan
                {currentTask.comments && currentTask.comments.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-primary text-primary-foreground font-bold">
                    {currentTask.comments.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === "detail" ? (
            <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Judul Tugas */}
              <FormItem>
                <FormLabel className="text-xs font-semibold">Judul Tugas</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="Contoh: Audit stok pallet gudang utama Blok B"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </FormControl>
              </FormItem>

              {/* Grup Divisi */}
              <FormItem>
                <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Divisi / Grup Kerja
                </FormLabel>
                <FormControl>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  >
                    <option value="">-- Pilih Divisi --</option>
                    {divisions.length > 0 &&
                      divisions.map((grp) => (
                        <option key={grp.id_karyawan_divisi} value={grp.nm_karyawan_divisi || ""}>
                          {grp.nm_karyawan_divisi || `Divisi #${grp.id_karyawan_divisi}`}
                        </option>
                      ))}
                    {formData.group &&
                      !divisions.some((d) => d.nm_karyawan_divisi === formData.group) && (
                        <option value={formData.group}>{formData.group}</option>
                      )}
                  </select>
                </FormControl>
              </FormItem>

              {/* Anggota Kolaborasi Tim dari public.m_karyawan (difilter berdasarkan id_karyawan_divisi) */}
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Anggota Kolaborasi Tim
                  </FormLabel>
                  {formData.collaborators.length > 0 && (
                    <span className="text-[11px] font-semibold text-primary">
                      {formData.collaborators.length} dipilih
                    </span>
                  )}
                </div>
                <FormControl>
                  <select
                    className={cn(
                      "w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      !formData.group && "opacity-75 cursor-not-allowed bg-muted/40"
                    )}
                    value=""
                    disabled={!formData.group}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value)
                      if (!selectedId) return
                      const karyawan = karyawanList.find((k) => Number(k.id_karyawan) === selectedId)
                      if (!karyawan) return

                      setFormData((prev) => {
                        const alreadySelected =
                          prev.collaboratorIds.includes(selectedId) ||
                          prev.collaborators.includes(karyawan.nm_karyawan)

                        if (alreadySelected) return prev

                        return {
                          ...prev,
                          collaboratorIds: [...prev.collaboratorIds, selectedId],
                          collaborators: [...prev.collaborators, karyawan.nm_karyawan],
                        }
                      })
                    }}
                  >
                    {!formData.group ? (
                      <option value="">-- Pilih Divisi terlebih dahulu --</option>
                    ) : filteredKaryawan.length === 0 ? (
                      <option value="">-- Tidak ada anggota aktif pada divisi ini --</option>
                    ) : (
                      <option value="">
                        -- Tambah Anggota --
                      </option>
                    )}
                    {filteredKaryawan.map((k) => {
                      const isSelected =
                        formData.collaboratorIds.includes(Number(k.id_karyawan)) ||
                        formData.collaborators.includes(k.nm_karyawan)
                      return (
                        <option
                          key={k.id_karyawan}
                          value={k.id_karyawan}
                          disabled={isSelected}
                        >
                          {k.nm_karyawan} {isSelected ? "✓ (Sudah dipilih)" : ""}
                        </option>
                      )
                    })}
                  </select>
                </FormControl>

                {/* Badges Anggota Kolaborasi Terpilih */}
                {formData.collaborators.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {formData.collaborators.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20 font-medium"
                      >
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => toggleCollaborator(name)}
                          className="hover:text-destructive text-primary/70 hover:bg-destructive/10 rounded px-1 transition-colors cursor-pointer text-sm font-bold leading-none"
                          title={`Hapus ${name}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </FormItem>

              {/* Status Kolom & Prioritas */}
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Status Kolom</FormLabel>
                  <FormControl>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value={TASK_STATUS.TODO}>To Do</option>
                      <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                      <option value={TASK_STATUS.REVIEW}>Review</option>
                      <option value={TASK_STATUS.DONE}>Done</option>
                    </select>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-xs font-semibold">Prioritas</FormLabel>
                  <FormControl>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value={TASK_PRIORITY.LOW}>Low</option>
                      <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                      <option value={TASK_PRIORITY.HIGH}>High</option>
                      <option value={TASK_PRIORITY.URGENT}>Urgent</option>
                    </select>
                  </FormControl>
                </FormItem>
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Start Date (Tanggal Mulai)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        const newStart = e.target.value
                        setFormData((prev) => ({
                          ...prev,
                          startDate: newStart,
                          endDate: prev.endDate && prev.endDate < newStart ? newStart : prev.endDate,
                          dueDate: prev.endDate && prev.endDate < newStart ? newStart : prev.endDate,
                        }))
                      }}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    End Date (Tanggal Selesai)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={formData.endDate}
                      min={formData.startDate}
                      onChange={(e) => {
                        const newEnd = e.target.value
                        setFormData((prev) => ({
                          ...prev,
                          endDate: newEnd,
                          dueDate: newEnd,
                        }))
                      }}
                    />
                  </FormControl>
                </FormItem>
              </div>

              {/* Deskripsi / Instruksi Kerja */}
              <FormItem>
                <FormLabel className="text-xs font-semibold">Deskripsi & Instruksi Kerja</FormLabel>
                <FormControl>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Tulis instruksi langkah kerja, parameter teknis, atau target penyelesaian..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </FormControl>
              </FormItem>
            </form>
          ) : (
            /* TAB KOLABORASI & DISKUSI INSTRUKSI ATASAN */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b">
                <span className="flex items-center gap-1.5 font-medium">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Alur Komunikasi Kolaborasi
                </span>
                {currentTask?.collaborators && currentTask.collaborators.length > 0 && (
                  <span className="truncate max-w-[200px]">
                    Tim: {currentTask.collaborators.join(", ")}
                  </span>
                )}
              </div>

              {/* Daftar Pesan/Komentar */}
              <div className="space-y-3 min-h-[220px] max-h-[340px] overflow-y-auto pr-1">
                {currentTask?.comments && currentTask.comments.length > 0 ? (
                  currentTask.comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-lg p-3 text-xs border transition-colors",
                        comment.isSupervisor
                          ? "bg-primary/5 border-primary/20"
                          : "bg-muted/40 border-border"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px]",
                              comment.isSupervisor
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted-foreground/20 text-foreground"
                            )}
                          >
                            {comment.avatar || comment.author?.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground mr-1.5">
                              {comment.author}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              ({comment.role || "Anggota Tim"})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {comment.isSupervisor && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase">
                              Instruksi Atasan
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {comment.createdAt}
                          </span>
                        </div>
                      </div>
                      <p className="text-foreground pl-8 leading-relaxed whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="font-medium">Belum ada diskusi atau instruksi atasan.</p>
                    <span className="text-[11px] mt-0.5">
                      Kirimkan instruksi kerja atau update progres di bawah ini.
                    </span>
                  </div>
                )}
              </div>

              {/* Input Kirim Komentar / Instruksi */}
              <form onSubmit={handleSendComment} className="pt-2 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ketik instruksi kerja atasan atau tanggapan bawahan..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="text-xs"
                  />
                  <Button type="submit" size="sm" disabled={!commentText.trim()}>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Kirim
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Terkirim atas nama:{" "}
                  <strong className="text-foreground">{user?.name || "Atasan"}</strong> (Atasan /
                  Supervisor)
                </p>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t bg-muted/20 flex items-center justify-between">
          {!isCreating && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Hapus Tugas
            </Button>
          )}

          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Batal
            </Button>
            {activeTab === "detail" && (
              <Button type="submit" form="task-form" size="sm">
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                {isCreating ? "Delegasikan Tugas" : "Simpan Perubahan"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
