# Control de Inventario (Next.js)

Aplicación de ejemplo para gestión de inventario, productos, categorías, movimientos de stock y usuarios.  
Actualmente usa una "base de datos" en memoria (`lib/data-store.ts`) y autenticación mediante cookie de sesión.

---

## 📦 Requisitos

- Node.js 20+ (recomendado)  
- npm (incluido con Node) o pnpm  
- Navegador moderno (Chrome, Edge, etc.)

---

## ▶️ Cómo ejecutar el proyecto en local

1. Clonar o copiar el proyecto en tu máquina.
2. Abrir una terminal en la carpeta raíz (donde está `package.json`).
3. Instalar dependencias:

   ```bash
   npm install
   # o
   pnpm install
   ```

4. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   # o
   pnpm dev
   ```

5. Abrir en el navegador:

   ```text
   http://localhost:3000
   ```

6. Credenciales de prueba:

   - Administrador: `admin@stock.com` / `admin123`
   - Vendedor: `vendedor@stock.com` / `vendedor123`

---

## 🚀 Build de producción

```bash
npm run build
npm start
```

Luego entrar a `http://localhost:3000`.

---

## 🧱 Estructura básica

- `app/` – Rutas de la app (Next.js App Router).
  - `(auth)/login` – pantalla de login.
  - `(dashboard)` – layout protegido + páginas de Dashboard, Productos, Categorías, Movimientos y Usuarios.
  - `api/` – rutas API (usuarios, productos, categorías, movimientos, dashboard, auth).
- `lib/types.ts` – tipos TypeScript compartidos.
- `lib/data-store.ts` – datos en memoria (usuarios, productos, etc.).
- `lib/auth.ts` – helpers de autenticación y sesión (cookies).
- `components/` – componentes React (tablas, formularios, sidebar, etc.).

---

## 🗂 Preparar el proyecto para subir a GitHub

1. Asegurarse de NO incluir datos sensibles (no hay `.env` ni llaves secretas por defecto).
2. Inicializar git en la carpeta del proyecto:

   ```bash
   git init
   git add .
   git commit -m "Inicializar proyecto de control de inventario"
   git branch -M main
   git remote add origin <URL_DE_TU_REPOSITORIO_EN_GITHUB>
   git push -u origin main
   ```

3. Verificar en GitHub que se ve:
   - Código fuente (`app`, `components`, `lib`, etc.).
   - Este `README.md`.

---

## 📝 Bloque de notas: cómo conectar una base de datos real

Actualmente la aplicación usa datos en memoria (`lib/data-store.ts`).  
Sigue estos pasos generales si quieres reemplazarlo por una base de datos real (por ejemplo **PostgreSQL + Prisma**):

### 1. Elegir motor de base de datos

- Recomendado para este tipo de app:
  - PostgreSQL (local con Docker, WSL o instalado en Windows).
  - MySQL / MariaDB también funcionaría, pero el ejemplo se centrará en Postgres.

### 2. Instalar Prisma y cliente de la BD

En la raíz del proyecto:

```bash
npm install @prisma/client
npm install -D prisma
```

Crear el archivo de configuración inicial:

```bash
npx prisma init
```

Esto creará:

- `.env` – aquí se define `DATABASE_URL`
- `prisma/schema.prisma` – definición del modelo de datos

### 3. Configurar la cadena de conexión

Editar `.env` (no lo subas a GitHub):

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/tu_base?schema=public"
```

### 4. Diseñar el modelo en `schema.prisma`

Por ejemplo, modelos basados en `lib/types.ts`:

- `Usuario`
- `Categoria`
- `Producto`
- `Movimiento`

Cada modelo debe tener:

- `id` (Int, autoincrement).
- Campos equivalentes a los tipos actuales (`nombre`, `email`, `rol`, `activo`, etc.).

Ejemplo muy simplificado de un modelo:

```prisma
model Usuario {
  id        Int      @id @default(autoincrement())
  nombre    String
  email     String   @unique
  password  String
  rol       String
  activo    Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

Después de definir los modelos:

```bash
npx prisma migrate dev --name init
```

Esto creará las tablas en la base de datos.

### 5. Crear un cliente de base de datos reutilizable

Crear un archivo `lib/db.ts` (ejemplo de cómo debería lucir):

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Este cliente se puede importar en los endpoints de `app/api/...`.

### 6. Reemplazar `lib/data-store.ts` por consultas reales

Ir endpoint por endpoint y cambiar el acceso a `db` en memoria por consultas Prisma:

- Antes (ejemplo en `app/api/productos/route.ts`):

  ```ts
  const productos = db.productos;
  ```

- Después (idea general con Prisma):

  ```ts
  import { prisma } from "@/lib/db";

  const productos = await prisma.producto.findMany();
  ```

Lo mismo para:

- Crear (`POST`) → `prisma.producto.create`
- Actualizar (`PUT`) → `prisma.producto.update`
- Borrar (`DELETE`) → `prisma.producto.delete`

### 7. Mantener la misma interfaz hacia el front

Es importante que la forma de los datos que devuelven las APIs (`/api/productos`, `/api/categorias`, etc.) siga coincidiendo con los tipos de `lib/types.ts`, para que el front (tablas, formularios, dashboard) continúe funcionando sin cambios.

### 8. Comprobar y limpiar

- Ejecutar:

  ```bash
  npm run dev
  ```

- Probar todas las pantallas:
  - Login
  - Dashboard
  - CRUD de Productos, Categorías, Movimientos y Usuarios

Cuando todo funcione con la base de datos, podrás eliminar gradualmente `lib/data-store.ts` y cualquier código que ya no se utilice.

---

Con estos pasos el proyecto queda listo para:

- Subirse a GitHub sin archivos de más.
- Evolucionar de datos en memoria a una base de datos relacional real manteniendo la misma interfaz para el front-end.

