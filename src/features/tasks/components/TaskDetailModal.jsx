import React, { useState, useEffect } from "react"
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
  ShieldCheck,
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
import { TEAM_GROUPS, TEAM_MEMBERS } from "../data/teamData"
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

  const isCreating = isCreateModalOpen
  const isOpen = isDetailModalOpen || isCreateModalOpen

  const currentTask = tasks.find((t) => t.id === selectedTaskId)

  const [activeTab, setActiveTab] = useState("detail") // 'detail' | 'collaboration'
  const [commentText, setCommentText] = useState("")

  const supervisorName = user?.name ? `${user.name} (Manager/Atasan)` : "Marta Seixas (Manager)"

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    group: "WAREHOUSE",
    assignee: "Budi Santoso",
    assignedBy: supervisorName,
    collaborators: [],
    dueDate: "",
    tags: "",
  })

  useEffect(() => {
    if (isCreating) {
      setFormData({
        title: "",
        description: "",
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        group: "WAREHOUSE",
        assignee: "Budi Santoso",
        assignedBy: supervisorName,
        collaborators: ["Siti Rahma"],
        dueDate: new Date().toISOString().split("T")[0],
        tags: "Operasional, WMS",
      })
      setActiveTab("detail")
      setCommentText("")
    } else if (currentTask) {
      setFormData({
        title: currentTask.title || "",
        description: currentTask.description || "",
        status: currentTask.status || TASK_STATUS.TODO,
        priority: currentTask.priority || TASK_PRIORITY.MEDIUM,
        group: currentTask.group || "WAREHOUSE",
        assignee: currentTask.assignee || "",
        assignedBy: currentTask.assignedBy || supervisorName,
        collaborators: currentTask.collaborators || [],
        dueDate: currentTask.dueDate || "",
        tags: currentTask.tags ? currentTask.tags.join(", ") : "",
      })
      setCommentText("")
    }
  }, [currentTask, isCreating, isOpen, supervisorName])

  const handleClose = () => {
    if (isCreating) closeCreateModal()
    else closeDetailModal()
  }

  const toggleCollaborator = (name) => {
    setFormData((prev) => {
      const exists = prev.collaborators.includes(name)
      if (exists) {
        return {
          ...prev,
          collaborators: prev.collaborators.filter((c) => c !== name),
        }
      } else {
        return {
          ...prev,
          collaborators: [...prev.collaborators, name],
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
        assignee: formData.assignee,
        assignedBy: formData.assignedBy,
        collaborators: formData.collaborators,
        dueDate: formData.dueDate,
        tags: tagsArray,
        comments: [
          {
            id: `C-${Date.now()}`,
            author: user?.name || "Marta Seixas",
            role: "Atasan / Manager",
            avatar: "MS",
            text: `Tugas ditugaskan kepada ${formData.assignee} dengan grup divisi ${formData.group}. Harap segera dikerjakan sesuai SOP.`,
            createdAt: "Baru saja",
            isSupervisor: true,
          },
        ],
      })
      closeCreateModal()
    } else if (currentTask) {
      onUpdateTask?.({
        id: currentTask.id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        group: formData.group,
        assignee: formData.assignee,
        assignedBy: formData.assignedBy,
        collaborators: formData.collaborators,
        dueDate: formData.dueDate,
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
        author: user?.name || "Marta Seixas",
        role: "Manager Operasional (Atasan)",
        avatar: (user?.name || "Marta Seixas")
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join(""),
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

  // Filter anggota tim berdasarkan grup terpilih untuk kemudahan seleksi bawahan
  const selectedGroupMembers = TEAM_MEMBERS.filter(
    (m) => formData.group === "ALL" || m.group === formData.group
  )

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
            {isCreating ? "Tambah & Delegasikan Tugas Baru" : "Detail & Kolaborasi Tugas"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isCreating
              ? "Atasan dapat menugaskan bawahan, memilih grup divisi, dan menambahkan rekan kolaborator."
              : "Pantau progres, delegasikan ke bawahan, dan lakukan diskusi instruksi kerja tim."}
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
              {/* Supervisor Info Card (Penugasan dari Atasan) */}
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      Pemberi Tugas (Atasan / Supervisor):
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                      Atasan
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 font-medium">
                    {formData.assignedBy}
                  </p>
                </div>
              </div>

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

              {/* Row: Grup Divisi & Penanggung Jawab Bawahan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      {TEAM_GROUPS.filter((g) => g.id !== "ALL").map((grp) => (
                        <option key={grp.id} value={grp.id}>
                          {grp.name} ({grp.badge})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Penanggung Jawab (Bawahan / PIC)
                  </FormLabel>
                  <FormControl>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={formData.assignee}
                      onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    >
                      <optgroup label={`Anggota Divisi ${formData.group}`}>
                        {selectedGroupMembers.map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name} — {member.role}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Semua Anggota Tim">
                        {TEAM_MEMBERS.map((member) => (
                          <option key={`all-${member.id}`} value={member.name}>
                            {member.name} ({member.role})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </FormControl>
                </FormItem>
              </div>

              {/* Rekan Kolaborasi Tim (Multi-member Collaboration) */}
              <div className="space-y-1.5 rounded-lg border p-3 bg-card/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Anggota Kolaborasi Tim (Rekan Kerja Tambahan)
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    {formData.collaborators.length} dipilih
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Pilih bawahan atau staf lain yang turut berkolaborasi menyelesaikan tugas ini:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TEAM_MEMBERS.map((member) => {
                    const isSelected = formData.collaborators.includes(member.name)
                    const isMainAssignee = formData.assignee === member.name

                    return (
                      <button
                        key={member.id}
                        type="button"
                        disabled={isMainAssignee}
                        onClick={() => toggleCollaborator(member.name)}
                        className={cn(
                          "px-2.5 py-1 text-xs rounded-md border transition-all flex items-center gap-1.5 cursor-pointer",
                          isMainAssignee
                            ? "opacity-50 cursor-not-allowed bg-muted border-border"
                            : isSelected
                            ? "bg-primary text-primary-foreground border-primary font-medium shadow-xs"
                            : "bg-background text-muted-foreground hover:bg-muted border-input"
                        )}
                      >
                        <span className="text-[10px] font-bold opacity-80">{member.avatar}</span>
                        <span>{member.name}</span>
                        {isMainAssignee && (
                          <span className="text-[9px] bg-background/30 px-1 rounded">PIC Utama</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

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

              {/* Batas Waktu & Kategori Tags */}
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Batas Waktu (Due Date)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    Tags / Kategori (Koma)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Purchasing, Audit, QC"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
                <span>PIC: {currentTask?.assignee}</span>
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
                  <strong className="text-foreground">{user?.name || "Marta Seixas"}</strong> (Atasan /
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
