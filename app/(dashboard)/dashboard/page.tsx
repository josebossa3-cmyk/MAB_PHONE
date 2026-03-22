"use client"

import useSWR from "swr"
import { DashboardCards } from "@/components/dashboard-cards"
import { DashboardChart } from "@/components/dashboard-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DashboardStats } from "@/lib/types"

import { fetcher } from "@/lib/fetcher"

export default function DashboardPage() {
  const { data: stats, isLoading } = useSWR<DashboardStats>(
    "/api/dashboard",
    fetcher
  )

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-balance">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general del inventario
        </p>
      </div>
      <DashboardCards stats={stats} />
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardChart data={stats.stockPorCategoria} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Movimientos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.movimientosRecientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Sin movimientos recientes
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.movimientosRecientes.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.productoNombre}</TableCell>
                      <TableCell>
                        <Badge
                          variant={m.tipo === "entrada" ? "default" : "destructive"}
                          className={m.tipo === "entrada" ? "bg-emerald-600 text-emerald-50 hover:bg-emerald-600/90" : ""}
                        >
                          {m.tipo === "entrada" ? "Entrada" : "Salida"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{m.cantidad}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
