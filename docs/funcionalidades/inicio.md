---
title: Inicio (dashboard)
description: Saldo de créditos, contadores de cobros y actividad reciente.
sidebar_label: Inicio
---

Pantalla `app/(app)/(tabs)/index.tsx`. Responde a "¿cuánto saldo me queda y qué hizo Billy últimamente?".

![Pantalla de inicio](/img/screens/01-inicio.png)

## Carga de datos

Tres peticiones en paralelo dentro de un único `useQuery`:

| Dato | Llamada | Si falla |
|---|---|---|
| Contadores | `getDashboardCounts(token)` → 2 × `GET /records` | Error de pantalla |
| Actividad | `listRecords(token, { pageSize: 10 })` | Error de pantalla |
| Perfil y plan | `getMe(token, user.documentId)` | Se ignora (`.catch(() => null)`) y se usa `user.balance` del login |

## Encabezado

- Fecha larga del día con `formatLongToday()` (por ejemplo "Martes, 29 de septiembre").
- Saludo con el primer nombre: "Hola, Julian".
- Avatar con iniciales que lleva a **Cuenta**.

## Tarjeta de saldo

| Caso | Valor mostrado | Barra de progreso |
|---|---|---|
| Plan con `isSuscription = true` | "Ilimitado" | No |
| Plan por créditos con `credits > 0` | `balance` + "créditos" | Sí: `min(100, round(balance / credits × 100))` % disponible |
| Sin plan o `credits = 0` | `balance` + "créditos" | No; texto "Tu saldo para enviar cobros" |

`balance` se toma de `profile.balance`, luego `user.balance`, y si no es numérico vale 0 (en el backend es un `string`). El nombre del plan aparece como píldora. **Recargar** abre [`/planes`](./cuenta-y-plan.md#recarga).

:::caution Saldo ambiguo
La web muestra aquí `balance − total de records`, y la app muestra `balance`. Ninguno es un saldo calculado por el backend ([detalle](./cuenta-y-plan.md#saldo)).
:::

## Contadores

`getDashboardCounts` pide `/records` con `pageSize=1` y lee `meta.pagination.total`:

| Tarjeta | Filtro |
|---|---|
| Cobros este mes | `filters[createdAt][$gte]` = primer día del mes **en hora local** convertido a ISO (UTC) |
| Cobros totales | Sin filtro |

Cada *record* es un mensaje de cobro enviado. `record.find` fuerza `filters.billy_user` al usuario autenticado y agrega `populate` de `invoice.client`, `invoice.etapa` y `channel`.

## Actividad reciente

Los 10 *records* más recientes (`sort=createdAt:desc`). Cada fila muestra:

| Elemento | Origen |
|---|---|
| Título | `invoice.client.name` o "Deudor" |
| Subtítulo | `invoice.number · invoice.etapa.name`, o el nombre del canal, o "Cobro" |
| Ícono | Según `channel.name`: contiene "whats" → `MessageCircle`; "sms" → `MessageSquare`; otro → `Mail` |
| Monto | `formatCurrency(invoice.amount)` |
| Fecha | `formatRelativeDay(record.date ?? record.createdAt)` → "Hoy", "Ayer" o "27 sep" |

Tocar una fila con factura abre su [detalle](./facturas-y-deudores.md#detalle-de-factura). Si no hay cobros, un `EmptyState` invita a **Configurar cobranza** (`/config`).

## Estados

- **Carga:** skeletons de la tarjeta de saldo, dos contadores y cuatro filas.
- **Error:** `ErrorState` con reintento.
- **Pull-to-refresh:** habilitado sólo cuando el estado es `success`.
