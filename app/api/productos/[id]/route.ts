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
    const producto = db.productos.find((p) => p.id === Number(id))
    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }
    return NextResponse.json(producto)
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
    const idx = db.productos.findIndex((p) => p.id === Number(id))
    if (idx === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const body = await request.json()
    const { nombre, descripcion, sku, categoriaId, precio, stockActual, stockMinimo, activo } = body

    if (sku && sku !== db.productos[idx].sku) {
      const existingSku = db.productos.find((p) => p.sku === sku && p.id !== Number(id))
      if (existingSku) {
        return NextResponse.json({ error: "El SKU ya existe" }, { status: 409 })
      }
    }

    let categoriaNombre = db.productos[idx].categoriaNombre
    if (categoriaId && categoriaId !== db.productos[idx].categoriaId) {
      const categoria = db.categorias.find((c) => c.id === categoriaId)
      if (!categoria) {
        return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
      }
      categoriaNombre = categoria.nombre
    }

    db.productos[idx] = {
      ...db.productos[idx],
      nombre: nombre ?? db.productos[idx].nombre,
      descripcion: descripcion ?? db.productos[idx].descripcion,
      sku: sku ?? db.productos[idx].sku,
      categoriaId: categoriaId ?? db.productos[idx].categoriaId,
      categoriaNombre,
      precio: precio !== undefined ? Number(precio) : db.productos[idx].precio,
      stockActual: stockActual !== undefined ? Number(stockActual) : db.productos[idx].stockActual,
      stockMinimo: stockMinimo !== undefined ? Number(stockMinimo) : db.productos[idx].stockMinimo,
      activo: activo !== undefined ? activo : db.productos[idx].activo,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(db.productos[idx])
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
    const idx = db.productos.findIndex((p) => p.id === Number(id))
    if (idx === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    db.productos.splice(idx, 1)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}
