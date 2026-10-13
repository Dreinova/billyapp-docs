---
title: Módulos
description: Referencia por archivo de app/ y src/ con sus exportaciones y responsabilidades.
sidebar_label: Módulos
---

## `src/api`

| Archivo | Exporta | Descripción |
|---|---|---|
| `client.ts` | `apiFetch`, `ApiError`, `API_BASE_URL`, `SESSION_EXPIRED_MESSAGE`, `setSessionExpiredHandler`, `assertSessionValid`, `readJson`, `toApiError` | Cliente JSON y detección de sesión vencida ([Datos y estado](../arquitectura/datos-y-estado.md#cliente-http-apifetch)) |
| `types.ts` | `StrapiMeta`, `StrapiListResponse<T>`, `Channel`, `Etapa`, `Client`, `Invoice`, `CollectionRecord` | Tipos compartidos |
| `auth.ts` | `BillyUser`, `toSessionUser`, `login`, `register`, `sendOtp`, `verifyOtp` (sin uso), `resetPassword` | Autenticación |
| `billyUser.ts` | `BillyUserProfile`, `getMe`, `updateMe` | Perfil y plan |
| `billyConfiguration.ts` | `BillyConfiguration`, `Tono`, `Tonos`, `Canales`, `MediaFile`, `getMyConfig`, `createConfig`, `updateConfig`, `emptyTonos`, `blocksToPlainText`, `plainTextToBlocks` | Configuración de cobranza |
| `clients.ts` | `listClients`, `getClient`, `CLIENTS_PAGE_SIZE` | Deudores paginados |
| `invoices.ts` | `listInvoices`, `countInvoices`, `listEtapas`, `getInvoice`, `InvoiceFilters`, `InvoiceSort`, `INVOICES_PAGE_SIZE` | Facturas paginadas y etapas |
| `records.ts` | `listRecords`, `countRecords`, `getDashboardCounts` | Cobros enviados |
| `credits.ts` | `Credit`, `listCredits` | Créditos |
| `faqs.ts` | `Faq`, `listFaqs` | Preguntas frecuentes |
| `pushTokens.ts` | `registerPushToken`, `unregisterPushToken` | Push |
| `upload.ts` | `UploadedFile`, `uploadFile` | Subida multipart |

## `src/context` y `src/hooks`

| Archivo | Exporta | Descripción |
|---|---|---|
| `context/AuthContext.tsx` | `AuthProvider`, `useAuth` | Sesión, vencimiento, biometría, `updateUser` |
| `hooks/useQuery.ts` | `useQuery`, `useDebouncedValue`, `errorMessage`, `QueryStatus` | Carga de datos |
| `hooks/usePaginatedQuery.ts` | `usePaginatedQuery` | Listados con "cargar más" |
| `hooks/useConfig.ts` | `useBillyConfig` | Lectura y guardado de la configuración |

## `src/utils`

| Archivo | Exporta | Descripción |
|---|---|---|
| `format.ts` | `parseDate`, `formatDate`, `formatShortDate`, `formatRelativeDay`, `formatLongToday`, `daysUntil`, `formatCurrency`, `formatNumber`, `pluralize`, `initials`, `firstName`, `normalizeSearch`, `isValidEmail` | [Utilidades](./utilidades.md) |
| `jwt.ts` | `getTokenExpiry`, `isTokenExpired` | Lectura del `exp` sin verificar la firma |
| `invoices.ts` | `dueLabel` | Texto de vencimiento |
| `credits.ts` | `creditState`, `EXPIRING_SOON_DAYS` | Estado de un lote de créditos |
| `authUtils.ts` | `saveSession`, `getSession`, `clearSession`, `checkBiometricSupport`, `handleBioAuth` (→ `boolean`), `saveUserData`, `getUserData`, `deleteUserData` | SecureStore y biometría |
| `pushNotifications.ts` | `registerForPushNotificationsAsync` | Permiso y `ExpoPushToken` |

## `src/ui`

`index.ts` reexporta los tokens de `theme.ts` y los componentes: `Text`, `PressableScale`, `Button`, `IconButton`, `TextField`, `SearchField`, `Chip`, `ChipRow`, `ToggleChip`, `ToggleChipGroup`, `Badge`, `toneColors`, `Switch`, `Checkbox`, `Avatar`, `IconTile`, `Card`, `ListGroup`, `ListItem`, `KeyValueRow`, `SectionHeader`, `ProgressBar`, `Divider`, `Skeleton`, `SkeletonList`, `LoadingView`, `EmptyState`, `ErrorState`, `Banner`, `LoadMoreFooter`, `Screen`, `LargeHeader`, `NavHeader`, `ToastProvider`, `useToast`, `Sheet`, `ConfirmSheet`. Ver [Componentes](../interfaz/componentes.md).

## `src/components`

| Archivo | Exporta |
|---|---|
| `InvoiceRow.tsx` | `default InvoiceRow`; reexporta `dueLabel` |
| `GroupedRow.tsx` | `default GroupedRow` |
| `BrandMark.tsx` | `default BrandMark` |

El sistema legacy (`src/styles`, `Button`, `CheckBox`, `Input` y `Table` de `src/components`) se eliminó en `08c3da9`.

## Pruebas

| Ruta | Contenido |
|---|---|
| `src/**/__tests__/*.test.ts` | Pruebas Jest ([Calidad](../calidad.md)) |
| `src/testing/fakeJwt.ts` | `fakeJwt`, `jwtExpiringIn` |
| `jest.global-setup.js` | `TZ=America/Bogota` |

## `app/`

| Archivo | Datos |
|---|---|
| `_layout.tsx` | Fuentes, splash, providers |
| `sign-in.tsx` | `login`, `biometricLogin`, `sessionExpired` |
| `register.tsx` · `recuperar-contrasena.tsx` · `cambiar-contrasena.tsx` | `register` · `sendOtp` · `resetPassword` |
| `(app)/_layout.tsx` · `(tabs)/_layout.tsx` | Guard · tabs |
| `(tabs)/index.tsx` | `getDashboardCounts`, `listRecords`, `getMe` |
| `(tabs)/facturas.tsx` | `usePaginatedQuery(listInvoices)`, `listEtapas`, `countInvoices` |
| `(tabs)/deudores.tsx` | `usePaginatedQuery(listClients)` |
| `(tabs)/cuenta.tsx` | `getMe`, `getMyConfig` |
| `factura/[id].tsx` · `deudor/[id].tsx` | `getInvoice` · `getClient` |
| `mi-plan.tsx` | `getMe`, `listCredits`, `creditState` |
| `planes.tsx` · `perfil.tsx` · `faq.tsx` | WebView · `updateMe` + `updateUser` · `listFaqs` |
| `config/*.tsx` | `useBillyConfig`; `imagenes.tsx` además `uploadFile` |

## Configuración

| Archivo | Ver |
|---|---|
| `app.json`, `app.config.js`, `eas.json`, `tsconfig.json`, `babel.config.js`, `eslint.config.js`, `.env` | [Configuración](../primeros-pasos/configuracion.md) |
| `docs/GOOGLE_PLAY_CONSOLE.md` | [Builds y publicación](../despliegue/builds-y-publicacion.md) |
