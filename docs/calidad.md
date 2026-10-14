---
title: Pruebas y calidad
description: Jest, ESLint, verificación de tipos y la lista de pruebas manuales antes de publicar.
sidebar_label: Pruebas y calidad
---

## Comandos

```bash
npm run typecheck   # tsc --noEmit (strict)
npm run lint        # expo lint (ESLint 9, eslint-config-expo)
npm test            # jest (preset jest-expo)
npm run check       # los tres en orden
```

Estado al 13/10/2026: **tipos sin errores, 59 pruebas en verde, ESLint con 0 errores y 8 avisos.** No hay CI que lo ejecute ([Pendientes](./pendientes.md#publicacion)).

## Pruebas unitarias

Jest con `jest-expo`. `jest.global-setup.js` fija `TZ=America/Bogota`, porque los errores de fechas solo aparecen en UTC−5. Las pruebas importan sus globales desde `@jest/globals` para no exponer los tipos de Jest ni de Node al código de la app.

| Archivo | Cubre |
|---|---|
| `src/utils/__tests__/format.test.ts` | `parseDate` y fechas `date` en UTC−5 (regresión), fechas relativas, `daysUntil` (sin `-0`), moneda `es-CO`, iniciales, búsqueda sin tildes, validación de correo |
| `src/utils/__tests__/domain.test.ts` | `dueLabel` (vence hoy = "Vence"); `creditState`/`availableOf` (Agotado / Vencido con y sin saldo / Por vencer / Activo) |
| `src/utils/__tests__/calendar.test.ts` | Grilla del `DateField`: `toDateKey` en hora local, `addDays`/`addMonths` cruzando mes y año, `buildMonthGrid` (42 días, semanas en lunes, relleno del mes vecino), `isSameOrAfter` |
| `src/utils/__tests__/jwt.test.ts` | Lectura de `exp`, margen de 60 s, tokens ilegibles, base64url no ASCII |
| `src/api/__tests__/client.test.ts` | `apiFetch`: query, cabeceras, errores de Strapi, red, HTML (502), 200 no JSON, sesión vencida (sin red, 401, 403 "No autenticado", 403 normal, 401 sin token); parámetros de `listInvoices` y `listClients` (incluido que nunca filtre por `client`) |
| `src/api/__tests__/billyConfiguration.test.ts` | Plantilla blocks ⇄ texto: ida y vuelta, texto de enlaces y listas (regresión), valores raros; `emptyTonos` |
| `src/api/__tests__/auth.test.ts` | `toSessionUser` descarta `records` y configuración |

`src/testing/fakeJwt.ts` genera JWT de prueba (la app nunca verifica firmas).

Hallazgos que dejaron las pruebas: `blocksToPlainText` perdía el texto de los enlaces y `daysUntil` devolvía `-0`. Ambos están corregidos.

## Lint

`eslint.config.js` extiende `eslint-config-expo/flat` e ignora `android/`, `ios/`, `dist/` y `assets/store/`.

- `react-hooks/refs` (errores corregidos): los `Animated.Value` se crean con `useState(() => new Animated.Value(…))[0]` y los refs del *fetcher* se actualizan en `useLayoutEffect`.
- `react-hooks/set-state-in-effect` está como **aviso**: la carga de datos y la sincronización de formularios ocurren en efectos de forma intencional. Migrarlo es un refactor aparte.

## Otras verificaciones

```bash
npx expo-doctor          # dependencias del SDK 57
npx expo install --check # versiones esperadas
```

`expo-doctor` solo falla en la consulta a React Native Directory (error del servidor externo).

## Validaciones de formulario

| Pantalla | Reglas |
|---|---|
| Ingreso | Correo requerido y válido; contraseña requerida |
| Registro | Campos requeridos, correo válido, contraseñas iguales, términos |
| Cambio de contraseña | Código de 6 dígitos, contraseñas iguales |
| Ajustes generales | Correos válidos; frecuencia solo dígitos |

## Pruebas manuales antes de publicar

- [ ] Login correcto y con credenciales inválidas ("Correo o contraseña incorrectos.").
- [ ] Sesión vencida: adelantar el reloj 31 días → aviso "Tu sesión venció" y sin botón de huella.
- [ ] Cerrar sesión → desbloquear con huella; Olvidar dispositivo → sin botón de huella.
- [ ] Recuperación de contraseña (**hoy bloqueada por el backend**: el OTP no se envía).
- [ ] Facturas: búsqueda, etapas con conteos, tres órdenes, scroll hasta el final y "Cargar más".
- [ ] Deudores: búsqueda por nombre y por correo, paginación.
- [ ] Fechas de vencimiento y de créditos iguales a las de la web.
- [ ] Guardar cada pantalla de `config/` y reabrir; subir una imagen y ver la vista previa sin recargar.
- [ ] Plantilla con enlace creada en la web: abrir y guardar en la app conserva el texto.
- [ ] Recarga desde la app: comprobar si los créditos llegan ([riesgo](./funcionalidades/cuenta-y-plan.md#recarga)).
- [ ] Push "Cobro enviado" en un build de producción (Android y iOS).
- [ ] Modo avión, texto grande y lector de pantalla.
