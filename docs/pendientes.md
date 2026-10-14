---
title: Pendientes y deuda técnica
description: Limitaciones, riesgos y deuda técnica de BillyApp, su backend y la web, con lo ya resuelto.
sidebar_label: Pendientes
---

Estado al 13/10/2026, tras auditar la app (rama `fix/pendientes-fase-1`), el backend `gcp-strapi-billy` y la web `Billy_v2`. La prioridad es una sugerencia.

<p>
  <span className="billy-badge billy-badge--danger"><span className="billy-badge__dot"></span>Crítica</span>{' '}
  <span className="billy-badge billy-badge--warning"><span className="billy-badge__dot"></span>Media</span>{' '}
  <span className="billy-badge billy-badge--neutral"><span className="billy-badge__dot"></span>Baja</span>
</p>

## Críticos fuera de la app {/* #criticos */}

Afectan a usuarios de la app, pero se corrigen en el backend o en la web.

| Prioridad | Hallazgo | Dónde | Impacto |
|---|---|---|---|
| Crítica | **El código OTP nunca se envía.** `/otp/send` lo genera y guarda, pero tiene un `TODO: integrar servicio de email`. | `gcp-strapi-billy/src/api/otp/controllers/otp.js` | La recuperación de contraseña no funciona ni en la app ni en la web. |
| Crítica | **Los créditos se acreditan con un GET sin verificar el pago.** `/planes?statusPay=success&planId=X` suma créditos al usuario de la sesión PHP sin consultar a MercadoPago. | `Billy_v2/plans.php:26-33` | Cualquier usuario con sesión web puede obtener créditos gratis forjando la URL. |
| Crítica | **La recarga desde la app probablemente no acredita.** El acreditamiento usa `$_SESSION['user']` de PHP, y el WebView de la app no tiene sesión web (`/planes` está exento del guard de login). | `Billy_v2/plans.php`, `app/(app)/planes.tsx` | El usuario paga y no recibe créditos, salvo que inicie sesión dentro del WebView. Hay que probarlo de punta a punta. |
| Crítica | XSS reflejado: `code.php:6` inserta `$_GET['email']` sin escapar dentro de un `<script>`; `change-password.php` hace lo mismo en atributos HTML (`email`, `id`, `otp`). | `Billy_v2/code.php`, `change-password.php` | Un enlace manipulado ejecuta JavaScript en el dominio de la web, con acceso al JWT de la sesión (`sessionJwt`). |
| Baja | `billy_user.balance` sigue siendo `string` en el esquema (se mantiene por compatibilidad: la web y la app ya lo leen así). | `billy-user/schema.json` | El backend ahora lo escribe él mismo (`credit.service.syncUserBalance`) convertido a texto; conversiones implícitas sólo del lado de lectura. |
| Media | La web consume el OTP en `/otp/verify` y luego `reset-password` exige `used: false`. | `Billy_v2/js/main.js`, `billy-user.resetPassword` | Aun con correo, la recuperación desde la web fallaría. La app no llama a `verify` y no tiene este problema. |
| Media | Los mensajes de error del login están en inglés ("Invalid credentials"). | `billy-user.login` | La app traduce el de credenciales; los demás se muestran en inglés. |
| Baja | El backend no procesa los *tickets* de error de Expo Push (p. ej. `DeviceNotRegistered`). | `src/utils/push.js` | Los tokens muertos no se eliminan nunca. |

## Funcionalidad de la app {/* #funcionalidad */}

| Prioridad | Hallazgo | Dónde | Impacto |
|---|---|---|---|
| Baja | El dashboard de la web sigue restando `total de records` sobre `balance` (cuenta heredada de antes del libro de créditos), mientras que Mi plan (web y app) muestra `balance` directo — ya consistente entre sí, pero el dashboard queda como una tercera cuenta. | Web `dashboard.php:100` | Cosmético: el backend ya mantiene `balance` sincronizado con el libro de créditos; sólo falta simplificar ese cálculo en el dashboard. |
| Media | Guardar la plantilla reemplaza el formato enriquecido por párrafos de texto. | `plantilla.tsx` | Se pierden negritas y enlaces hechos en la web (el texto ya no se pierde: ver Resueltos). |
| Media | La app no tiene campañas, audiencias, integraciones ni el activador `billy_active`, que sí existen en la web. | — | Funcionalidad solo web. |
| Baja | Tocar una notificación no navega a nada; el backend envía `data.type = "billing-success"`. | `pushNotifications.ts` | Menor utilidad de las push. |
| Baja | El WebView de recarga no recibe la sesión ni detecta el fin del pago. | `planes.tsx` | Ver los críticos de la web. |
| Baja | Términos y condiciones sin enlace; sin reglas de contraseña (el backend tampoco las tiene). | `register.tsx` | — |

## Código {/* #codigo */}

