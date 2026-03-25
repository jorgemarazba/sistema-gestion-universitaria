# 🎯 Flujo Implementado: Solicitudes de Estudiantes

## 📋 Tabla de Contenidos
1. [Descripción del Flujo](#descripción-del-flujo)
2. [Configuración Requerida](#configuración-requerida)
3. [Endpoints del API](#endpoints-del-api)
4. [Flujo Técnico](#flujo-técnico)
5. [Pruebas](#pruebas)
6. [Troubleshooting](#troubleshooting)

---

## 📌 Descripción del Flujo

### Actor: Estudiante
1. **Llena formulario** con datos personales (nombre, apellido, documento, correo personal, tipo de usuario)
2. **Se crea registro** en la BD con estado: `'pendiente'`
3. Sistema **almacena solicitud** para posterior revisión del admin

### Actor: Admin
1. **Ve notificación** en el Dashboard mostrando solicitudes pendientes
2. **Abre sección Solicitudes** para revisar lista de usuarios pendientes
3. **Evalúa si datos son verídicos**
4. **Presiona "Aprobar"** o **"Rechazar"**

### Sistema - Si Aprueba:
```
1. ✅ Genera correo institucional automáticamente
   Formato: nombre.apellido@universidad.edu
   
2. 🔐 Genera contraseña temporal aleatoria (12 caracteres)
   Incluye mayúsculas, minúsculas, números y símbolos
   Ejemplo: aB3$xYz@Qp9
   
3. 💾 Almacena contraseña hasheada en BD (bcrypt, 10 rondas)
   
4. 📧 Envía email automático al correo PERSONAL del estudiante con:
   - Correo institucional
   - Contraseña temporal
   - Link a la plataforma
   - Instrucciones de cambio de contraseña
   
5. 🎉 Actualiza estado a 'activo'
```

### Sistema - Si Rechaza:
```
1. ❌ Admin ingresa MOTIVO del rechazo (obligatorio)
   
2. 📧 Envía email de notificación al correo PERSONAL con:
   - Motivo específico del rechazo
   - Instrucciones para apelar o contactar soporte
   
3. 🗂️ Actualiza estado a 'rechazado' y guarda motivo en BD
```

---

## ⚙️ Configuración Requerida

### 1. Variables de Entorno (.env)

Copia el archivo `.env.example` a `.env` y completa:

```bash
cp .env.example .env
```

**Campos obligatorios para Email:**

```env
# Gmail Configuration
GMAIL_USER=tu_email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Frontend URL (para links en emails)
FRONTEND_URL=http://localhost:5173

# Institution
INSTITUTION_DOMAIN=universidad.edu
```

### 2. Obtener Contraseña de Aplicación Gmail

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Selecciona **Security** en el sidebar izquierdo
3. Habilita **2-Step Verification** (si aún no está activo)
4. Busca **App passwords**
5. Selecciona Mail y Windows Computer (o tu dispositivo)
6. Google te generará una contraseña de 16 caracteres
7. Copia esa contraseña en `GMAIL_APP_PASSWORD` (sin espacios o con espacios, ambos funcionan)

### 3. Base de Datos

El sistema usa las migraciones automáticas de TypeORM. Los campos nuevos agregados:

```sql
ALTER TABLE usuarios ADD COLUMN motivo_rechazo TEXT NULL;
ALTER TABLE usuarios ADD COLUMN fecha_aprobacion TIMESTAMP NULL;
```

**O si usas migrations automáticas:**
```bash
npm run typeorm migration:generate -- -n AddRejectionFields
npm run typeorm migration:run
```

---

## 📡 Endpoints del API

### Crear Solicitud (Público)
```
POST /api/v1/usuarios/solicitar-acceso

Body:
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "documento_identidad": "1234567890",
  "correo_personal": "juan@example.com",
  "tipo_usuario": "estudiante",
  "motivo": "Solicito acceso para cursar programación"
}

Response: 201 Created
{
  "id_usuario": "uuid-xxx",
  "nombre": "Juan",
  "estado": "pendiente",
  ...
}
```

### Obtener Solicitudes Pendientes (Admin)
```
GET /api/v1/usuarios/pendientes

Response: 200 OK
[
  {
    "id_usuario": "uuid-1",
    "nombre": "Juan",
    "apellido": "Pérez",
    "documentoIdentidad": "1234567890",
    "correoPersonal": "juan@example.com",
    "rol": "estudiante",
    "estado": "pendiente",
    "motivoSolicitud": "...",
    "fechaRegistro": "2026-03-24T..."
  },
  ...
]
```

### Aprobar Solicitud (Admin)
```
PATCH /api/v1/usuarios/:id/status

Body:
{
  "status": "activo"
}

Response: 200 OK
{
  "id_usuario": "uuid-1",
  "nombre": "Juan",
  "correoInstitucional": "juan.perez@universidad.edu",
  "estado": "activo",
  "fechaAprobacion": "2026-03-24T21:15:30.123Z"
  // Nota: contraseña NO se retorna por seguridad
}

Efectos secundarios:
- ✅ Contraseña temporal generada y hasheada
- 📧 Email enviado a juan@example.com
```

### Rechazar Solicitud (Admin)
```
PATCH /api/v1/usuarios/:id/status

Body:
{
  "status": "rechazado",
  "motivoRechazo": "Datos no verificados. Por favor contacte con admisiones."
}

Response: 200 OK
{
  "id_usuario": "uuid-1",
  "nombre": "Juan",
  "estado": "rechazado",
  "motivoRechazo": "Datos no verificados..."
}

Efectos secundarios:
- ❌ Estado actualizado
- 📧 Email de notificación enviado
```

---

## 🔄 Flujo Técnico Detallado

### 1. Frontend - Estudiante se Registra
**Archivo:** `frontend/src/pages/auth/SolicitudCuentaPage.tsx`
```typescript
// Usuario llena formulario
const formData = {
  nombre: "Juan",
  apellido: "Pérez",
  documento_identidad: "1234567890",
  correo_personal: "juan@example.com",
  tipo_usuario: "estudiante",
  motivo: "Solicito acceso..."
};

// Se envía al backend
await axios.post('/api/v1/usuarios/solicitar-acceso', formData);
```

### 2. Backend - Registra Solicitud
**Archivo:** `backend/src/common/usuarios/usuarios.service.ts`
```typescript
await registrarSolicitud(dto: CreateSolicitudDto) {
  // Valida que no exista ya
  // Crea registro con estado 'pendiente'
  // Retorna usuario creado
}
```

### 3. Frontend - Admin Ve Solicitudes
**Archivo:** `frontend/src/pages/admin/AdminDashboardPage.tsx`
```typescript
const { solicitudes } = await getPendingSolicitudes();
// Muestra tabla con botones "Aprobar" y "Rechazar"
```

### 4. Backend - Aprobación (Flujo Completo)
**Archivo:** `backend/src/common/usuarios/usuarios.service.ts`

```typescript
async updateStatus(id, status='activo') {
  // 1. Busca usuario
  usuario = await usuariosRepo.findOne(id);
  
  // 2. Llama a aprobarUsuario()
  
  // En aprobarUsuario():
  // ✅ Genera correo: juan.perez@universidad.edu
  // 🔐 Genera password: aB3$xYz@Qp9
  // 💾 Hashea y guarda en BD
  // 📧 Llama a mailService.enviarCredenciales()
  // 🎉 Actualiza estado a 'activo'
}
```

### 5. Mail Service - Envía Credenciales
**Archivo:** `backend/src/common/mail/mail.service.ts`

```typescript
async enviarCredenciales(
  correoPersonal: string,
  nombre: string,
  correoInstitucional: string,
  passwordTemporal: string
) {
  // Configura transportador SMTP de Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  // Genera HTML con template bonito
  const html = generateTemplateCredenciales(...);

  // Envía email
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: correoPersonal,
    subject: '🎉 ¡Bienvenido! Tus credenciales...',
    html: html
  });
}
```

### 6. Utilidades
**Archivo:** `backend/src/common/utils/password.utils.ts`

```typescript
// Generar contraseña temporal
generarContrasenaTemporal(length = 12)
// Retorna: "aB3$xYz@Qp9"

// Generar correo institucional
generarCorreoInstitucional(nombre, apellido, dominio)
// Retorna: "juan.perez@universidad.edu"
```

---

## 🧪 Pruebas

### Test 1: Crear Solicitud
```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Test
curl -X POST http://localhost:3000/api/v1/usuarios/solicitar-acceso \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "documento_identidad": "12345",
    "correo_personal": "juan@test.com",
    "tipo_usuario": "estudiante",
    "motivo": "Test solicitud"
  }'

# Respuesta esperada: 201 Created con id_usuario
```

### Test 2: Ver Solicitudes en Admin
```bash
# Frontend
http://localhost:5173/admin/dashboard

# Verifica:
✅ Tabla de solicitudes pendientes visible
✅ Botones "Aprobar" y "Rechazar" presentes
✅ Datos coinciden con los creados
```

### Test 3: Aprobar Solicitud
```bash
curl -X PATCH http://localhost:3000/api/v1/usuarios/UUID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "activo"}'

# Verifica en servidor:
✅ Logs muestren: "✅ Usuario aprobado: UUID"
✅ Logs muestren: "📧 Correo generado: nombre.apellido@universidad.edu"
✅ Logs muestren: "✉️ Email de credenciales enviado a..."

# Verifica en Gmail:
✅ Email recibido en correo personal
✅ Template HTML bonito
✅ Credenciales incluidas
```

### Test 4: Rechazar Solicitud
```bash
curl -X PATCH http://localhost:3000/api/v1/usuarios/UUID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rechazado",
    "motivoRechazo": "Datos no verificados"
  }'

# Verifica:
✅ Email de rechazo recibido
✅ Motivo mostrado en el email
```

---

## 🔧 Troubleshooting

### "Cannot find module 'nodemailer'"
```bash
cd backend
npm install nodemailer @types/nodemailer bcrypt @types/bcrypt
npm run build
```

### "Gmail authentication failed"
**Posibles causas:**
1. Variables de entorno no configuradas correctamente
2. Contraseña de app incorrecta (verifica en Google Account)
3. 2-Step Verification no habilitada en Google
4. Intentos fallidos bloquearon el acceso (~5 min)

**Solución:**
```bash
# 1. Verifica .env
cat .env | grep GMAIL

# 2. Regenera contraseña en Google Account
myaccount.google.com → Security → App passwords

# 3. Reinicia backend
npm run start:dev
```

### "Email no se envía"
**En backend console:**
```
❌ Error al enviar email: [error details]
```

**Soluciones:**
1. Verifica que las variables de entorno estén cargadas
2. Verifica logs detallados del error
3. Conectividad a smtp.gmail.com:587
4. Firewall/VPN puede bloquear SMTP

### Migración de BD falla
Si gets este error al iniciar:
```
ERROR [TypeOrmModule] Unable to connect to the database
```

**Solución:**
```bash
# 1. Verifica credentials en .env
# 2. Reinicia PostgreSQL
# 3. Si usas SQLite:
rm database.sqlite
npm run start:dev # Creará nueva BD
```

---

## 📚 Archivos Modificados/Creados

### Nuevos Archivos:
- `backend/src/common/mail/mail.service.ts` - Servicio de envío de emails
- `backend/src/common/mail/mail.module.ts` - Módulo de mail
- `backend/src/common/utils/password.utils.ts` - Utilidades de contraseña
- `backend/.env.example` - Variables de entorno (referencia)

### Archivos Modificados:
- `backend/src/common/usuarios/usuarios.service.ts` - Lógica de aprobación/rechazo
- `backend/src/common/usuarios/usuarios.controller.ts` - Endpoint mejorado
- `backend/src/common/usuarios/usuarios.module.ts` - Importa MailModule
- `backend/src/common/usuarios/entities/usuario.entity.ts` - Campos nuevos

### Frontend (sin cambios necesarios):
- `frontend/src/pages/admin/AdminDashboardPage.tsx` - Ya soporta aprobación/rechazo
- `frontend/src/services/admin.service.ts` - Ya tiene updateUserStatus()

---

## 🎨 Personalización

### Cambiar Dominio del Correo
**Archivo:** `backend/src/common/usuarios/usuarios.service.ts`

```typescript
// Línea ~153
const correoInstitucional = generarCorreoInstitucional(
  usuario.nombre,
  usuario.apellido,
  'miinstitucion.edu'  // ← Cambiar aquí
);
```

### Cambiar Formato del Correo
**Archivo:** `backend/src/common/utils/password.utils.ts`

```typescript
// De: nombre.apellido@dominio.edu
// A: nombre_apellido@dominio.edu
export function generarCorreoInstitucional(nombre, apellido, dominio) {
  return `${nomalizarTexto(nombre)}_${normalizarTexto(apellido)}@${dominio}`;
}
```

### Cambiar Longitud de Contraseña
**Archivo:** `backend/src/common/usuarios/usuarios.service.ts`

```typescript
// De: 12 caracteres
// A: 16 caracteres
const passwordTemporal = generarContrasenaTemporal(16);
```

### Personalizar Templates de Email
**Archivo:** `backend/src/common/mail/mail.service.ts`

Edita los métodos:
- `generarTemplateCredenciales()` - Para aprobación
- `generarTemplateRechazo()` - Para rechazo

Modifica colores, textos, logos, fondos, etc.

---

## ✅ Checklist de Implementación

- [x] Instalar dependencias (nodemailer, bcrypt)
- [x] Crear servicio de mail con templates
- [x] Crear utilidades de contraseña
- [x] Actualizar entity Usuario con nuevos campos
- [x] Implementar lógica de aprobación
- [x] Implementar lógica de rechazo
- [x] Integrar MailService en UsuariosService
- [x] Crear .env.example
- [x] Compilación exitosa
- [ ] Pruebas end-to-end
- [ ] Pruebas de email (verificar credenciales en inbox)
- [ ] Deploy a producción

---

## 🚀 Próximos Pasos

1. **Configurar variables de entorno** (`backend/.env`)
2. **Reiniciar backend** con `npm run start:dev`
3. **Abrir frontend** en `http://localhost:5173`
4. **Crear una solicitud de prueba**
5. **Verificar en admin dashboard que aparece**
6. **Aprobar y verificar que se recibe email**
7. **Verificar que credenciales funcionan** al login

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa logs en terminal del backend (búsca 📧, ✅, ❌)
2. Verifica variables de entorno en `.env`
3. Habilita debug logging: `DEBUG=* npm run start:dev`
4. Revisa carpeta `logs/` si está configurada

---

**Implementación completada el 24 de marzo de 2026** 🎉
