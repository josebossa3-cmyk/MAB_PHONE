export interface Usuario {
  id: number
  nombre: string
  email: string
  password: string
  rol: "administrador" | "vendedor"
  activo: boolean
  createdAt: string
}

export interface UsuarioPublico {
  id: number
  nombre: string
  email: string
  rol: "administrador" | "vendedor"
  activo: boolean
  createdAt: string
}

export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  createdAt: string
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  sku: string
  categoriaId: number
  categoriaNombre: string
  precio: number
  stockActual: number
  stockMinimo: number
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface Movimiento {
  id: number
  productoId: number
  productoNombre: string
  tipo: "entrada" | "salida"
  cantidad: number
  motivo: string
  usuarioId: number
  usuarioNombre: string
  createdAt: string
}

export interface SessionUser {
  id: number
  nombre: string
  email: string
  rol: "administrador" | "vendedor"
}

export interface DashboardStats {
  totalProductos: number
  stockTotal: number
  movimientosHoy: number
  totalCategorias: number
  stockPorCategoria: { categoria: string; stock: number }[]
  movimientosRecientes: Movimiento[]
}
