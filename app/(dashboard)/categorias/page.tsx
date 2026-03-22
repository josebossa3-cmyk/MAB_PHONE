"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { CategoriesTable } from "@/components/categories-table"
import { CategoryFormDialog } from "@/components/category-form-dialog"
import type { Categoria, Producto } from "@/lib/types"

import { fetcher } from "@/lib/fetcher"

export default function CategoriasPage() {
  const { data: categorias = [], mutate } = useSWR<Categoria[]>("/api/categorias", fetcher)
  const { data: productos = [] } = useSWR<Producto[]>("/api/productos", fetcher)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Categoria | null>(null)

  function handleEdit(category: Categoria) {
    setEditCategory(category)
    setDialogOpen(true)
  }

  function handleNew() {
    setEditCategory(null)
    setDialogOpen(true)
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Está seguro de eliminar esta categoría?")) return
    const res = await fetch(`/api/categorias/${id}`, { method: "DELETE" })
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
          <h2 className="text-2xl font-bold tracking-tight text-balance">Categorías</h2>
          <p className="text-muted-foreground">
            Organice los productos por categorías
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            {categorias.length} categoría{categorias.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoriesTable
            categorias={categorias}
            productos={productos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editCategory}
        onSave={() => mutate()}
      />
    </div>
  )
}
