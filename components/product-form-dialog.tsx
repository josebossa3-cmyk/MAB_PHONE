"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Producto, Categoria } from "@/lib/types"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Producto | null
  categorias: Categoria[]
  onSave: () => void
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categorias,
  onSave,
}: ProductFormDialogProps) {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [sku, setSku] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [precio, setPrecio] = useState("")
  const [stockActual, setStockActual] = useState("")
  const [stockMinimo, setStockMinimo] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setNombre(product.nombre)
      setDescripcion(product.descripcion)
      setSku(product.sku)
      setCategoriaId(String(product.categoriaId))
      setPrecio(String(product.precio))
      setStockActual(String(product.stockActual))
      setStockMinimo(String(product.stockMinimo))
    } else {
      setNombre("")
      setDescripcion("")
      setSku("")
      setCategoriaId("")
      setPrecio("")
      setStockActual("")
      setStockMinimo("")
    }
    setError("")
  }, [product, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const body = {
        nombre,
        descripcion,
        sku,
        categoriaId: Number(categoriaId),
        precio: Number(precio),
        stockActual: Number(stockActual),
        stockMinimo: Number(stockMinimo),
      }

      const url = product ? `/api/productos/${product.id}` : "/api/productos"
      const method = product ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Error al guardar el producto")
        return
      }

      onSave()
      onOpenChange(false)
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {product ? "Modifique los datos del producto" : "Complete los datos del nuevo producto"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Categoría</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="precio">Precio</Label>
              <Input id="precio" type="number" step="0.01" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="stockActual">Stock Actual</Label>
              <Input id="stockActual" type="number" min="0" value={stockActual} onChange={(e) => setStockActual(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="stockMinimo">Stock Mínimo</Label>
              <Input id="stockMinimo" type="number" min="0" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} required />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
