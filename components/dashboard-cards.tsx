"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Layers, ArrowLeftRight, Tags } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

const icons = [Package, Layers, ArrowLeftRight, Tags]

export function DashboardCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { title: "Total Productos", value: stats.totalProductos },
    { title: "Stock Total", value: stats.stockTotal.toLocaleString() },
    { title: "Movimientos Hoy", value: stats.movimientosHoy },
    { title: "Categorías", value: stats.totalCategorias },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = icons[i]
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
