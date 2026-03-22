import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/data-store"

export async function GET() {
  try {
    await requireAuth()
    return NextResponse.json(db.categorias)
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth()
    const body = await request.json()

    const { nombre, descripcion } = body

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const existing = db.categorias.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase())
    if (existing) {
      return NextResponse.json({ error: "La categoría ya existe" }, { status: 409 })
    }

    const categoria = {
      id: db.nextId("categorias"),
      nombre,
      descripcion: descripcion || "",
      createdAt: new Date().toISOString(),
    }

    db.categorias.push(categoria)
    return NextResponse.json(categoria, { status: 201 })
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}
