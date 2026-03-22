import type { Usuario, Categoria, Producto, Movimiento } from "./types"

const now = new Date().toISOString()

const usuarios: Usuario[] = [
  {
    id: 1,
    nombre: "Administrador",
    email: "admin@stock.com",
    password: "admin123",
    rol: "administrador",
    activo: true,
    createdAt: now,
  },
  {
    id: 2,
    nombre: "Vendedor Demo",
    email: "vendedor@stock.com",
    password: "vendedor123",
    rol: "vendedor",
    activo: true,
    createdAt: now,
  },
]

const categorias: Categoria[] = [
  { id: 1, nombre: "Electrónica", descripcion: "Dispositivos y componentes electrónicos", createdAt: now },
  { id: 2, nombre: "Oficina", descripcion: "Suministros y mobiliario de oficina", createdAt: now },
  { id: 3, nombre: "Herramientas", descripcion: "Herramientas manuales y eléctricas", createdAt: now },
  { id: 4, nombre: "Limpieza", descripcion: "Productos de limpieza e higiene", createdAt: now },
]

const productos: Producto[] = [
  { id: 1, nombre: "Laptop HP ProBook", descripcion: "Laptop empresarial 14 pulgadas", sku: "ELEC-001", categoriaId: 1, categoriaNombre: "Electrónica", precio: 15999.99, stockActual: 25, stockMinimo: 5, activo: true, createdAt: now, updatedAt: now },
  { id: 2, nombre: "Monitor Dell 27\"", descripcion: "Monitor IPS Full HD", sku: "ELEC-002", categoriaId: 1, categoriaNombre: "Electrónica", precio: 5499.50, stockActual: 40, stockMinimo: 10, activo: true, createdAt: now, updatedAt: now },
  { id: 3, nombre: "Teclado Mecánico", descripcion: "Teclado mecánico RGB", sku: "ELEC-003", categoriaId: 1, categoriaNombre: "Electrónica", precio: 1299.00, stockActual: 60, stockMinimo: 15, activo: true, createdAt: now, updatedAt: now },
  { id: 4, nombre: "Escritorio Ejecutivo", descripcion: "Escritorio de madera 180cm", sku: "OFIC-001", categoriaId: 2, categoriaNombre: "Oficina", precio: 8500.00, stockActual: 12, stockMinimo: 3, activo: true, createdAt: now, updatedAt: now },
  { id: 5, nombre: "Silla Ergonómica", descripcion: "Silla de oficina con soporte lumbar", sku: "OFIC-002", categoriaId: 2, categoriaNombre: "Oficina", precio: 4200.00, stockActual: 18, stockMinimo: 5, activo: true, createdAt: now, updatedAt: now },
  { id: 6, nombre: "Resma de Papel A4", descripcion: "Papel bond 75g 500 hojas", sku: "OFIC-003", categoriaId: 2, categoriaNombre: "Oficina", precio: 89.90, stockActual: 200, stockMinimo: 50, activo: true, createdAt: now, updatedAt: now },
  { id: 7, nombre: "Taladro Eléctrico", descripcion: "Taladro percutor 800W", sku: "HERR-001", categoriaId: 3, categoriaNombre: "Herramientas", precio: 1850.00, stockActual: 15, stockMinimo: 5, activo: true, createdAt: now, updatedAt: now },
  { id: 8, nombre: "Juego de Llaves", descripcion: "Set de 25 llaves combinadas", sku: "HERR-002", categoriaId: 3, categoriaNombre: "Herramientas", precio: 650.00, stockActual: 30, stockMinimo: 10, activo: true, createdAt: now, updatedAt: now },
  { id: 9, nombre: "Desinfectante 5L", descripcion: "Desinfectante multiusos concentrado", sku: "LIMP-001", categoriaId: 4, categoriaNombre: "Limpieza", precio: 120.00, stockActual: 80, stockMinimo: 20, activo: true, createdAt: now, updatedAt: now },
  { id: 10, nombre: "Escoba Industrial", descripcion: "Escoba para uso industrial", sku: "LIMP-002", categoriaId: 4, categoriaNombre: "Limpieza", precio: 180.00, stockActual: 45, stockMinimo: 10, activo: true, createdAt: now, updatedAt: now },
]

const movimientos: Movimiento[] = [
  { id: 1, productoId: 1, productoNombre: "Laptop HP ProBook", tipo: "entrada", cantidad: 10, motivo: "Compra a proveedor", usuarioId: 1, usuarioNombre: "Administrador", createdAt: now },
  { id: 2, productoId: 2, productoNombre: "Monitor Dell 27\"", tipo: "salida", cantidad: 5, motivo: "Venta a cliente corporativo", usuarioId: 2, usuarioNombre: "Vendedor Demo", createdAt: now },
  { id: 3, productoId: 6, productoNombre: "Resma de Papel A4", tipo: "entrada", cantidad: 100, motivo: "Reabastecimiento mensual", usuarioId: 1, usuarioNombre: "Administrador", createdAt: now },
  { id: 4, productoId: 9, productoNombre: "Desinfectante 5L", tipo: "salida", cantidad: 20, motivo: "Distribución a sucursales", usuarioId: 2, usuarioNombre: "Vendedor Demo", createdAt: now },
  { id: 5, productoId: 7, productoNombre: "Taladro Eléctrico", tipo: "entrada", cantidad: 5, motivo: "Compra de emergencia", usuarioId: 1, usuarioNombre: "Administrador", createdAt: now },
]

const counters = {
  usuarios: 3,
  categorias: 5,
  productos: 11,
  movimientos: 6,
}

export const db = {
  usuarios,
  categorias,
  productos,
  movimientos,
  nextId(collection: keyof typeof counters): number {
    const id = counters[collection]
    counters[collection]++
    return id
  },
}
