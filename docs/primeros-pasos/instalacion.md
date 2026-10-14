---
title: Instalación y ejecución local
description: Requisitos, instalación, archivos locales y formas de ejecutar BillyApp en desarrollo.
sidebar_label: Instalación
---

## Requisitos

| Herramienta | Uso | Notas |
|---|---|---|
| Node.js + npm | Dependencias y CLI de Expo | LTS compatible con Expo SDK 57. Usar **npm** (hay `package-lock.json`). |
| Android Studio + JDK | `npm run android` | La app usa `expo-dev-client` y módulos nativos. |
| Xcode (macOS) | `npm run ios` | — |
| EAS CLI `>= 13` | Builds y envío | `eas.json` → `cli.version` |
| Dispositivo físico | Biometría y push | Las push remotas requieren un dispositivo real. |

## Instalación

```bash
cd billy-app
npm install
```

Archivos locales que **no** están en git:

| Archivo | Para qué | Cómo obtenerlo |
|---|---|---|
| `.env` | `EXPO_PUBLIC_API_BASE_URL` | Crear a mano (ver abajo) |
| `google-services.json` | FCM (push en Android) | Consola de Firebase del proyecto de Oblicua |

```bash title=".env"
EXPO_PUBLIC_API_BASE_URL=https://<host-de-strapi>/api
```

:::warning[Por defecto apuntas a producción]
Sin `.env`, todas las lecturas **y escrituras** (perfil, configuración de cobranza, imágenes) van contra producción. Guardar una configuración también **reprograma los cobros reales** de esa cuenta ([Cobranza automática](../funcionalidades/cobranza-automatica.md#ejecucion)). Usa un Strapi de pruebas (`gcp-strapi-billy`, `npm run develop`).
:::

## Ejecutar

| Script | Comando | Cuándo |
|---|---|---|
| `npm start` | `expo start` | Metro para un *development build* ya instalado |
| `npm run android` / `ios` | `expo run:*` | Genera `android/`/`ios/` (CNG, ignorados), compila e instala |
| `npm run check` | `typecheck` + `lint` + `test` | Antes de cada commit ([Calidad](../calidad.md)) |
| `npm run web` | `expo start --web` | Existe, pero la app no soporta web |

```bash
npm run android   # primera vez y tras cambios nativos o de app.json
npm start         # siguientes sesiones, solo JS
```

`android/` e `ios/` se regeneran desde `app.json` + `app.config.js`; no se editan a mano.

### Expo Go

No recomendado: sin push remotas en Android (la app lo tolera) y sin la configuración nativa propia.

## Primer ingreso

Entra con una cuenta de Billy o créala desde **Crear cuenta**. Tras el primer ingreso con contraseña aparece la opción de huella o Face ID (después de "Cerrar sesión").
