# 📘 Stack Tecnológico - Sistema de Gestión Universitaria

Documentación completa del backend, justificación técnica y arquitectura implementada.

---

## 📋 Tabla de Contenidos

1. [Stack Principal](#1-stack-principal)
2. [Base de Datos](#2-base-de-datos)
3. [Arquitectura API](#3-arquitectura-api)
4. [Seguridad Multi-Capa](#4-seguridad-multi-capa)
5. [Sistema de Correos](#5-sistema-de-correos)
6. [Control de Versiones](#6-control-de-versiones)
7. [Paquetes Instalados](#7-paquetes-instalados)

---

## 1. Stack Principal

### Framework: NestJS + TypeScript

```
┌─────────────────────────────────────────────────────────────┐
│  NESTJS ARCHITECTURE                                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Controllers │──│  Services   │──│ Repositories│         │
│  │(@Controller)│  │(@Injectable)│  │  (TypeORM)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                      │                                       │
│              ┌─────────────┐                                 │
│              │   Modules   │                                 │
│              │  (@Module)  │                                 │
│              └─────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

**¿Por qué NestJS?**

| Característica | Beneficio |
|---------------|-----------|
| **Arquitectura Angular-like** | Decoradores claros (`@Controller`, `@Service`, `@Module`) facilitan organización |
| **Inyección de dependencias** | Testing más fácil, código desacoplado |
| **Ecosistema robusto** | Integración oficial con TypeORM, Swagger, Passport |
| **TypeScript first** | Tipado estricto previene errores en compilación |
| **Escalabilidad** | Usado por Adidas, Capgemini, Deutsche Bank para apps críticas |

**¿Por qué TypeScript vs JavaScript?**

- ✅ **Type safety**: Errores detectados antes de ejecutar (crítico para datos financieros)
- ✅ **Autocompletado IDE**: Desarrollo más rápido con IntelliSense
- ✅ **Refactoring seguro**: Renombrar variables sin romper código
- ✅ **Documentación implícita**: Los tipos documentan qué datos espera cada función

---

## 2. Base de Datos

### PostgreSQL + TypeORM + Supabase

**¿Por qué Supabase?**

| Característica | Beneficio para el proyecto |
|----------------|---------------------------|
| **PostgreSQL administrado** | No necesito configurar ni mantener servidores de base de datos |
| **Escalabilidad automática** | Crece automáticamente con la demanda de la universidad |
| **Seguridad integrada** | Encriptación en reposo y en tránsito, backups automáticos |
| **API REST automática** | Supabase genera API REST directamente de las tablas |
| **Autenticación incluida** | Auth integrado con Row Level Security (RLS) |
| **Real-time subscriptions** | Notificaciones en tiempo real para el sistema |

**¿Por qué PostgreSQL en Supabase?**

| Característica | Beneficio para el proyecto |
|----------------|---------------------------|
| **ACID Compliance** | Garantiza integridad en pagos, matrículas, calificaciones |
| **JSON Support** | Campos flexibles para metadata de notificaciones |
| **Full-Text Search** | Búsqueda eficiente en nombres de estudiantes |
| **Concurrent Connections** | Soporta miles de estudiantes simultáneos |
| **Extensibilidad** | UUID nativo para IDs seguros |

**¿Por qué TypeORM?**

```
TypeORM vs Sequelize:

TypeORM:                    Sequelize:
@Entity()                   model.define()
@Column()                   type: DataTypes.STRING
@ManyToOne() → Decoradores  belongsTo() → API verbosa
@JoinColumn()               foreignKey: 'user_id'

MIGRACIONES AUTOMÁTICAS:
typeorm migration:generate   vs   Manual o CLI limitada
```

**Configuración:**

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
})
```

**Variables .env:**
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password_seguro
DB_NAME=universidad_db
```

---

## 3. Arquitectura API

### Diseño Modular

```
src/
├── common/
│   ├── asesoramiento/          # Módulo de asesoramiento
│   ├── notificaciones/         # Módulo de notificaciones
│   ├── usuarios/               # Módulo de usuarios
│   ├── mail/                   # Módulo de correos
│   └── ...
├── app.module.ts               # Módulo raíz
└── main.ts                     # Bootstrap
```

### Controladores REST

```typescript
@Controller('api/v1/usuarios')
export class UsuariosController {
  
  @Post()                        // POST /api/v1/usuarios
  create(@Body() dto: CreateUsuarioDto) {}
  
  @Get(':id')                    // GET /api/v1/usuarios/:id
  findOne(@Param('id') id: string) {}
  
  @Patch(':id/status')           // PATCH /api/v1/usuarios/:id/status
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {}
}
```

### Documentación Swagger

```typescript
const config = new DocumentBuilder()
  .setTitle('Plataforma Educativa')
  .setDescription('API para gestión administrativa y académica')
  .setVersion('1.0')
  .addBearerAuth()              // JWT en documentación
  .build();
```

---

## 4. Seguridad Multi-Capa

### Capa 1: Helmet.js (Cabeceras HTTP)

```typescript
import helmet from 'helmet';
app.use(helmet());
```

| Cabecera | Protección contra |
|----------|-------------------|
| `Content-Security-Policy` | XSS (Cross-Site Scripting) |
| `X-Frame-Options` | Clickjacking |
| `X-Content-Type-Options` | MIME sniffing |
| `Strict-Transport-Security` | Man-in-the-middle |
| `Referrer-Policy` | Fuga de información |

### Capa 2: CORS

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
});
```

### Capa 3: Validación de Datos (ValidationPipe)

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,        // Elimina propiedades no definidas en DTOs
    transform: true,        // Transforma tipos automáticamente
    disableErrorMessages: false,
  }),
);
```

**DTO con validaciones:**
```typescript
export class CreateUsuarioDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsEmail()
  correoPersonal: string;

  @IsEnum(['estudiante', 'profesor', 'administrador'])
  rol: string;
}
```

### Capa 4: Autenticación JWT

**Flujo:**
```
1. Login: POST /auth/login → { email, password }
2. Validación: bcrypt.compare() contra hash en BD
3. Token: JWT.sign({ userId, rol }, SECRET, { expiresIn: '24h' })
4. Cliente: Guarda token en localStorage
5. Requests: Header "Authorization: Bearer <token>"
6. Verificación: JwtStrategy valida firma y expiración
```

**¿Por qué JWT vs Sesiones?**
- ✅ Stateless: No almacena sesiones en servidor (escala horizontal)
- ✅ Decentralizado: Cualquier instancia valida el token
- ✅ Cross-domain: Funciona con múltiples subdominios
- ✅ Mobile-ready: Fácil de manejar en apps móviles

### Capa 5: Manejo de Errores Global

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // No expone stack traces en producción
    // Logs detallados para debugging
    // Respuesta consistente al cliente
  }
}
```

---

## 5. Sistema de Correos

### Stack: Nodemailer + Gmail SMTP

```
┌──────────────────────────────────────────────────────────────┐
│                    FLUJO DE EMAIL                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   UsuarioService          MailService          Gmail SMTP   │
│        │                       │                     │        │
│   APROBAR ─────────────▶ enviarCredenciales() ──▶ smtp.send │
│        │                       │                     │        │
│        │              ┌────────┴────────┐            │        │
│        │              │  Template HTML  │            │        │
│        │              │  Responsive     │            │        │
│        │              │  Estilo Univ.   │            │        │
│        │              └─────────────────┘            │        │
│        ◀────────────────────── ◀─────────────────────◀        │
│    Usuario recibe email con                                   │
│    - Correo institucional                                     │
│    - Contraseña temporal                                      │
│    - Link de acceso                                           │
└──────────────────────────────────────────────────────────────┘
```

**Configuración:**
```typescript
private transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,              // STARTTLS
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,  // 16 chars
  },
});
```

**¿Por qué App Password?**
1. Google desactivó "acceso de apps menos seguras" en 2022
2. App Password = token único de 16 caracteres
3. Requiere 2FA: Doble capa de seguridad
4. Revocable sin afectar contraseña principal

**Casos de uso:**
- `enviarCredenciales()`: Admin aprueba solicitud
- `enviarRechazo()`: Admin rechaza con motivo
- `enviarNotificacion()`: Envío masivo a usuarios

---

## 6. Control de Versiones

### Estrategia de Ramas (Git)

```
main (producción)
  │
  ├── develop (integración)
  │     │
  │     ├── feature/notificaciones-modales
  │     ├── feature/asesoramiento-crud
  │     └── feature/pagos-stripe
  │
  └── hotfix/seguridad-helmet
```

**Convenciones:**
- `main`: Solo código probado
- `develop`: Integración de features
- `feature/*`: Una rama por funcionalidad
- Commits semánticos: `feat:`, `fix:`, `docs:`, `refactor:`

### .gitignore

```
# Dependencies
/node_modules

# Environment
.env
.env.local
.env.production

# Build
/dist
/build

# Logs
*.log
```

---

## 7. Paquetes Instalados

### Core Framework
```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express
npm install @nestjs/cli --save-dev
```

### Base de Datos
```bash
npm install @nestjs/typeorm typeorm pg bcrypt
```

### Seguridad
```bash
npm install helmet @nestjs/passport passport-jwt jsonwebtoken
npm install class-validator class-transformer
```

### Documentación
```bash
npm install @nestjs/swagger
```

### Email
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Utilidades
```bash
npm install dotenv reflect-metadata rxjs
```

---

## 🎯 Resumen Ejecutivo

> **"He construido el backend sobre NestJS y TypeScript porque necesito una arquitectura empresarial que escale con la universidad. PostgreSQL garantiza integridad ACID para datos financieros de matrículas y pagos. TypeORM permite modelar relaciones complejas (estudiantes-cursos-matrículas) con código limpio.**
>
> **La seguridad es multi-capa: Helmet protege contra XSS y clickjacking, CORS restringe orígenes de requests, ValidationPipe sanitiza entradas para prevenir inyección, y JWT maneja autenticación stateless que escala horizontalmente.**
>
> **Para correos, Nodemailer con Gmail SMTP ofrece entregabilidad confiable sin costos de terceros. Cuando un admin aprueba un estudiante, el sistema genera automáticamente su correo @universidad.edu, crea contraseña temporal con bcrypt, y envía credenciales vía template HTML profesional.**
>
> **Todo está versionado en Git con estrategia de ramas, y las credenciales sensibles nunca tocan el código fuente gracias a variables de entorno."**

---

## 8. Frontend Stack

### React 18 + TypeScript + Vite

```
┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND ARCHITECTURE                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│   │   Pages     │    │ Components  │    │    Store    │     │
│   │  (Routes)   │◄───│  (Reusable) │◄───│  (Zustand)  │     │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│          │                   │                   │           │
│          └───────────────────┴───────────────────┘           │
│                              │                               │
│                    ┌─────────┴─────────┐                     │
│                    │     Services      │                     │
│                    │   (API Calls)     │                     │
│                    └─────────┬─────────┘                     │
│                              │                               │
│                    ┌─────────┴─────────┐                     │
│                    │   Backend API     │                     │
│                    │   (NestJS)        │                     │
│                    └───────────────────┘                     │
└──────────────────────────────────────────────────────────────┘
```

### 8.1 Core Technologies

#### **React 18**

**¿Por qué React?**

| Característica | Beneficio para el proyecto |
|----------------|---------------------------|
| **Component-based** | UI modular (NotificacionesModal, Navbar, Cards reutilizables) |
| **Virtual DOM** | Rendimiento óptimo con actualizaciones eficientes |
| **Hooks** | `useState`, `useEffect` para lógica limpia sin clases |
| **Huge ecosystem** | Librerías disponibles para cualquier necesidad |
| **Concurrent Features** | React 18 permite interrupción de renderizado para UX fluida |

**¿Por qué no Vue o Angular?**
- React tiene mayor adopción en el mercado laboral
- Flexibilidad total en arquitectura (no impone patrones rígidos)
- Integración perfecta con TypeScript
- Comunidad más grande = más recursos y soluciones

---

#### **TypeScript**

```typescript
// Ejemplo: Tipado estricto en el proyecto
interface Notificacion {
  id: string;
  titulo: string;
  tipo: 'solicitud' | 'pago' | 'ticket' | 'asesoramiento';
  estado: 'pendiente' | 'leida';
  entidadTipo?: string;
  entidadId?: string;
}

// Autocompletado y detección de errores en tiempo de desarrollo
const handleNotificacionClick = (notif: Notificacion) => {
  if (notif.entidadTipo === 'asesoramiento') {
    navigate(`/admin/asesoramiento/${notif.entidadId}`);
  }
};
```

**Beneficios en el frontend:**
- ✅ Props tipadas: Evita pasar datos incorrectos a componentes
- ✅ Autocompletado IDE: Desarrollo más rápido, menos errores
- ✅ Refactoring seguro: Cambiar interfaces sin romper la app
- ✅ Documentación viva: Los tipos describen la estructura de datos

---

#### **Vite (Build Tool)**

**¿Por qué Vite vs Create React App?**

| Aspecto | Vite | CRA |
|---------|------|-----|
| **Dev server startup** | ~300ms | ~30s |
| **HMR (Hot Module Replacement)** | Instantáneo | ~2-3s |
| **Build time** | 3x más rápido | Lento |
| **Configuración** | Flexible con plugins | Limitada, eject necesario |

**Beneficios para desarrollo ágil:**
- Server inicia en milisegundos, no segundos
- Cambios en código se reflejan instantáneamente (crítico para iterar en UI)
- Optimización automática de build para producción
- Soporte nativo para TypeScript sin configuración adicional

---

### 8.2 Estilos y UI

#### **TailwindCSS**

**¿Por qué Tailwind vs CSS tradicional / Bootstrap?**

```jsx
// Con Tailwind: Código autodescriptivo y mantenible
<div className="flex items-center gap-3 px-4 py-3 rounded-lg 
                bg-indigo-600 text-white shadow-lg 
                hover:bg-indigo-700 transition-all duration-200">
  <Bell size={20} />
  <span className="font-medium">Notificaciones</span>
</div>

// VS CSS tradicional (múltiples archivos, clases globales, especificidad wars)
// VS Bootstrap (limitado, todos los sitios se ven iguales)
```

**Ventajas para este proyecto:**
- **Utility-first**: Estilos inline sin salir del archivo JSX
- **Diseño consistente**: Sistema de spacing/colors predefinido
- **Responsive**: Prefijos `sm:`, `md:`, `lg:` para breakpoints
- **Tree-shaking**: Solo incluye CSS que realmente usas
- **Dark mode ready**: Fácil implementación de temas

---

### 8.3 Gestión de Estado

#### **Zustand**

```typescript
// store/notificacionesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificacionesState {
  notificaciones: Notificacion[];
  contadorPendientes: number;
  cargarNotificaciones: () => Promise<void>;
  marcarComoLeida: (id: string) => Promise<void>;
}

export const useNotificacionesStore = create<NotificacionesState>()(
  persist(
    (set, get) => ({
      notificaciones: [],
      contadorPendientes: 0,
      cargarNotificaciones: async () => {
        const response = await notificacionesApi.obtenerTodas();
        set({ 
          notificaciones: response.data,
          contadorPendientes: response.data.filter(n => n.estado === 'pendiente').length
        });
      },
      // ... más acciones
    }),
    { name: 'notificaciones-storage' }
  )
);
```

**¿Por qué Zustand vs Redux / Context API?**

| Aspecto | Zustand | Redux | Context API |
|---------|---------|-------|-------------|
| **Boilerplate** | Mínimo | Mucho | Moderado |
| **Rendimiento** | Óptimo | Bueno | Pobre con muchos consumers |
| **DevTools** | Integrado | Redux DevTools | Ninguno |
| **Persistencia** | Middleware nativo | redux-persist | Manual |
| **TypeScript** | Excelente | Verboso | Moderado |

**Beneficios específicos:**
- **Persist automático**: `notificaciones-storage` guarda en localStorage
- **Selectors**: Componentes solo se re-renderizan cuando cambia lo que usan
- **Acciones asíncronas**: Llamadas API integradas en el store
- **Múltiples stores**: `authStore`, `notificacionesStore` separados y enfocados

---

### 8.4 Navegación y Routing

#### **React Router v6**

```typescript
// App.tsx - Configuración de rutas
<BrowserRouter>
  <Routes>
    {/* Landing */}
    <Route path="/" element={<Landing />} />
    
    {/* Auth */}
    <Route path="/login" element={<Login />} />
    <Route path="/solicitar-cuenta" element={<SolicitarCuenta />} />
    
    {/* Admin con Layout protegido */}
    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="usuarios" element={<Usuarios />} />
      <Route path="asesoramiento/:id" element={<AsesoramientoDetail />} />
      <Route path="notificaciones" element={<NotificacionesPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Características implementadas:**
- **Nested routes**: `/admin/*` comparte layout (sidebar, navbar)
- **Protected routes**: Verificación JWT antes de renderizar
- **Dynamic params**: `:id` en rutas de detalle (asesoramiento, usuarios)
- **Programmatic navigation**: `useNavigate()` para redirecciones post-login
- **Route guards**: Redirección automática si no está autenticado

**¿Por qué React Router vs Next.js routing?**
- Client-side navigation sin recargas (SPA experience)
- Control total sobre la estructura de rutas
- Compatible con Vite (Next.js requiere su propio framework)

---

### 8.5 Comunicación con Backend

#### **Axios + Interceptors**

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3003',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Añade token JWT a cada request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**¿Por qué Axios vs Fetch API?**

| Característica | Axios | Fetch API |
|----------------|-------|-----------|
| **Interceptores** | ✅ Nativos | ❌ Manual |
| **Timeout** | ✅ Config simple | ❌ AbortController |
| **Transformación** | ✅ Request/response transform | ❌ Manual |
| **Cancelación** | ✅ CancelToken | ⚠️ AbortController |
| **IE11** | ✅ Soportado | ❌ No |
| **TypeScript** | ✅ Tipos completos | ⚠️ Genericos manuales |

**Ventajas en el proyecto:**
- Base URL configurada una vez (DRY)
- Token JWT añadido automáticamente a cada request
- Refresh de token implementable en interceptor de respuesta
- Manejo global de errores (404, 401, 500) en un solo lugar

---

### 8.6 Iconos y Componentes UI

#### **Lucide React**

```jsx
import { Bell, LayoutDashboard, Users, BookOpen, LogOut } from 'lucide-react';

// Iconos consistentes en todo el sistema
<nav>
  <Link to="/admin/dashboard">
    <LayoutDashboard size={20} /> Dashboard
  </Link>
  <Link to="/admin/usuarios">
    <Users size={20} /> Usuarios
  </Link>
</nav>
```

**¿Por qué Lucide vs FontAwesome / Material Icons?**
- **SVG puros**: Sin dependencias de fuentes, carga más rápida
- **Tree-shakeable**: Solo incluye iconos que usas
- **TypeScript**: Tipado completo de props (size, color, strokeWidth)
- **Moderno**: Diseño limpio, líneas finas, estética profesional

---

### 8.7 Estructura de Carpetas

```
src/
├── api/                    # Configuración Axios + interceptores
├── components/             # Componentes reutilizables
│   ├── admin/             # Componentes específicos admin
│   │   ├── NotificacionesModal.tsx
│   │   ├── UserTable.tsx
│   │   └── Sidebar.tsx
│   ├── landing/           # Componentes landing page
│   └── ui/                # Componentes genéricos (Button, Card)
├── hooks/                 # Custom hooks
│   └── useToast.tsx       # Notificaciones toast
├── layouts/               # Layouts de página
├── pages/                 # Páginas/Routes
│   ├── admin/
│   │   ├── adminLayout.tsx
│   │   ├── Dashboard.tsx
│   │   └── AsesoramientoDetailPage.tsx
│   └── Landing.tsx
├── services/              # Llamadas a API organizadas por dominio
│   ├── notificaciones.service.ts
│   ├── usuarios.service.ts
│   └── auth.service.ts
├── store/                 # Estado global Zustand
│   ├── authStore.ts
│   └── notificacionesStore.ts
└── types/                 # Tipos TypeScript compartidos
```

**¿Por qué esta estructura?**
- **Separación de responsabilidades**: UI (components) ≠ Lógica de negocio (services) ≠ Estado (store)
- **Feature-based**: Módulos organizados por funcionalidad, no por tipo de archivo
- **Escalable**: Agregar nuevas features no mezcla código con features existentes
- **Colocation**: Archivos relacionados cercanos (component + service + types)

---

### 8.8 Gestión de Formularios

#### **React Hook Form (si aplica)**

Si implementas formularios complejos:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  nombre: z.string().min(2, 'Nombre mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

**Beneficios:**
- Validación declarativa con Zod
- Performance: Solo re-renderiza campos que cambian
- Menos boilerplate vs formularios controlados manuales

---

### 8.9 Manejo de Errores y UX

#### **React Error Boundaries**

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log a servicio de monitoreo
    console.error('Error capturado:', error);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

#### **Loading States y Skeletons**

```jsx
// UX fluida mientras carga data
{isLoading ? (
  <SkeletonCard />
) : (
  <UserCard user={user} />
)}
```

---

### 8.10 Optimizaciones de Performance

#### **React.memo**

```typescript
// Evita re-renders innecesarios de componentes pesados
export const NotificacionesModal = React.memo(() => {
  // Solo re-renderiza si props cambian
});
```

#### **Lazy Loading**

```typescript
// Carga código bajo demanda
const AdminLayout = lazy(() => import('./pages/admin/adminLayout'));

<Suspense fallback={<Spinner />}>
  <AdminLayout />
</Suspense>
```

---

### 8.11 Paquetes Instalados (Frontend)

#### Core
```bash
npm install react react-dom
npm install @types/react @types/react-dom --save-dev
npm install typescript
npm install vite @vitejs/plugin-react --save-dev
```

#### Routing y Estado
```bash
npm install react-router-dom
npm install zustand
```

#### Estilos
```bash
npm install tailwindcss postcss autoprefixer --save-dev
npx tailwindcss init -p  # Genera tailwind.config.js
```

#### Comunicación API
```bash
npm install axios
```

#### UI y Iconos
```bash
npm install lucide-react
npm install clsx tailwind-merge  # Utilidades para clases dinámicas
```

#### Formularios (opcional)
```bash
npm install react-hook-form
npm install zod @hookform/resolvers
```

#### Utilidades
```bash
npm install date-fns  # Formato de fechas (tiempoRelativo)
npm install clsx      # Concatenación de clases condicionales
```

---

## 🎯 Resumen Ejecutivo Frontend

> **"El frontend está construido sobre React 18 con TypeScript para type safety completo. Vite proporciona desarrollo ultra-rápido con HMR instantáneo, crítico para iterar en componentes UI. TailwindCSS permite crear interfaces modernas y consistentes sin salir del código, mientras que Zustand maneja el estado global con mínimo boilerplate y persistencia automática.**
>
> **React Router v6 maneja la navegación SPA con rutas protegidas por JWT y nested routes para el panel admin. Axios con interceptores centraliza la comunicación con el backend, añadiendo tokens automáticamente y manejando errores globalmente. Lucide React proporciona iconos SVG consistentes en toda la aplicación.**
>
> **La estructura de carpetas está organizada por feature (admin, landing, components) facilitando el mantenimiento y la escalabilidad. Cada capa tiene su responsabilidad clara: components para UI, services para API, store para estado, y types para contratos de datos compartidos con el backend."**

---

**Proyecto:** Sistema de Gestión Universitaria  
**Versión:** 1.0  
**Última actualización:** Abril 2026
