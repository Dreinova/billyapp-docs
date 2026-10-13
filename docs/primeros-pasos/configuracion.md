---
title: Configuración
description: Variables de entorno, app.json, app.config.js, eas.json, TypeScript, Babel, Jest y ESLint.
sidebar_label: Configuración
---

## Variables de entorno

| Variable | Dónde | Por defecto | Descripción |
|---|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | `.env` o EAS | `https://billyadmin.oblicua.co/api` | URL de la API de Strapi, con `/api`. Definida una sola vez en `src/api/client.ts`. |
| `GOOGLE_SERVICES_JSON` | EAS (variable de **archivo**) | `./google-services.json` | Ruta del archivo de Firebase que usa `app.config.js`. |

Las variables `EXPO_PUBLIC_*` se insertan en el bundle: no deben contener secretos ([Seguridad](../seguridad.md#secretos)). El `.env` está ignorado y EAS no lo sube ([Builds](../despliegue/builds-y-publicacion.md#variables-en-eas)).

## `app.json`

| Clave | Valor | Efecto |
|---|---|---|
| `name` / `slug` | `billy-app` | Proyecto Expo |
| `scheme` | `billy-app` | Deep links |
| `orientation` / `userInterfaceStyle` | `portrait` / `light` | Solo vertical; sin modo oscuro |
| `ios.bundleIdentifier`, `android.package` | `co.oblicua.billy` | Identificadores |
| `ios.supportsTablet` | `true` | Sin layout ni capturas de iPad |
| `android.permissions` | `USE_BIOMETRIC`, `USE_FINGERPRINT` | Biometría |
| `android.blockedPermissions` | `RECORD_AUDIO`, `SYSTEM_ALERT_WINDOW` | Elimina permisos que agregan librerías y plantillas |
| `android.versionCode` | `3` | Lo incrementa EAS en `production` |
| `extra.eas.projectId` | UUID | Necesario para el `ExpoPushToken` |

### Plugins

| Plugin | Configuración |
|---|---|
| `expo-router`, `expo-status-bar`, `expo-font` | — |
| `expo-splash-screen` | `splash-icon.png`, fondo blanco, ancho 200 |
| `expo-local-authentication` | Texto de Face ID en español |
| `expo-secure-store` | `configureAndroidBackup: true` y texto de Face ID |
| `expo-image-picker` | Texto de galería en español; `cameraPermission: false`, `microphonePermission: false` |
| `expo-notifications` | Ícono `assets/icon.png`, color `#6D58FF` |

## `app.config.js`

Extiende `app.json` y solo resuelve `android.googleServicesFile` desde `GOOGLE_SERVICES_JSON` (EAS) o el archivo local, que está ignorado por git.

```js
googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? config.android.googleServicesFile
```

## `eas.json`

| Perfil | Opciones | Resultado |
|---|---|---|
| `development` | `developmentClient: true`, `distribution: internal` | Development build |
| `preview` | `distribution: internal`, Android `apk` | APK de prueba |
| `production` | `autoIncrement: true` | AAB / IPA |

`cli.appVersionSource: "local"`: EAS escribe la versión en `app.json`. `submit.production` está vacío.

## Herramientas

| Archivo | Contenido |
|---|---|
| `tsconfig.json` | `expo/tsconfig.base` + `strict`. Con TypeScript 6 no se incluyen `@types` globales: las pruebas importan desde `@jest/globals`. |
| `babel.config.js` | Solo `babel-preset-expo` (se quitó el plugin de `react-native-paper`). |
| `package.json` → `jest` | Preset `jest-expo`, `globalSetup` con `TZ=America/Bogota`. |
| `eslint.config.js` | `eslint-config-expo/flat`; `react-hooks/set-state-in-effect` como aviso. |
| `.gitignore` | Ignora `/android`, `/ios`, `google-services.json`, `GoogleService-Info.plist`, `google-play-service-account*.json` y `.env`. |

## Fuentes

`app/_layout.tsx` carga Plus Jakarta Sans (400–700). El splash se oculta cuando cargan o fallan.
