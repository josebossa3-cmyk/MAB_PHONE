"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { UsersTable } from "@/components/users-table"
import { UserFormDialog } from "@/components/user-form-dialog"
import type { UsuarioPublico, SessionUser } from "@/lib/types"

import { fetcher } from "@/lib/fetcher"

export function UsersPageClient({ currentUser }: { currentUser: SessionUser }) {
  const { data: usuarios = [], mutate } = useSWR<UsuarioPublico[]>("/api/usuarios", fetcher)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editUser, setEditUser] = useState<UsuarioPublico | null>(null)

  function handleEdit(user: UsuarioPublico) {
    setEditUser(user)
    setDialogOpen(true)
  }

  function handleNew() {
    setEditUser(null)
    setDialogOpen(true)
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Está seguro de eliminar este usuario?")) return
    const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || "Error al eliminar")
      return
    }
    mutate()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-balance">Usuarios</h2>
          <p className="text-muted-foreground">
            Administre los usuarios y sus roles
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            usuarios={usuarios}
            currentUserId={currentUser.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editUser}
        onSave={() => mutate()}
      />
    </div>
  )
}
