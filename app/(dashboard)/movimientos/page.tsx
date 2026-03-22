"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { MovementsTable } from "@/components/movements-table"
import { MovementFormDialog } from "@/components/movement-form-dialog"
import type { Movimiento, Producto } from "@/lib/types"

import { fetcher } from "@/lib/fetcher"

export default function MovimientosPage() {
  const { data: movimientos = [], mutate } = useSWR<Movimiento[]>("/api/movimientos", fetcher)
  const { data: productos = [], mutate: mutateProducts } = useSWR<Producto[]>("/api/productos", fetcher)

  const [dialogOpen, setDialogOpen] = useState(false)

  function handleSave() {
    mutate()
    mutateProducts()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-balance">Movimientos</h2>
          <p className="text-muted-foreground">
            Registro de entradas y salidas de stock
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Movimiento
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            {movimientos.length} movimiento{movimientos.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MovementsTable movimientos={movimientos} />
        </CardContent>
      </Card>
      <MovementFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productos={productos}
        onSave={handleSave}
      />
    </div>
  )
}
