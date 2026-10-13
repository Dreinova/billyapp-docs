---
title: Facturas y deudores
description: Listados paginados con búsqueda, filtros y orden en el servidor, y detalles de facturas y deudores.
sidebar_label: Facturas y deudores
---

Las facturas (`invoices`) y los deudores (`clients`) se cargan desde la web o desde la integración configurada. **La app solo los consulta.** El backend limita todo al usuario autenticado: los deudores por `billy_user` y las facturas por `client.billy_user`.

## Paginación {/* #paginacion */}

Ambos listados usan `usePaginatedQuery` ([Datos y estado](../arquitectura/datos-y-estado.md#usepaginatedquery)):

- Páginas de **25 facturas** y **30 deudores**, con scroll infinito (`onEndReached`) y un botón **Cargar más** de respaldo (`LoadMoreFooter`).
- Búsqueda, filtros y orden se resuelven **en el servidor**, porque una lista local parcial no puede responderlos.
- Si cambian los filtros mientras llega una página, la respuesta vieja se descarta.

## Facturas {/* #facturas */}

`app/(app)/(tabs)/facturas.tsx` → `listInvoices(token, { search, etapa, sort, page })`.

![Listado de facturas](/img/screens/02-facturas.png)

| Parámetro | Valor |
|---|---|
| Búsqueda | `filters[number][$containsi]` (número de factura, *debounce* de 350 ms) |
| Etapa | `filters[etapa][name][$eq]` |
| Orden | Ver tabla; siempre con `id:desc` al final como desempate estable |
| Página | `pagination[page]`, `pagination[pageSize]=25` |

| Orden | `sort` |
|---|---|
| Vencimiento más reciente (por defecto) | `due_date:desc`, `id:desc` |
| Mayor monto | `amount:desc`, `due_date:desc`, `id:desc` |
| Más días en mora | `days_outstanding:desc`, `due_date:desc`, `id:desc` |

:::info Por qué nunca se filtra por `client`
El *ownership scoping* del backend (`src/utils/ownership.js`) mezcla su filtro de dueño en `ctx.query.filters` con un *spread* superficial: un filtro del cliente sobre la clave `client` quedaría sobrescrito. Las claves `number` y `etapa` no colisionan. Una prueba (`client.test.ts`) verifica que la app nunca envíe `filters[client]`.
:::

### Etapas y conteos

Las etapas son una colección global (`GET /etapas`). Para los chips, la app pide el total por etapa con consultas de una sola fila (`countInvoices`) y muestra solo las que tienen facturas con la búsqueda actual. Si esa carga falla, se ocultan los chips y el listado sigue funcionando.

La hoja **Ordenar y filtrar** trabaja con un borrador; el botón muestra "Ver N facturas" cuando conoce el total.

### Fila de factura

`InvoiceRow` muestra deudor, monto, número, vencimiento (`dueLabel`, en `src/utils/invoices.ts`) y etapa:

| Condición | Texto |
|---|---|
| `days_outstanding > 0` | "42 días en mora" (rojo) |
| Vence hoy o después | "Vence 13 oct" |
| Venció | "Vencía 12 oct" |
| Sin fecha | "Sin vencimiento" |

`due_date` es un campo `date` de Strapi y se interpreta como fecha local ([Utilidades](../referencia/utilidades.md#fechas)).

## Detalle de factura {/* #detalle-de-factura */}

`app/(app)/factura/[id].tsx` → `GET /invoices/:documentId`. El backend verifica el dueño y siempre agrega `populate` de `etapa`, `client` y `records`. Muestra vencimiento, monto, honorarios (`collection_fees`), el deudor (enlace a su detalle) y etapa, días en mora y estado.

## Deudores {/* #deudores */}

`app/(app)/(tabs)/deudores.tsx` → `listClients(token, { search, page })`.

![Listado de deudores](/img/screens/03-deudores.png)

- Orden `name:asc`, `id:asc`; páginas de 30.
- Búsqueda en el servidor por nombre **o** correo: `filters[$or][0][name][$containsi]` y `filters[$or][1][email][$containsi]`. Sin distinguir mayúsculas; las tildes dependen de la *collation* de la base.

## Detalle de deudor {/* #detalle-de-deudor */}

`app/(app)/deudor/[id].tsx` → `GET /clients/:documentId?populate[invoices][populate][0]=etapa`. Muestra el monto total y la cantidad de facturas, y la lista completa de sus facturas (sin paginar).
