---
title: Componentes
description: Catálogo de componentes de src/ui y src/components, con props, comportamiento y accesibilidad.
sidebar_label: Componentes
---

Todos se exportan desde `src/ui/index.ts`:

```tsx
import { Screen, NavHeader, Button, TextField, ListGroup, ListItem, useToast, colors } from "../src/ui";
```

Los tokens que usan están en [Sistema de diseño](./sistema-de-diseno.mdx).

## Estructura de pantalla

### `Screen`

Contenedor de toda pantalla: safe area superior, `header` fijo, contenido con scroll y `footer` fijo opcional.

| Prop | Tipo | Por defecto | Notas |
|---|---|---|---|
| `header` | `ReactNode` | — | `LargeHeader` o `NavHeader` |
| `footer` | `ReactNode` | — | Barra inferior con borde superior; respeta el safe area. Activa `keyboard` |
| `scroll` | `boolean` | `true` | `false` para pantallas con `FlatList` propia |
| `background` | `"background" \| "surface"` | `"background"` | `surface` en auth y WebView |
| `refreshing`, `onRefresh` | | — | Pull-to-refresh con color `primary` |
| `inTabs` | `boolean` | — | Ajusta el padding inferior sobre la tab bar |
| `keyboard` | `boolean` | `!!footer` | Envuelve en `KeyboardAvoidingView` (iOS: `padding`) |
| `contentStyle` | `StyleProp` | — | Por defecto: gutter 20, gap 24 |

### `LargeHeader` · `NavHeader`

- `LargeHeader({ title, eyebrow?, right? })`: título `title1` alineado a la izquierda, para las tabs.
- `NavHeader({ title?, subtitle?, right?, onBack? })`: botón volver (`ChevronLeft`, etiqueta "Volver") + título centrado. Sin `onBack`, vuelve atrás o reemplaza por `/`.

## Acciones

### `Button`

| Prop | Valores | Por defecto |
|---|---|---|
| `variant` | `primary` · `secondary` · `tonal` · `ghost` · `danger` · `destructive` | `primary` |
| `size` | `lg` (52) · `md` (44) · `sm` (36) | `lg` |
| `block` | Ocupa todo el ancho | `true` si `size="lg"` |
| `icon` | `LucideIcon` | — |
| `loading` | Muestra `ActivityIndicator` y deshabilita | `false` |
| `disabled` | Opacidad 0,4 | `false` |

| Variante | Fondo | Texto | Uso real |
|---|---|---|---|
| `primary` | `primary` | blanco | Acción principal (Guardar, Iniciar sesión) |
| `secondary` | `surface` + borde | `text` | Huella/Face ID, Cancelar, Cambiar imagen |
| `tonal` | `primarySoft` | `primaryStrong` | Recargar en Cuenta |
| `ghost` | transparente | `primaryStrong` | Sin uso actual |
| `danger` | `dangerSoft` | `danger` | Cerrar sesión |
| `destructive` | `danger` | blanco | Confirmación de `ConfirmSheet` destructivo |

Expone `accessibilityRole="button"` y `accessibilityState` con `disabled` y `busy`.

### `IconButton`

Botón circular sólo-ícono. `label` es **obligatorio** (etiqueta accesible). Variantes `plain`, `tonal`, `surface`. Si `size < 44` agrega `hitSlop` hasta 44.

### `PressableScale`

Base de todo lo presionable: escala a `scaleTo` (0,98) en 120 ms y aplica `pressedStyle` mientras se presiona.

## Formularios

### `TextField`

`forwardRef<TextInput>`; acepta todas las props de `TextInput` más:

| Prop | Descripción |
|---|---|
| `label` | Etiqueta `calloutStrong` vinculada por `accessibilityLabelledBy` |
| `helper` | Ayuda en `caption` (se oculta si hay error) |
| `error` | Borde `danger`, ícono y mensaje con `accessibilityLiveRegion="polite"` |
| `icon` | Ícono lucide a la izquierda |
| `trailing` | Nodo a la derecha (p. ej. "días") |
| `password` | Oculta el texto con botón "Mostrar/Ocultar contraseña" |
| `minHeight`, `multiline` | Multilínea con alto mínimo 120 |
| `editable={false}` | Fondo `surfaceMuted`, texto `textTertiary` |

:::note Sin estado de foco
`TextField` no cambia el borde al enfocarse: el estado de foco anterior causaba un error y se quitó a propósito. El foco lo indican el cursor y el teclado del sistema.
:::

### `SearchField`

