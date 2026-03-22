# Sistema de Gestión de Stock

Aplicación web moderna para gestión de inventario, productos, categorías, movimientos de stock y usuarios. Construida con **Next.js 16**, **TypeScript**, **React 19**, y **Tailwind CSS**.

## 📋 Tabla de Contenidos
- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución Local](#ejecución-local)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Despliegue a GitHub](#despliegue-a-github)
- [Build de Producción](#build-de-producción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Credenciales de Prueba](#credenciales-de-prueba)
- [Solución de Problemas](#solución-de-problemas)

---

## ✨ Características

✅ **Autenticación segura** - Sistema de login con cookies de sesión  
✅ **Control de roles** - Administrador y Vendedor  
✅ **Gestión de productos** - CRUD completo con categorías  
✅ **Control de inventario** - Movimientos de entrada/salida con validación de stock  
✅ **Dashboard interactivo** - Gráficos y estadísticas de inventario  
✅ **Gestión de usuarios** - Solo administradores  
✅ **Interfaz responsiva** - Diseño mobile-friendly con Tailwind CSS  
✅ **API REST** - Endpoints bien estructurados  
✅ **TypeScript** - Tipado completo para mayor seguridad  

**Estado actual:** Desarrollo y pruebas (datos en memoria)  
**Próximas mejoras:** Migración a base de datos persistente (PostgreSQL + Prisma)

---

## 📦 Requisitos

### Obligatorio
- **Node.js 20+** ([Descargar](https://nodejs.org/))
- **npm** (incluido con Node.js) **O** **pnpm** ([Descargar](https://pnpm.io/))
- **Navegador moderno** (Chrome, Edge, Firefox, Safari)

### Para base de datos persistente (opcional)
Elige **UNA** de estas opciones:

#### Opción A: PostgreSQL (Recomendado para producción)
- **Windows**: Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql` 
- **Linux**: `sudo apt install postgresql` (Ubuntu/Debian)

#### Opción B: XAMPP (Incluye Apache, MySQL, PHP)
- Descargar desde [apachefriends.org](https://www.apachefriends.org/)
- Incluye: MySQL, Apache, PHP, Tomcat

#### Opción C: WAMP (Windows)
- Descargar desde [wampserver.com](https://www.wampserver.com/)
- Incluye: Apache, MySQL, PHP

---

## 🚀 Instalación y Configuración

### Paso 1: Clonar el proyecto

```bash
# Usando Git
git clone <tu-repositorio>
cd sistema\ de\ stock

# O simplemente entra a la carpeta del proyecto
cd "c:\Users\Jose Bossa\Desktop\Nueva carpeta\sistema de stock"
```

### Paso 2: Instalar dependencias

```bash
# Con npm
npm install

# O con pnpm (más rápido)
pnpm install
```

### Paso 3: Crear archivo de configuración local

Copia `.env.local.example` a `.env.local`:

```bash
# Windows (PowerShell)
Copy-Item .env.local.example .env.local

# Windows (CMD)
copy .env.local.example .env.local

# macOS/Linux
cp .env.local.example .env.local
```

Abre `.env.local` y configura según sea necesario (ver [Configuración de Base de Datos](#configuración-de-base-de-datos)).

---

## ▶️ Ejecución Local

### Desarrollo sin Base de Datos (Datos en Memoria)

```bash
npm run dev
# o
pnpm dev
```

Abre en tu navegador: **http://localhost:3000**

**Nota:** Los datos se pierden al reiniciar. Es perfectamente funcional para pruebas.

### Acceso rápido

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | `admin@stock.com` | `admin123` |
| Vendedor | `vendedor@stock.com` | `vendedor123` |

---

## 🗄️ Configuración de Base de Datos

Actualmente la aplicación usa datos en memoria. Para persistencia real, sigue una de estas opciones:

### ⚠️ IMPORTANTE: Instalación requerida

Antes de cualquier opción de BD, instala **Prisma** (ORM):

```bash
npm install @prisma/client prisma

# Inicializar Prisma (esto crea carpeta prisma/)
npx prisma init
```

---

### Opción 1: PostgreSQL (RECOMENDADO)

#### 1.1 Instalar y configurar PostgreSQL

**Windows:**
1. Descargar [PostgreSQL](https://www.postgresql.org/download/windows/)
2. Ejecutar instalador
3. **IMPORTANTE:** Guardar la contraseña del usuario `postgres`
4. Dejar puerto por defecto: `5432`

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### 1.2 Crear base de datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Comando SQL - crear BD y usuario
CREATE DATABASE stock_db;
CREATE USER stock_user WITH PASSWORD 'tu_contraseña_segura_aqui';
ALTER ROLE stock_user SET client_encoding TO 'utf8';
ALTER ROLE stock_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE stock_user SET default_transaction_deferrable TO on;
ALTER ROLE stock_user SET default_transaction_read_only TO off;
ALTER ROLE stock_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE stock_db TO stock_user;
ALTER DATABASE stock_db OWNER TO stock_user;
\q
```

#### 1.3 Configurar `.env.local`

```bash
DATABASE_URL=postgresql://stock_user:tu_contraseña_segura_aqui@localhost:5432/stock_db
SESSION_SECRET=tu-clave-super-secreta-y-larga-cambiar-en-produccion
```

#### 1.4 Crear las tablas

```bash
npx prisma migrate dev --name init
```

---

### Opción 2: XAMPP (MySQL)

#### 2.1 Instalar XAMPP

1. Descargar desde [apachefriends.org](https://www.apachefriends.org/)
2. Ejecutar instalador
3. Aceptar instalación por defecto
4. Iniciar **Apache** y **MySQL** desde el panel de XAMPP

#### 2.2 Crear base de datos

1. Abrir navegador: **http://localhost/phpmyadmin**
2. Usuario: `root` (sin contraseña por defecto)
3. Crear nueva BD: `stock_db`

#### 2.3 Crear usuario MySQL

En phpMyAdmin:
1. Ir a **Cuentas de usuario** → **Añadir usuario**
2. Usuario: `stock_user`
3. Contraseña: una de tu elección
4. BD: Seleccionar `stock_db`
5. Privilegios: Marcar todos

#### 2.4 Configurar `.env.local`

```bash
DATABASE_URL=mysql://stock_user:tu_contraseña@localhost:3306/stock_db
SESSION_SECRET=tu-clave-super-secreta-y-larga-cambiar-en-produccion
```

#### 2.5 Crear tablas

```bash
npx prisma migrate dev --name init
```

---

### Opción 3: WAMP (Windows + MySQL)

#### 3.1 Instalar WAMP

1. Descargar desde [wampserver.com](https://www.wampserver.com/)
2. Ejecutar instalador
3. Iniciar el servidor WAMP (icono en bandeja del sistema)

#### 3.2 Crear base de datos

1. Click en icono WAMP → **phpMyAdmin**
2. Usuario: `root` (sin contraseña)
3. Crear BD: `stock_db`

#### 3.3 Crear usuario

Similar a XAMPP (ver arriba)

#### 3.4 Configurar `.env.local`

```bash
DATABASE_URL=mysql://stock_user:tu_contraseña@localhost:3306/stock_db
SESSION_SECRET=tu-clave-super-secreta-y-larga-cambiar-en-produccion
```

---

## 📤 Despliegue a GitHub

### Paso 1: Inicializar repositorio Git

```bash
git init
git add .
git commit -m "Inicializar proyecto Sistema de Stock"
git branch -M main
```

### Paso 2: Crear repositorio en GitHub

1. Ir a [github.com/new](https://github.com/new)
2. Nombre del repo: `sistema-de-stock`
3. Seleccionar **Private** (privado) o **Public**
4. **NO** inicializar README, .gitignore ni licencia
5. Click en **Create repository**

### Paso 3: Subir código

```bash
git remote add origin https://github.com/TU_USUARIO/sistema-de-stock.git
git push -u origin main
```

### Paso 4: Verificar

Abre https://github.com/TU_USUARIO/sistema-de-stock y confirma que:
- ✅ El código está subido
- ✅ El `.gitignore` está incluido (oculta `/node_modules`, `*.env`, etc.)
- ✅ No hay datos sensibles visibles
- ✅ El `README.md` se muestra correctamente

---

## 🏗️ Build de Producción

### Compilar

```bash
npm run build
```

Esto crea la carpeta `.next` con la app optimizada.

### Ejecutar en producción

```bash
npm start
```

Abre: **http://localhost:3000**

---

## 📁 Estructura del Proyecto

```
sistema-de-stock/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Página de login
│   ├── (dashboard)/                   # Rutas protegidas (requieren autenticación)
│   │   ├── layout.tsx                # Layout del dashboard
│   │   ├── dashboard/page.tsx         # Panel de control
│   │   ├── productos/page.tsx         # Gestión de productos
│   │   ├── categorias/page.tsx        # Gestión de categorías
│   │   ├── movimientos/page.tsx       # Movimientos de stock
│   │   └── usuarios/page.tsx          # Gestión de usuarios (admin)
│   ├── api/                           # Endpoints API
│   │   ├── auth/
│   │   │   ├── login/route.ts         # POST: Login
│   │   │   ├── logout/route.ts        # POST: Logout
│   │   │   └── me/route.ts            # GET: Usuario actual
│   │   ├── productos/route.ts         # CRUD productos
│   │   ├── categorias/route.ts        # CRUD categorías
│   │   ├── movimientos/route.ts       # CRUD movimientos
│   │   ├── usuarios/route.ts          # CRUD usuarios
│   │   └── dashboard/route.ts         # Estadísticas
│   ├── layout.tsx                     # Layout raíz
│   ├── page.tsx                       # Home → redirige a login o dashboard
│   └── globals.css
├── components/
│   ├── ui/                            # Componentes reutilizables (Shadcn)
│   ├── products-table.tsx             # Tabla de productos
│   ├── categories-table.tsx           # Tabla de categorías
│   ├── movements-table.tsx            # Tabla de movimientos
│   ├── users-table.tsx                # Tabla de usuarios
│   ├── dashboard-cards.tsx            # Tarjetas de estadísticas
│   ├── dashboard-chart.tsx            # Gráficos
│   ├── login-form.tsx                 # Formulario login
│   │── app-sidebar.tsx                # Barra lateral
│   └── theme-provider.tsx             # Proveedor de tema
├── lib/
│   ├── types.ts                       # Interfaces y tipos
│   ├── auth.ts                        # Autenticación y sesiones
│   ├── data-store.ts                  # Almacenamiento en memoria (ACTUAL)
│   │                                   # ➜ Será reemplazado por Prisma + BD
│   ├── fetcher.ts                     # Cliente HTTP (SWR)
│   └── utils.ts                       # Utilidades
├── hooks/
│   ├── use-mobile.ts                  # Hook para detectar mobile
│   └── use-toast.ts                   # Hook para notificaciones
├── public/                            # Archivos estáticos
├── .env.local.example                 # Plantilla de variables (NUEVO)
├── .env.example                       # Plantilla variables globales (NUEVO)
├── .gitignore                         # Actualizado (NUEVO)
├── package.json                       # Dependencias
├── tsconfig.json                      # Config TypeScript
├── next.config.mjs                    # Config Next.js (CORREGIDO)
└── README.md                          # Este archivo
```

---

## 🔐 Credenciales de Prueba

En desarrollo, puedes usar estas cuentas de prueba:

| Rol | Email | Contraseña | Permisos |
|-----|-------|-----------|----------|
| 👨‍💼 Administrador | `admin@stock.com` | `admin123` | Acceso total |
| 📊 Vendedor | `vendedor@stock.com` | `vendedor123` | Ver datos, crear movimientos |

> **⚠️ Seguridad:** Estas credenciales están en el código de demostración. En producción, **DEBE usar contraseñas fuertes y encriptadas**. Ver sección de [Mejoras de Seguridad](#mejoras-de-seguridad-para-producción).

---

## 🔒 Mejoras de Seguridad para Producción

Este proyecto está listo para desarrollo, pero necesita estas mejoras **antes de producción**:

### 1. Encriptación de Contraseñas

Instalar bcrypt:
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

Actualizar `lib/auth.ts` para hashear contraseñas:
```typescript
import bcrypt from 'bcryptjs'

// Al crear/actualizar usuario:
const hashedPassword = await bcrypt.hash(password, 10)

// Al verificar contraseña:
const isValid = await bcrypt.compare(inputPassword, hashedPassword)
```

### 2. Variables de Entorno Seguras

Crear `.env.production`:
```bash
NODE_ENV=production
SESSION_SECRET=tu-clave-32-caracteres-aleatoria-aqui
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
```

### 3. Rate Limiting para Login

Instalar librería:
```bash
npm install express-rate-limit
```

Implementar en `app/api/auth/login/route.ts` para evitar fuerza bruta.

### 4. CSRF Protection

Instalar:
```bash
npm install csrf
```

Validar tokens CSRF en formularios POST.

### 5. Validación de Entrada

Ya está incluido `zod`. Usar en todos los endpoints:
```typescript
import { z } from 'zod'

const ProductSchema = z.object({
  nombre: z.string().min(3).max(255),
  precio: z.number().positive(),
  stock: z.number().int().nonnegative(),
})

const validated = ProductSchema.parse(body)
```

---

## 🧪 Solución de Problemas

### Error: "Cannot find module 'X'"

```bash
# Solución: reinstalar dependencias
npm install
# o
pnpm install
```

### Error: "Port 3000 already in use"

```bash
# En Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### Error: "Database connection refused"

- ✓ Verifica que PostgreSQL/MySQL esté corriendo
- ✓ Verifica la `DATABASE_URL` en `.env.local`
- ✓ Usuario y contraseña sean correctos
- ✓ La base de datos exista

### Error: "TypeError: Cannot read property 'password' of undefined"

Asegúrate de que `.env.local` existe y `SESSION_SECRET` está definido.

### Los datos desaparecen después de reiniciar

Es normal con datos en memoria. Esto se resuelve con una base de datos persistente (PostgreSQL, MySQL, etc.).

---

## 📚 Recursos Útiles

- 📖 [Documentación Next.js 16](https://nextjs.org/docs)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🔍 [TypeScript](https://www.typescriptlang.org/)
- 🐘 [PostgreSQL](https://www.postgresql.org/)
- 🗄️ [Prisma ORM](https://www.prisma.io/)
- 🛡️ [OWASP Web Security](https://owasp.org/)

---

## 📝 Licencia

Este proyecto es de código abierto. Úsalo libremente para aprender y desarrollar.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

**¿Preguntas?** Abre un Issue en GitHub.

**Última actualización:** Marzo 2026

