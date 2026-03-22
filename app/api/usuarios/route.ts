import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { db } from "@/lib/data-store"

export async function GET() {
  try {
    await requireAdmin()
    const usersPublic = db.usuarios.map(({ password: _, ...u }) => u)
    return NextResponse.json(usersPublic)
  } catch {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()

    const { nombre, email, password, rol } = body

    if (!nombre || !email || !password || !rol) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const existing = db.usuarios.find((u) => u.email === email)
    if (existing) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    const usuario = {
      id: db.nextId("usuarios"),
      nombre,
      email,
      password,
      rol: rol as "administrador" | "vendedor",
      activo: true,
      createdAt: new Date().toISOString(),
    }

    db.usuarios.push(usuario)
    const { password: _, ...publicUser } = usuario
    return NextResponse.json(publicUser, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }
}
