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
import type { UsuarioPublico } from "@/lib/types"

interface UsersTableProps {
  usuarios: UsuarioPublico[]
  currentUserId: number
  onEdit: (user: UsuarioPublico) => void
  onDelete: (id: number) => void
}

export function UsersTable({ usuarios, currentUserId, onEdit, onDelete }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No hay usuarios registrados
            </TableCell>
          </TableRow>
        ) : (
          usuarios.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{u.nombre}</TableCell>
              <TableCell className="text-muted-foreground">{u.email}</TableCell>
              <TableCell>
                <Badge variant={u.rol === "administrador" ? "default" : "secondary"}>
                  {u.rol === "administrador" ? "Administrador" : "Vendedor"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={u.activo ? "default" : "secondary"}
                  className={u.activo ? "bg-emerald-600 text-emerald-50 hover:bg-emerald-600/90" : ""}
                >
                  {u.activo ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(u)} aria-label={`Editar ${u.nombre}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(u.id)}
                    disabled={u.id === currentUserId}
                    aria-label={`Eliminar ${u.nombre}`}
                  >
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
