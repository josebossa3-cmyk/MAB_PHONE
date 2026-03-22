import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/data-store"

export async function GET() {
  try {
    await requireAuth()
    return NextResponse.json(db.movimientos.slice().reverse())
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    const { productoId, tipo, cantidad, motivo } = body

    if (!productoId || !tipo || !cantidad) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    if (tipo !== "entrada" && tipo !== "salida") {
      return NextResponse.json({ error: "Tipo debe ser 'entrada' o 'salida'" }, { status: 400 })
    }

    const productoIdx = db.productos.findIndex((p) => p.id === productoId)
    if (productoIdx === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const cantidadNum = Number(cantidad)
    if (cantidadNum <= 0) {
      return NextResponse.json({ error: "La cantidad debe ser mayor a 0" }, { status: 400 })
    }

    if (tipo === "salida" && db.productos[productoIdx].stockActual < cantidadNum) {
      return NextResponse.json({ error: "Stock insuficiente" }, { status: 400 })
    }

    // Update stock
    if (tipo === "entrada") {
      db.productos[productoIdx].stockActual += cantidadNum
    } else {
      db.productos[productoIdx].stockActual -= cantidadNum
    }
    db.productos[productoIdx].updatedAt = new Date().toISOString()

    const movimiento = {
      id: db.nextId("movimientos"),
      productoId,
      productoNombre: db.productos[productoIdx].nombre,
      tipo: tipo as "entrada" | "salida",
      cantidad: cantidadNum,
      motivo: motivo || "",
      usuarioId: session.id,
      usuarioNombre: session.nombre,
      createdAt: new Date().toISOString(),
    }

    db.movimientos.push(movimiento)
    return NextResponse.json(movimiento, { status: 201 })
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}
