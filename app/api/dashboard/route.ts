import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/data-store"
import type { DashboardStats } from "@/lib/types"

export async function GET() {
  try {
    await requireAuth()

    const today = new Date().toISOString().split("T")[0]
    const movimientosHoy = db.movimientos.filter(
      (m) => m.createdAt.split("T")[0] === today
    ).length

    const stockPorCategoria = db.categorias.map((cat) => {
      const stock = db.productos
        .filter((p) => p.categoriaId === cat.id)
        .reduce((sum, p) => sum + p.stockActual, 0)
      return { categoria: cat.nombre, stock }
    })

    const movimientosRecientes = db.movimientos.slice(-5).reverse()

    const stats: DashboardStats = {
      totalProductos: db.productos.length,
      stockTotal: db.productos.reduce((sum, p) => sum + p.stockActual, 0),
      movimientosHoy,
      totalCategorias: db.categorias.length,
      stockPorCategoria,
      movimientosRecientes,
    }

    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}
