"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Movimiento } from "@/lib/types"

interface MovementsTableProps {
  movimientos: Movimiento[]
}

export function MovementsTable({ movimientos }: MovementsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Cantidad</TableHead>
          <TableHead>Motivo</TableHead>
          <TableHead>Usuario</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movimientos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              No hay movimientos registrados
            </TableCell>
          </TableRow>
        ) : (
          movimientos.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="text-muted-foreground text-xs">
                {new Date(m.createdAt).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell className="font-medium">{m.productoNombre}</TableCell>
              <TableCell>
                <Badge
                  variant={m.tipo === "entrada" ? "default" : "destructive"}
                  className={m.tipo === "entrada" ? "bg-emerald-600 text-emerald-50 hover:bg-emerald-600/90" : ""}
                >
                  {m.tipo === "entrada" ? "Entrada" : "Salida"}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">{m.cantidad}</TableCell>
              <TableCell className="text-muted-foreground">{m.motivo}</TableCell>
              <TableCell>{m.usuarioNombre}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
