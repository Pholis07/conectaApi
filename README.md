# Pokeconnect

App móvil hecha con [Expo](https://expo.dev) y Expo Router que consume la [PokeAPI](https://pokeapi.co): muestra una lista paginada de Pokémon y reproduce su grito al tocar cada fila.

## Requisitos

- [Node.js](https://nodejs.org) 20 o superior y npm
- Una de estas opciones para ver la app:
  - La app **Expo Go** en tu teléfono (iOS / Android)
  - Un emulador de Android (Android Studio) o simulador de iOS (Xcode, solo macOS)
  - Un navegador (modo web)
- Conexión a internet (la lista y los audios vienen de PokeAPI)

## Cómo correrla

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:

   ```bash
   npx expo start
   ```

3. Abre la app según tu caso:

   | Dónde | Cómo |
   | --- | --- |
   | Teléfono | Escanea el QR con Expo Go (Android) o la cámara (iOS). El teléfono y la PC deben estar en la misma red |
   | Android | Con el emulador abierto, presiona `a` en la terminal |
   | iOS | Presiona `i` en la terminal (solo macOS) |
   | Web | Presiona `w` en la terminal |

También hay atajos: `npm run android`, `npm run ios` y `npm run web`.

## Scripts

- `npm start`: servidor de desarrollo
- `npm run lint`: revisa el código con ESLint

## Problemas comunes

- **Expo Go no conecta:** usa `npx expo start --tunnel`, o revisa que ambos equipos estén en la misma red.
- **Cambios que no se reflejan:** reinicia con `npx expo start -c` para limpiar la caché.
