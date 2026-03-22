"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { ProductsTable } from "@/components/products-table"
import { ProductFormDialog } from "@/components/product-form-dialog"
import type { Producto, Categoria } from "@/lib/types"

import { fetcher } from "@/lib/fetcher"

export default function ProductosPage() {
  const { data: productos = [], mutate } = useSWR<Producto[]>("/api/productos", fetcher)
  const { data: categorias = [] } = useSWR<Categoria[]>("/api/categorias", fetcher)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Producto | null>(null)
  const [search, setSearch] = useState("")

  const filtered = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  function handleEdit(product: Producto) {
    setEditProduct(product)
    setDialogOpen(true)
  }

  function handleNew() {
    setEditProduct(null)
    setDialogOpen(true)
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Está seguro de eliminar este producto?")) return
    await fetch(`/api/productos/${id}`, { method: "DELETE" })
    mutate()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-balance">Productos</h2>
          <p className="text-muted-foreground">
            Gestione el catálogo de productos
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <CardTitle className="text-sm text-muted-foreground">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ProductsTable
            productos={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editProduct}
        categorias={categorias}
        onSave={() => mutate()}
      />
    </div>
  )
}
