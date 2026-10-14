---
title: Utilidades
description: Funciones puras de src/utils con ejemplos verificados por las pruebas.
sidebar_label: Utilidades
---

Todas están cubiertas por pruebas Jest que corren con `TZ=America/Bogota` ([Calidad](../calidad.md)). Las funciones de formato devuelven `"—"` ante valores vacíos o fechas inválidas.

## Números

| Función | Ejemplo | Resultado |
|---|---|---|
| `formatCurrency` | `4812180.4` | `"$ 4.812.180"` |
| `formatNumber` | `1200` | `"1.200"` |
| `pluralize` | `(1200, "deudor", "deudores")` | `"1.200 deudores"` |

## Fechas {/* #fechas */}

`parseDate(iso)` es la base de todas: interpreta `"YYYY-MM-DD"` (campos `date` de Strapi como `due_date` y `expiration_date`) como **medianoche local**. Los *datetime* con hora se parsean normalmente.

:::info[Por qué existe `parseDate`]
`new Date("2026-08-18")` es medianoche UTC, que en Colombia es el 17 a las 19:00. Antes, la app mostraba esas fechas un día antes. Lo cubre una prueba de regresión.
:::

Con "hoy" = martes 13 oct 2026, 10:00:

| Función | Ejemplo | Resultado |
|---|---|---|
| `formatDate` | `"2026-08-18"` | `"18 ago 2026"` |
| `formatShortDate` | `"2026-10-03"` / `"2025-10-03"` | `"3 oct"` / `"3 oct 2025"` |
| `formatRelativeDay` | hoy / `"2026-10-12"` / `"2026-09-27"` | `"Hoy"` / `"Ayer"` / `"27 sep"` |
| `formatLongToday` | — | `"Martes, 13 de octubre"` |
| `daysUntil` | `"2026-10-13"` / `"2026-10-17"` / `"2026-10-12"` / `null` | `0` / `4` / `-1` / `Infinity` |

## Texto

| Función | Ejemplo | Resultado |
|---|---|---|
| `initials` | `"Julián Delgado"` / `"Julian"` / `null` | `"JD"` / `"JU"` / `"?"` |
| `firstName` | `"  Julián Delgado "` | `"Julián"` |
| `normalizeSearch` | `"JOSÉ Peñalosa"` | `"jose penalosa"` |
| `isValidEmail` | `" a@b.co "` / `"a@b.c"` | `true` / `false` |

## Dominio

| Función | Archivo | Reglas |
|---|---|---|
| `dueLabel(invoice)` | `utils/invoices.ts` | [Facturas](../funcionalidades/facturas-y-deudores.md#facturas) |
| `creditState(credit)` | `utils/credits.ts` | [Mi plan](../funcionalidades/cuenta-y-plan.md#mi-plan) |
| `isTokenExpired(token, marginMs = 60000)` | `utils/jwt.ts` | `true` si el `exp` ya pasó; `false` si el token no se puede leer (decide el backend) |
| `toSessionUser(user)` | `api/auth.ts` | Descarta `records` y `billy_configuration` |
| `blocksToPlainText` / `plainTextToBlocks` | `api/billyConfiguration.ts` | [Plantilla](../funcionalidades/cobranza-automatica.md#plantilla) |
| `errorMessage(error, fallback)` | `hooks/useQuery.ts` | Mensaje de un `ApiError` o `fallback` |
