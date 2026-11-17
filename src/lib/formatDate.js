/**
 * Helper pemformat tanggal untuk EMMA Workflow
 */

export function formatDate(date, options = {}) {
  if (!date) return "-"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "-"

  const defaultOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }

  return new Intl.DateTimeFormat("id-ID", defaultOptions).format(d)
}

export function formatDateTime(date) {
  if (!date) return "-"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function formatRelativeTime(date) {
  if (!date) return "-"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "-"

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return "baru saja"
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} jam lalu`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays} hari lalu`

  return formatDate(date)
}
