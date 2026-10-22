# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users
Estudiantes de la UTCH (Desarrollo de Aplicaciones Móviles) que la presentan en clase y el profesor que la evalúa; también cualquier persona curiosa de Pokémon que la abra desde Expo Go.

## Product Purpose
Pokédex móvil hecha con Expo y Expo Router que consume la PokeAPI: lista paginada de Pokémon, ficha con arte, tipos, stats y descripción, combate por turnos contra un rival aleatorio y acceso a la cámara. Éxito: una demostración fluida y clara en clase, en teléfono real.

## Capabilities and Constraints
- Datos vía PokeAPI (sin cuenta, sin backend propio); requiere internet.
- Expo SDK 57 + Expo Router (rutas en `src/app/`), React Native 0.86, React Compiler activo; corre en Expo Go.
- Pantallas: lista (`index`), detalle (`pokemon/[name]`), combate (`batalla/[name]`), cámara (`camara`).
- Todo el texto visible va en español.
- Deben conservarse: el grito (audio) al tocar un Pokémon, el combate y la cámara, y la respuesta háptica en toques y golpes.

## Evidence on Hand
Sin logo ni identidad de marca propios; los sprites y el arte oficial vienen de PokeAPI. No hay capturas ni reseñas reales.

## Product Principles
- Funciona primero en el teléfono, con una mano.
- El Pokémon es el protagonista: la interfaz lo enmarca, no compite con él.
- Cada acción responde al instante (sonido, vibración, movimiento).
- Claridad antes que decoración: fácil de explicar en una demo.