Campo de búsqueda de 44 px con ícono `Search`, `returnKeyType="search"`, sin autocorrección y botón "Borrar búsqueda" cuando hay texto.

### `Switch` · `Checkbox`

- `Switch({ value, onValueChange, label })`: `Switch` nativo con pista `primary`; `label` es la etiqueta accesible.
- `Checkbox({ checked, onToggle, label, children? })`: caja de 22 px, `accessibilityRole="checkbox"`.

### `Chip` · `ChipRow` · `ToggleChip` · `ToggleChipGroup`

- `Chip`: filtro de selección única; seleccionado = relleno `text` (oscuro). Muestra `count` opcional. `ChipRow` lo desplaza horizontalmente hasta el borde.
- `ToggleChip`: opción múltiple con ícono; seleccionado = `primarySoft` + borde `primary`. Rol `checkbox`. Se usa para canales en [Tonos](../funcionalidades/cobranza-automatica.md#tonos).

## Contenido

| Componente | Descripción |
|---|---|
| `Text` | Único componente de texto: `variant`, `color` (token), `align`, `tabular`. Limita la escala de fuente a ×1,4. |
| `Card` | Superficie con borde, radio 16, padding 16. Con `onPress` se vuelve presionable. |
| `ListGroup` | Card única con filas separadas por divisores; `title` (overline) y `footer` opcionales. |
| `ListItem` | Fila con `leading`, `title`, `subtitle`, `trailing` y chevron automático si es presionable sin `trailing`. Alto mínimo 60. |
| `KeyValueRow` | Fila etiqueta / valor (alto mínimo 52); accesible como "etiqueta: valor". |
| `SectionHeader` | Título `title3` con acción tipo link opcional. |
| `ProgressBar` | Barra 0–100 con `accessibilityRole="progressbar"` y `accessibilityValue`. |
| `Divider` | Línea de 2 × hairline en `border`. |
| `Badge` | Píldora de 24 px con tono y punto opcional. |
| `Avatar` | Círculo con iniciales (`initials()`), `primarySoft` o sólido. |
| `IconTile` | Cuadro de radio 12 con ícono en un tono. |

## Feedback

| Componente | Descripción |
|---|---|
| `Skeleton`, `SkeletonList` | Placeholders que pulsan; `SkeletonList` imita una lista agrupada. |
| `LoadingView` | Spinner centrado (guard de sesión). |
| `EmptyState` | Ícono en tile de 64, título, mensaje y acción opcional. |
| `ErrorState` | `EmptyState` en tono `danger` con botón **Reintentar**; mensaje por defecto "Revisa tu conexión e intenta de nuevo." |
| `LoadMoreFooter` | Pie de listas paginadas: spinner, error con **Reintentar** o botón **Cargar más** (respaldo accesible del scroll infinito). Props: `hasMore`, `loading`, `error`, `onLoadMore`. |
| `Banner` | Aviso en línea `info`/`warning`/`danger`/`success`; `danger` tiene rol `alert`. |
| `ToastProvider` / `useToast` | Toast superior oscuro, 3 s, con `announceForAccessibility`. `show(message, "success" \| "error" \| "info")`. Reemplaza a `Alert.alert`. |
| `Sheet` | Bottom sheet modal (spring al abrir, 40 % de overlay, cierra tocando afuera o con "atrás" en Android). |
| `ConfirmSheet` | `Sheet` de confirmación con ícono, mensaje, botón de confirmar (`destructive` opcional) y Cancelar. |

## Componentes de dominio (`src/components`)

| Componente | Uso |
|---|---|
| `InvoiceRow` | Fila de factura; usa `dueLabel` de `src/utils/invoices.ts` (ver [Facturas](../funcionalidades/facturas-y-deudores.md#fila-de-factura)) |
| `GroupedRow` | Envuelve filas de `FlatList` para que parezcan un único `ListGroup` (bordes redondeados en la primera y la última) |
| `BrandMark` | Isotipo sobre tile violeta (pantalla de ingreso) |

## Accesibilidad

Patrones aplicados en los componentes:

- Roles y estados explícitos (`button`, `checkbox`, `header`, `link`, `progressbar`, `search`, `alert`; `selected`, `checked`, `expanded`, `busy`, `disabled`).
- Etiquetas obligatorias en botones sólo-ícono y switches.
- Errores anunciados con `accessibilityLiveRegion` y toasts con `announceForAccessibility`.
- Targets de 44 pt y escala de fuente limitada a ×1,4 para no romper layouts.
