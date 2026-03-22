"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import type { Categoria, Producto } from "@/lib/types"

interface CategoriesTableProps {
  categorias: Categoria[]
  productos: Producto[]
  onEdit: (category: Categoria) => void
  onDelete: (id: number) => void
}

export function CategoriesTable({ categorias, productos, onEdit, onDelete }: CategoriesTableProps) {
  function countProducts(catId: number) {
    return productos.filter((p) => p.categoriaId === catId).length
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Productos</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categorias.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
              No hay categorías registradas
            </TableCell>
          </TableRow>
        ) : (
          categorias.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.nombre}</TableCell>
              <TableCell className="text-muted-foreground">{c.descripcion}</TableCell>
              <TableCell className="text-right">{countProducts(c.id)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(c)} aria-label={`Editar ${c.nombre}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)} aria-label={`Eliminar ${c.nombre}`}>
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
