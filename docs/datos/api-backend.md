---
title: API del backend
description: Endpoints de Strapi que usa BillyApp, verificados contra gcp-strapi-billy, con autenticación, parámetros y respuestas.
sidebar_label: API del backend
---

Base: `EXPO_PUBLIC_API_BASE_URL` (por defecto `https://billyadmin.oblicua.co/api`). Todas las llamadas pasan por `apiFetch`, salvo `/upload` ([Datos y estado](../arquitectura/datos-y-estado.md#cliente-http-apifetch)).

**Auth:** "Pública" = ruta con `auth: false`. "JWT" = `Authorization: Bearer <JWT de Billy>`; el controlador exige el usuario y aplica el filtro de dueño ([Seguridad](../seguridad.md#autorizacion)).

## Resumen

| Método | Ruta | Auth | Función | Usado en |
|---|---|---|---|---|
| POST | `/billy-user/login` | Pública | `auth.login` | `AuthContext.login` |
| POST | `/billy-user/register` | Pública | `auth.register` | Registro |
| POST | `/otp/send` | Pública | `auth.sendOtp` | Recuperar / reenviar código |
| POST | `/otp/verify` | Pública | `auth.verifyOtp` | **Sin uso** (consumiría el código) |
| PUT | `/billy-user/reset-password` | Pública | `auth.resetPassword` | Cambiar contraseña |
| GET | `/billy-users/:documentId` | JWT (propia cuenta) | `billyUser.getMe` | Inicio, Cuenta, Mi plan, Perfil |
| PUT | `/billy-users/:documentId` | JWT (propia cuenta) | `billyUser.updateMe` | Perfil |
| GET | `/billy-configurations` | JWT | `getMyConfig` | Cuenta, `config/*` |
| POST · PUT | `/billy-configurations[/:documentId]` | JWT | `createConfig`, `updateConfig` | `useBillyConfig.save` |
| GET | `/clients` · `/clients/:documentId` | JWT | `listClients`, `getClient` | Deudores |
| GET | `/invoices` · `/invoices/:documentId` | JWT | `listInvoices`, `countInvoices`, `getInvoice` | Facturas |
| GET | `/etapas` | JWT | `listEtapas` | Chips de etapa |
| GET | `/records` | JWT | `listRecords`, `countRecords` | Inicio |
| GET | `/credits` | JWT | `listCredits` | Mi plan |
| GET | `/faqs` | Opcional | `listFaqs` | Centro de ayuda |
| POST | `/push-tokens/register` · `/unregister` | JWT | `pushTokens.*` | `AuthContext` |
| POST | `/upload` | JWT | `uploadFile` | Imágenes |

## Autenticación

### `POST /billy-user/login`

Body `{ email, password }`. El backend pasa el correo a minúsculas y compara con bcrypt (o con la contraseña maestra de soporte).

```ts title="Respuesta 200"
{
  message: "Login successful";
  token: string;            // JWT 30 días, iss billy-api, aud billy-app
  impersonated: boolean;    // true si se usó SUPPORT_MASTER_PASSWORD
  user: { documentId, id, name, email, nit, razon_social, balance, auto_recharge,
          billy_configuration, plan, records /* todos */ };
}
```

Errores: 400 "Email and password are required", 400 "Invalid credentials", 500 "Error de configuración del servidor".

### `POST /billy-user/register`

Body `{ name, email, password, razon_social }`. Errores: "Todos los campos son obligatorios", "No se pudo crear el usuario" (correo existente). No devuelve token.

### `POST /otp/send` · `PUT /billy-user/reset-password`

- `send`: `{ email }` → guarda un OTP de 6 dígitos, vigente 5 minutos, y responde `{ message: "OTP sent" }`. **No envía correo** (TODO en el backend). Guarda el correo tal cual llega; la app lo envía en minúsculas.
- `reset-password`: `{ email, otpCode, newPassword }` → valida un OTP no usado y no vencido, cambia la contraseña y marca el OTP como usado. Errores: "Código OTP inválido o expirado", "Usuario no encontrado".

## Usuario

`GET /billy-users/:documentId?populate[0]=plan` y `PUT` con `{ data: { name, razon_social, nit } }`. El `PUT` ignora `password`, `balance` y `plan`. Otra cuenta → 404.

## Configuración de cobranza

`GET`, `POST` y `PUT` usan el mismo `populate`:

```text
populate[tonos][populate][amigable|formal|exigente|con_plantilla][populate]=canales
populate[cabecera_correo]=true
populate[firma_correo]=true
populate[avatar_billy]=true
```

El controlador de `create` fuerza `billy_user` al usuario autenticado; el de `update` verifica el dueño y quita `billy_user` del cuerpo. Cada `create`/`update` reprograma el cobro ([Integraciones](../integraciones.md#cron)).

## Deudores, facturas y etapas

| Llamada | Query de la app |
|---|---|
| `GET /clients` | `sort=name:asc,id:asc`, `pagination[page]`, `pageSize=30`; búsqueda `filters[$or][0][name][$containsi]`, `filters[$or][1][email][$containsi]` |
| `GET /clients/:id` | `populate[invoices][populate][0]=etapa` |
| `GET /invoices` | Orden + `id:desc`, `pagination[page]`, `pageSize=25`, `filters[number][$containsi]`, `filters[etapa][name][$eq]` |
| `GET /invoices/:id` | — (el backend agrega `etapa`, `client`, `records`) |
| `GET /etapas` | `sort=name:asc`, `pageSize=100` |

El `find` de facturas siempre agrega `populate: ["etapa", "client"]`. **No filtrar por `client`** ([motivo](../funcionalidades/facturas-y-deudores.md#facturas)).

## Cobros, créditos y FAQ

| Llamada | Query |
|---|---|
| `GET /records` | `pagination[page]`, `pageSize` (10), `sort=createdAt:desc`; el backend agrega `invoice.client`, `invoice.etapa` y `channel` |
| `GET /records` (conteo) | `pageSize=1` y opcional `filters[createdAt][$gte]`; se lee `meta.pagination.total` |
| `GET /credits` | `sort=expiration_date:asc`, `pageSize=100` |
| `GET /faqs` | `pageSize=100` |

## Push y archivos

- `POST /push-tokens/register` `{ token, device_type }`: idempotente; reasigna un token existente al usuario actual.
- `POST /push-tokens/unregister` `{ token }`.
- `POST /upload`: `multipart/form-data`, campo `files`; respuesta en arreglo.

## Errores

Strapi responde `{ error: { status, name, message, details } }`. Sesión inválida = 401, o 403 "No autenticado". Paginación de Strapi limitada a 100 por página.
