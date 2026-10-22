import { useColorScheme } from "react-native";

const light = {
  bg: "#F5F5F7", card: "#FFFFFF", text: "#111318", sub: "#6B7080", line: "#E4E5EA",
  tint: "#2B59FF", onTint: "#FFFFFF", track: "#E4E5EA", wash: "2E",
};
const dark = {
  bg: "#0E0F12", card: "#1A1C21", text: "#F2F3F5", sub: "#9A9FAD", line: "#2A2D34",
  tint: "#7A9BFF", onTint: "#0E0F12", track: "#2A2D34", wash: "47",
};

export const useTheme = () => (useColorScheme() === "dark" ? dark : light);

export const radius = { card: 20, row: 16, button: 14, chip: 999 };

export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD",
};

export const TYPE_ES: Record<string, string> = {
  normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico",
  grass: "Planta", ice: "Hielo", fighting: "Lucha", poison: "Veneno",
  ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro",
  steel: "Acero", fairy: "Hada",
};

// Texto negro o blanco según la luminancia del fondo, para que el chip siempre cumpla contraste.
export const onColor = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#111318" : "#FFFFFF";
};

export const pretty = (name: string) => name.replace(/-/g, " ");
export const num = (id: number | string) => `#${String(id).padStart(3, "0")}`;

export const hpColor = (ratio: number) => (ratio > 0.5 ? "#34C759" : ratio > 0.2 ? "#FF9F0A" : "#FF453A");

// Controles sobre el video de la cámara: no dependen del tema.
export const overlay = { scrim: "rgba(0,0,0,0.5)", icon: "#FFFFFF" };
