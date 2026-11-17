/**
 * Helper untuk decode JWT token secara aman di sisi client
 */

export function parseJwt(token) {
  if (!token) return null
  try {
    const base64Url = token.split(".")[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Gagal mendecode JWT token:", error)
    return null
  }
}

export function isTokenExpired(token) {
  const payload = parseJwt(token)
  if (!payload || !payload.exp) return false
  const nowInSeconds = Math.floor(Date.now() / 1000)
  return payload.exp < nowInSeconds
}

export function getUserFromToken(token) {
  const payload = parseJwt(token)
  if (!payload) return null
  return {
    id: payload.sub || payload.uid || payload.id,
    username: payload.username || payload.name,
    email: payload.email,
    role: payload.role || payload.role_id || 1,
  }
}
