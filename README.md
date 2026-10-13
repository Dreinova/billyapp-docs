# BillyApp · Documentación técnica

Sitio [Docusaurus](https://docusaurus.io/) con la documentación técnica de `billy-app`, la app móvil de cobranza automática de Oblicua.

## Uso

```bash
npm install
npm start        # servidor local con recarga en caliente
npm run build    # sitio estático en build/
npm run serve    # sirve build/ localmente
```

## Estructura

| Ruta | Contenido |
|---|---|
| `docs/` | Páginas de documentación (el orden se define en `sidebars.ts`) |
| `src/pages/index.tsx` | Portada |
| `src/components/Billy/` | Componentes MDX: `Badge`, `Swatches`, `ScreenGallery` |
| `src/css/custom.css` | Tema: tokens de `billy-app/src/ui/theme.ts` aplicados a Infima, modo claro y oscuro |
| `static/img/` | Logotipo, favicon y capturas copiadas de `billy-app/assets` |

## Mantenimiento

- El código de `billy-app` es la fuente de verdad. Al cambiar una pantalla, un endpoint o un token de diseño, actualizar la página correspondiente.
- Los enlaces rotos (incluidos anclajes) hacen fallar el build: `onBrokenLinks`, `onBrokenAnchors` y `onBrokenMarkdownLinks` están en `throw`.
- Usar IDs explícitos (`## Título {#id}`) en encabezados que se enlacen desde otras páginas.
- No copiar valores de `.env`, `google-services.json` ni credenciales.
- `url` en `docusaurus.config.ts` es provisional (`http://localhost:3000`); cambiarla al publicar.
