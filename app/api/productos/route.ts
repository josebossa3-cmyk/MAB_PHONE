import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/data-store"

export async function GET() {
  try {
    await requireAuth()
    return NextResponse.json(db.productos)
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth()
    const body = await request.json()

    const { nombre, descripcion, sku, categoriaId, precio, stockActual, stockMinimo } = body

    if (!nombre || !sku || !categoriaId) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const categoria = db.categorias.find((c) => c.id === categoriaId)
    if (!categoria) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    const existingSku = db.productos.find((p) => p.sku === sku)
    if (existingSku) {
      return NextResponse.json({ error: "El SKU ya existe" }, { status: 409 })
    }

    const now = new Date().toISOString()
    const producto = {
      id: db.nextId("productos"),
      nombre,
      descripcion: descripcion || "",
      sku,
      categoriaId,
      categoriaNombre: categoria.nombre,
      precio: Number(precio) || 0,
      stockActual: Number(stockActual) || 0,
      stockMinimo: Number(stockMinimo) || 0,
      activo: true,
      createdAt: now,
      updatedAt: now,
    }

    db.productos.push(producto)
    return NextResponse.json(producto, { status: 201 })
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}
