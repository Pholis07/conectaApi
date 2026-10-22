import assert from "node:assert/strict";
import { damage } from "./battle.ts";

const f = (attack, defense) => ({ name: "x", front: "", back: "", hp: 50, attack, defense });

assert.equal(damage(f(100, 1), f(1, 100), 0.5), 20); // ataque = defensa: 20 base
assert.equal(damage(f(100, 1), f(1, 100), 0), 17); // tirada mínima: -15%
assert.equal(damage(f(100, 1), f(1, 100), 1), 23); // tirada máxima: +15%
assert.equal(damage(f(100, 1), f(1, 200), 0.5), 10); // el doble de defensa: la mitad de daño
assert.equal(damage(f(1, 1), f(1, 255), 0.5), 1); // nunca menos de 1
console.log("battle: ok");
