---
title: Seguridad
description: Autenticación, autorización por dueño, sesión y biometría, permisos, secretos y riesgos verificados en backend y web.
sidebar_label: Seguridad
---

## Autenticación

- Correo y contraseña contra `POST /billy-user/login` (HTTPS). Contraseñas con bcrypt (ciclo de vida del modelo `billy-user`).
- JWT propio firmado con `BILLY_JWT_SECRET` (separado del `JWT_SECRET` de Strapi), vigente **30 días** y sin *refresh token*.
- La app detecta el vencimiento leyendo `exp` y al recibir 401, o 403 "No autenticado"; en ese caso borra la sesión (ver [Autenticación](./funcionalidades/autenticacion.md#restauracion-de-sesion)).
- **Contraseña maestra de soporte:** con `SUPPORT_MASTER_PASSWORD` definida, el backend la acepta para cualquier cuenta, registra cada uso (cuenta, id e IP) y responde `impersonated: true`.
- Recuperación por OTP de 6 dígitos, vigente 5 minutos y de un solo uso. **Hoy no se envía por correo** ([Pendientes](./pendientes.md#criticos)). Sin límite de intentos ni de solicitudes.

## Autorización {/* #autorizacion */}

No hay roles en la app. El backend aplica **aislamiento por dueño fila a fila** (`src/utils/ownership.js`), usando `ctx.state.billyUser` que deja la estrategia `billy-jwt`:

| Acción | Regla |
|---|---|
| Listados (`find`) | `scopeFindQuery` agrega `filters[<ruta del dueño>] = usuario`, sobrescribiendo cualquier filtro del cliente en esa clave |
| Detalle, edición y borrado | `assertOwnsEntity` comprueba el dueño por `documentId`; si no coincide, responde 404 |
| Creación | El dueño se fuerza al usuario autenticado, nunca se toma del cuerpo |
| `billy-user` | Solo la propia cuenta; `update` ignora `password`, `balance` y `plan`; listar y borrar requieren un API Token de Strapi |
| `credits/use` | El usuario sale del token (antes era un IDOR, ya corregido según el código) |

| Recurso | Ruta del dueño |
|---|---|
| `client`, `billy-configuration`, `credit`, `push-token`, `record` | `billy_user` |
| `invoice` | `client.billy_user` |

`etapa` y `faq` usan controladores estándar, sin dueño.

## Sesión y biometría {/* #sesion-y-biometria */}

| Aspecto | Implementación |
|---|---|
| Almacenamiento | `expo-secure-store`: JWT y usuario recortado (sin `records` ni configuración) |
| Backup de Android | Excluido: el manifest generado aplica `secure_store_backup_rules` y `secure_store_data_extraction_rules` |
| Biometría | `expo-local-authentication`, sin PIN de respaldo; solo desbloquea un JWT guardado y **vigente** |
| Apertura en frío | Sin biometría (decisión de producto) |
| Vencimiento | La sesión se borra sola a los 30 días o si el backend la rechaza |
| Revocación remota | No existe: un JWT robado es válido hasta su vencimiento |

## Permisos {/* #permisos */}

| Permiso | Origen | Estado |
|---|---|---|
| `USE_BIOMETRIC`, `USE_FINGERPRINT` | `app.json` | Declarados |
| Face ID | Plugins de biometría y SecureStore | Textos en español |
| Notificaciones | `expo-notifications` | Se piden tras cada sesión hasta otorgarse |
| Galería | `expo-image-picker` | Texto en español |
| Cámara, micrófono | `expo-image-picker` | **Desactivados** (`cameraPermission: false`, `microphonePermission: false`) |
| `RECORD_AUDIO`, `SYSTEM_ALERT_WINDOW` | Plantillas y librerías | **Bloqueados** con `android.blockedPermissions` |

Revisar el AAB final en el *App bundle explorer* (por ejemplo, la ausencia de `AD_ID`).

## Secretos y archivos sensibles {/* #secretos */}

| Elemento | Estado |
|---|---|
| `.env` | Ignorado. Solo contiene la URL de la API. |
| `EXPO_PUBLIC_*` | Públicas por diseño (van al bundle). |
| `google-services.json`, `GoogleService-Info.plist` | **Ignorados.** En EAS se cargan como variable de archivo `GOOGLE_SERVICES_JSON`, que lee `app.config.js`. |
| `android/`, `ios/` | Ignorados (CNG); incluye `debug.keystore`. |
| `google-play-service-account*.json` | Ignorados por adelantado. |
| Clave de subida a Play | Gestionada por EAS; respaldar con `eas credentials`. |
| `BILLY_JWT_SECRET`, `SUPPORT_MASTER_PASSWORD`, `INGEST_WEBHOOK_URL` | Variables del backend; no aparecen en la app. |

Esta documentación no reproduce valores de secretos.

## Riesgos verificados en la web {/* #riesgos-web */}

:::danger
- `plans.php` acredita créditos al recibir `?statusPay=success&planId=X`, **sin verificar el pago** con MercadoPago.
- `code.php` y `change-password.php` imprimen `$_GET['email']` sin escapar en HTML y JavaScript (posible XSS reflejado).

Detalle y prioridades en [Pendientes](./pendientes.md#criticos).
:::

## Datos personales

La app muestra datos de terceros (deudores) y registra un identificador de dispositivo. El resumen para *Data safety* está en `docs/GOOGLE_PLAY_CONSOLE.md` §2.6. Política: [web.oblicua.co/politica-privacidad](https://www.web.oblicua.co/politica-privacidad).
