"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import type { Producto } from "@/lib/types"

interface ProductsTableProps {
  productos: Producto[]
  onEdit: (product: Producto) => void
  onDelete: (id: number) => void
}

export function ProductsTable({ productos, onEdit, onDelete }: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead className="text-right">Precio</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
              No hay productos registrados
            </TableCell>
          </TableRow>
        ) : (
          productos.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs">{p.sku}</TableCell>
              <TableCell className="font-medium">{p.nombre}</TableCell>
              <TableCell>{p.categoriaNombre}</TableCell>
              <TableCell className="text-right">${p.precio.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</TableCell>
              <TableCell className="text-right">{p.stockActual}</TableCell>
              <TableCell>
                <Badge
                  variant={p.activo ? "default" : "secondary"}
                  className={p.activo ? "bg-emerald-600 text-emerald-50 hover:bg-emerald-600/90" : ""}
                >
                  {p.activo ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(p)} aria-label={`Editar ${p.nombre}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(p.id)} aria-label={`Eliminar ${p.nombre}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
