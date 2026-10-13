---
title: Diagnóstico y errores frecuentes
description: Mensajes reales de la app y del backend, su causa y cómo resolverlos.
sidebar_label: Diagnóstico
---

## Mensajes de la app

| Mensaje | Origen | Causa | Qué hacer |
|---|---|---|---|
| "Tu sesión venció. Inicia sesión de nuevo." / aviso en el ingreso | `apiFetch`, `AuthContext` | JWT de más de 30 días, o el backend respondió 401 / 403 "No autenticado" | Iniciar sesión con contraseña |
| "No se pudo conectar con el servidor. Revisa tu conexión." | `apiFetch` (status 0) | Sin red, DNS, TLS o URL de API incorrecta | Revisar `.env` / variables de EAS |
| "El servidor no está disponible en este momento…" | `toApiError` | 5xx sin mensaje (p. ej. 502 del proxy) | Revisar el despliegue de Strapi |
| "El servidor devolvió una respuesta inválida." | `readJson` | 2xx que no es JSON | Revisar el proxy o la URL |
| "Correo o contraseña incorrectos." | `sign-in.tsx` | Backend: "Invalid credentials" | — |
| "Código OTP inválido o expirado" | `reset-password` | Código incorrecto, usado o de más de 5 min | Pedir otro código |
| No llega el código de recuperación | Backend | **`/otp/send` no envía correo (TODO)** | Corregir el backend ([Pendientes](../pendientes.md#criticos)) |
| "No se pudo crear el usuario" | `register` | Correo ya registrado | Ingresar o recuperar |
| Alertas de biometría | `handleBioAuth` | Sin hardware, sin enrolar, sin sesión, sesión vencida o fallo | Ver [Autenticación](../funcionalidades/autenticacion.md#biometria) |
| "No pudimos abrir los planes" | `planes.tsx` | Error de red o HTTP de la web | Reintentar |
| "Necesitamos acceso a tus fotos…" | `imagenes.tsx` | Permiso de galería denegado | Ajustes del sistema |
| "No pudimos cargar más resultados." | `usePaginatedQuery` | Falló una página siguiente | Botón **Reintentar** del pie |

## Consola de desarrollo

| Log | Causa |
|---|---|
| `[push] Falta extra.eas.projectId…` | Se borró `projectId` de `app.json` (`eas init`) |
| `[push] No se pudo registrar para push notifications` | Expo Go Android, emulador sin Google Play Services o FCM mal configurado |
| `[push] No se pudo registrar el token en el backend` | Error de `/push-tokens/register` |

## Backend: cobros que no salen

Revisar en este orden (logs de Strapi y tabla `cron-log`):

| Log / síntoma | Causa |
|---|---|
| `Job no agendado: faltan start_date o frecuencia_cobros` | La configuración no tiene `start_date` (la app no lo permite editar) o frecuencia |
| `frecuencia_cobros no es un entero positivo válido` | Valor no numérico (la app ya lo valida) |
| `No es día de cobro según frecuencia — tick ignorado` | Normal: hoy no toca |
| `cron-log` con `http_error` / `error` | Fallo del servicio de envío (`INGEST_WEBHOOK_URL`) |
| Sin ejecuciones fuera de L–V 7–17 h | Patrón `0 7-17 * * 1-5` en `America/Bogota` |
| `skipped: inactive` | `billy_active = false` |

## Entorno

| Síntoma | Solución |
|---|---|
| La app se cierra en Expo Go | Usar `npm run android` (development build) |
| Cambios de `app.json` / plugins sin efecto | `npm run android` regenera `android/` (CNG) |
| Cambios en `.env` sin efecto | `npx expo start -c` |
| Push no llega en producción (Android) | Variable de archivo `GOOGLE_SERVICES_JSON` y credenciales FCM V1 en EAS |
| `npm run lint` muestra 8 avisos | Esperados (`set-state-in-effect`, [Calidad](../calidad.md#lint)) |
| Pruebas de fechas fallan en local | Correr con `npm test` (el `globalSetup` fija la zona horaria) |

## Comportamientos que parecen errores

- **Al abrir no pide huella:** es intencional; solo se pide después de "Cerrar sesión".
- **Notificaciones con la sesión cerrada:** "Cerrar sesión" no desregistra el token; usar "Olvidar este dispositivo".
- **Saldo distinto al del dashboard web:** la web resta los *records* en el dashboard ([Saldo](../funcionalidades/cuenta-y-plan.md#saldo)).
- **Lote "Agotado":** el lote se consumió (cantidad 0), no venció.
- **Plantillas con `{{variable}}`:** fueron guardadas por versiones anteriores de la app; usar `{variable}`.
