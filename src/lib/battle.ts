import type { Pokemon } from "./pokeapi";

export type Fighter = { name: string; front: string; back: string; hp: number; attack: number; defense: number };

export const toFighter = (p: Pokemon): Fighter => ({
  name: p.name, front: p.front, back: p.back,
  hp: p.stats.hp, attack: p.stats.attack, defense: p.stats.defense,
});

// shortcut: sin tipos ni velocidad, el jugador siempre ataca primero; subir a tabla de tipos si hace falta
export const damage = (a: Fighter, d: Fighter, roll = Math.random()) =>
  Math.max(1, Math.round((a.attack / d.defense) * 20 * (0.85 + roll * 0.3)));
