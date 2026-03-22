import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/data-store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const categoria = db.categorias.find((c) => c.id === Number(id))
    if (!categoria) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }
    return NextResponse.json(categoria)
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const idx = db.categorias.findIndex((c) => c.id === Number(id))
    if (idx === -1) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    const body = await request.json()
    const { nombre, descripcion } = body

    if (nombre && nombre.toLowerCase() !== db.categorias[idx].nombre.toLowerCase()) {
      const existing = db.categorias.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase())
      if (existing) {
        return NextResponse.json({ error: "La categoría ya existe" }, { status: 409 })
      }
    }

    db.categorias[idx] = {
      ...db.categorias[idx],
      nombre: nombre ?? db.categorias[idx].nombre,
      descripcion: descripcion ?? db.categorias[idx].descripcion,
    }

    // Update category name in products
    if (nombre) {
      db.productos.forEach((p) => {
        if (p.categoriaId === Number(id)) {
          p.categoriaNombre = nombre
        }
      })
    }

    return NextResponse.json(db.categorias[idx])
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const idx = db.categorias.findIndex((c) => c.id === Number(id))
    if (idx === -1) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    const hasProducts = db.productos.some((p) => p.categoriaId === Number(id))
    if (hasProducts) {
      return NextResponse.json(
        { error: "No se puede eliminar: la categoría tiene productos asociados" },
        { status: 409 }
      )
    }

    db.categorias.splice(idx, 1)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}