| Prioridad | Hallazgo | Recomendación |
|---|---|---|
| Media | 8 avisos `react-hooks/set-state-in-effect`: la carga de datos y la sincronización de formularios ocurren en efectos. | Migrar a una librería de datos (p. ej. TanStack Query) en un refactor aparte. |
| Baja | Las pantallas usan números sueltos (`gap: 16`) en vez de `space`/`layout`; tokens sin uso: `space`, `elevation.raised`, `typography.display`, variante `ghost`. | Migrar gradualmente o depurar tokens. |
| Baja | Mi plan y FAQ siguen limitados a 100 elementos (sin paginación). | Suficiente hoy; paginar si crece. |
| Baja | La búsqueda de deudores en el servidor distingue tildes según la *collation* de la base. | Revisar en Postgres si importa. |

## Publicación {/* #publicacion */}

| Hallazgo | Detalle |
|---|---|
| FCM en EAS | Crear la variable de archivo `GOOGLE_SERVICES_JSON` en EAS y cargar las credenciales FCM V1. Ver [Builds y publicación](./despliegue/builds-y-publicacion.md#variables-en-eas). |
| iOS | Sin credenciales APNs verificadas, sin capturas de iPad pese a `supportsTablet: true`. |
| `eas.json` | `submit.production` vacío; `ios.buildNumber` no definido. |
| Política de pagos de Play | Riesgo por la recarga vía WebView. |
| Sin OTA ni observabilidad | No hay `expo-updates`, Sentry ni analítica. |
| CI | Hay `npm run check`, pero ningún pipeline lo ejecuta. |

## Resueltos en `fix/pendientes-fase-1` {/* #resueltos */}

### billy-app

| Commit | Cambio |
|---|---|
| `6d0ec48` | Sesión vencida (JWT de 30 días): detección local del `exp` y por 401 / 403 "No autenticado", vuelta al ingreso con aviso; la huella ya no desbloquea tokens vencidos. Fechas `date` un día antes en UTC−5. Respuesta del `PUT` de configuración con `populate`. Respuestas no JSON. Navegación tras un fallo biométrico. Perfil sincronizado con la sesión. |
| `585bd61` | Paginación con scroll infinito y "Cargar más" en Facturas y Deudores; búsqueda, etapa y orden en el servidor. Textos en tuteo. |
| `08c3da9` | `android/`, `ios/` y `google-services.json` ignorados (`app.config.js` lee el archivo desde EAS). Sin cámara ni micrófono; `RECORD_AUDIO` y `SYSTEM_ALERT_WINDOW` bloqueados. Eliminados el sistema de estilos legacy, sus componentes y `react-native-paper`, `react-native-dropdown-picker` y `@gorhom/bottom-sheet`. Versiones *patch* del SDK alineadas. |
| `52e8d29` | Jest (46 pruebas) y ESLint (0 errores). El texto de los enlaces y las listas de la plantilla ya no se pierde al guardarla. |
| `2bfc839` | Variables de plantilla con una llave (`{client_name}`) y las 9 de la web. Tono "Con plantilla" sin WhatsApp ni notas. Créditos "Agotado" vs. "Vencido". Sesión guardada sin `records`. Correo en minúsculas para el OTP. |
| `291bd6b` | "Invalid credentials" se muestra como "Correo o contraseña incorrectos." |
| `3825f85` | `start_date` editable en Ajustes generales con un selector de fecha propio (`DateField`, sin dependencias nativas — [Componentes](./interfaz/componentes.md#datefield)), con aviso mientras falte esa fecha o la frecuencia. Historial de créditos muestra disponible/total y origen del lote, según el [libro de créditos](./funcionalidades/cuenta-y-plan.md#libro-de-creditos) nuevo. 59 pruebas. |

### gcp-strapi-billy

| Commit | Cambio |
|---|---|
| `d389e97` | **Libro de créditos**: `credit` pasa a lotes con `amount`/`used`/`source`; cada *record* creado (cobro enviado, por cualquiera de las tres rutas de creación) descuenta 1 crédito automáticamente, FIFO por vencimiento, con `UPDATE` atómico (sin doble gasto en envíos concurrentes — verificado). `billy_user.balance` se resincroniza solo en cada cambio de un lote. Job diario marca lotes vencidos. Script de migración (`scripts/migrate-credits-ledger.js`, simulación por defecto) para los lotes creados antes del cambio. **Relaciones** `invoice.etapa`, `record.channel`, `client.billy_user` y `billy_user.plan` migradas de `oneToOne` a `manyToOne` (verificado sin pérdida de datos sobre una copia de la base de desarrollo). El cron de cobro ya no se agenda si `billy_active` es falso. |

Decisiones de producto registradas: la huella solo se pide después de "Cerrar sesión"; "Cerrar sesión" sigue recibiendo push; el `TextField` se queda sin estado de foco (el anterior causaba un error); el selector de `start_date` es un componente propio, sin dependencias nativas nuevas; los créditos se descuentan automáticamente y el `credit` del panel de Strapi ahora muestra total, usados y vencimiento por lote; las relaciones `oneToOne` mal declaradas se migraron a `manyToOne`.

## Fuera de los tres repositorios

- El servicio de envío al que Strapi manda la configuración (`INGEST_WEBHOOK_URL`): envío real de correo, SMS y WhatsApp, reemplazo de variables, uso de tonos, filtros y créditos.
- Permisos del rol *Public* de Strapi (se configuran en el panel, no en código).
