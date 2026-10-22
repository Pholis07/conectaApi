export const API = "https://pokeapi.co/api/v2";

const cache = new Map<string, Promise<any>>();

// Cada URL se pide una sola vez por sesión; una petición fallida se olvida para poder reintentar.
export const get = (url: string): Promise<any> => {
  let hit = cache.get(url);
  if (!hit) {
    hit = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    hit.catch(() => cache.delete(url));
    cache.set(url, hit);
  }
  return hit;
};

export const idOf = (url: string) => url.split("/").filter(Boolean).pop()!;

export type Pokemon = {
  id: number;
  name: string;
  types: string[];
  stats: Record<string, number>;
  artwork: string;
  front: string;
  back: string;
  speciesUrl: string;
};

// Único lugar que conoce la forma de /pokemon/<x>; las pantallas reciben este tipo.
export const fetchPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  const p = await get(`${API}/pokemon/${nameOrId}`);
  return {
    id: p.id,
    name: p.name,
    types: p.types.map((x: any) => x.type.name),
    stats: Object.fromEntries(p.stats.map((s: any) => [s.stat.name, s.base_stat])),
    artwork: p.sprites.other["official-artwork"].front_default ?? p.sprites.front_default,
    front: p.sprites.front_default,
    back: p.sprites.back_default ?? p.sprites.front_default,
    speciesUrl: p.species.url,
  };
};
