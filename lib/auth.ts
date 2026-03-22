import { cookies } from "next/headers"
import { db } from "./data-store"
import type { SessionUser } from "./types"

export const COOKIE_NAME = "stock_session"

export function findUser(
  email: string,
  password: string
): SessionUser | null {
  const user = db.usuarios.find(
    (u) => u.email === email && u.password === password && u.activo
  )
  if (!user) return null

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
  }
}

export function buildSessionCookie(session: SessionUser): string {
  const value = encodeURIComponent(JSON.stringify(session))
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `${COOKIE_NAME}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400${secure}`
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)
  if (!sessionCookie) return null

  try {
    return JSON.parse(decodeURIComponent(sessionCookie.value)) as SessionUser
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) {
    throw new Error("No autorizado")
  }
  return session
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth()
  if (session.rol !== "administrador") {
    throw new Error("Acceso denegado: se requiere rol de administrador")
  }
  return session
}
