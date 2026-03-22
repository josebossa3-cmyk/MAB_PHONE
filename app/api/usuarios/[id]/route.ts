import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { db } from "@/lib/data-store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const user = db.usuarios.find((u) => u.id === Number(id))
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }
    const { password: _, ...publicUser } = user
    return NextResponse.json(publicUser)
  } catch {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const idx = db.usuarios.findIndex((u) => u.id === Number(id))
    if (idx === -1) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const body = await request.json()
    const { nombre, email, password, rol, activo } = body

    if (email && email !== db.usuarios[idx].email) {
      const existing = db.usuarios.find((u) => u.email === email)
      if (existing) {
        return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
      }
    }

    db.usuarios[idx] = {
      ...db.usuarios[idx],
      nombre: nombre ?? db.usuarios[idx].nombre,
      email: email ?? db.usuarios[idx].email,
      password: password && password.trim() ? password : db.usuarios[idx].password,
      rol: rol ?? db.usuarios[idx].rol,
      activo: activo !== undefined ? activo : db.usuarios[idx].activo,
    }

    const { password: _, ...publicUser } = db.usuarios[idx]
    return NextResponse.json(publicUser)
  } catch {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    const { id } = await params

    if (session.id === Number(id)) {
      return NextResponse.json({ error: "No puede eliminar su propia cuenta" }, { status: 400 })
    }

    const idx = db.usuarios.findIndex((u) => u.id === Number(id))
    if (idx === -1) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    db.usuarios.splice(idx, 1)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }
}
