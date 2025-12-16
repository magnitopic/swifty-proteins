# API de Autenticación - Endpoints

## Base URL
`/api/v1/auth`

---

## 📝 Registro de Usuario

### `POST /register`

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "created_at": "2025-12-16T15:30:00.000Z"
  }
}
```

**Errores:**
- `400`: Datos de validación incorrectos
- `409`: El usuario ya existe (email o username duplicado)
- `500`: Error del servidor

---

## 🔐 Login de Usuario

### `POST /login`

Autentica un usuario y devuelve tokens de acceso y refresco.

**Request Body:**
```json
{
  "username": "username",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "User logged in successfully.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "created_at": "2025-12-16T15:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `400`: Datos de validación incorrectos
- `401`: Username o contraseña inválidos
- `500`: Error del servidor

**Nota:** 
- **Access Token**: Expira en 15 minutos (configurable con `JWT_ACCESS_EXPIRATION`)
- **Refresh Token**: Expira en 7 días (configurable con `JWT_REFRESH_EXPIRATION`)

---

## 🔄 Renovar Access Token

### `POST /refresh-token`

Genera un nuevo access token usando un refresh token válido.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "message": "Access token refreshed successfully.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `400`: Refresh token no proporcionado
- `401`: Refresh token inválido o expirado
- `500`: Error del servidor

---

## 🔑 Uso de los Tokens

### Access Token
Para acceder a endpoints protegidos, incluye el access token en el header de autorización:

```
Authorization: Bearer <accessToken>
```

**Payload del Access Token:**
```json
{
  "_id": "user-uuid",
  "username": "username",
  "email": "user@example.com",
  "exp": 1234567890
}
```

### Refresh Token
El refresh token se almacena en la base de datos y debe guardarse de forma segura en el cliente (NO en localStorage para mayor seguridad, preferiblemente en httpOnly cookies o secure storage).

**Payload del Refresh Token:**
```json
{
  "_id": "user-uuid",
  "username": "username",
  "exp": 1234567890
}
```

---

## 🛡️ Middleware de Validación

Todos los endpoints usan validación Zod para garantizar la integridad de los datos:

### Register Schema
- `email`: Debe ser un email válido
- `username`: 3-20 caracteres, solo letras, números, guiones
- `password`: Mínimo 6 caracteres, debe contener mayúscula, minúscula y número

### Login Schema
- `username`: 3-20 caracteres, solo letras, números, guiones
- `password`: Requerido

### Refresh Token Schema
- `refreshToken`: Requerido, no puede estar vacío

---

## ⚙️ Variables de Entorno

Asegúrate de tener estas variables configuradas en tu `.env`:

```bash
# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

**IMPORTANTE:** 
- Usa secretos diferentes para access y refresh tokens
- Cambia estos valores en producción
- El formato de expiración acepta:
  - `15m` = 15 minutos
  - `7d` = 7 días
  - `24h` = 24 horas
  - `1y` = 1 año

---

## 📋 Ejemplo de Flujo Completo

### 1. Registrar usuario
```bash
curl -X POST http://localhost:9000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:9000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123"
  }'
```

**Respuesta:**
```json
{
  "message": "User logged in successfully.",
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 3. Usar access token
```bash
curl -X GET http://localhost:9000/api/v1/protected-endpoint \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Renovar access token cuando expire
```bash
curl -X POST http://localhost:9000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 🔒 Arquitectura de Seguridad

### Access Token (Corta duración)
- ✅ Expira rápido (15 min)
- ✅ Se envía en cada request
- ✅ Almacenado en memoria del cliente
- ✅ Si es comprometido, expira pronto

### Refresh Token (Larga duración)
- ✅ Expira en días/semanas
- ✅ Se almacena en la base de datos
- ✅ Solo se usa para renovar access tokens
- ✅ Puede ser revocado desde el servidor

### Flujo de Seguridad
1. Usuario hace login → Recibe ambos tokens
2. Cliente usa **access token** para requests
3. Access token expira → Cliente usa **refresh token**
4. Servidor valida refresh token en DB → Genera nuevo access token
5. Si refresh token es inválido → Usuario debe hacer login de nuevo

---

## 🗄️ Base de Datos

La tabla `users` incluye la columna `refresh_token`:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Notas:**
- El refresh token se actualiza en cada login
- Un usuario solo puede tener un refresh token activo
- Para logout, se debe limpiar el refresh token de la DB
