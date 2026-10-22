import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { fetchPokemon, idOf } from "../lib/pokeapi";
import { num, pretty, radius, TYPE_COLORS, useTheme } from "../theme";
import { TypeChip } from "./TypeChip";

const GAP = 8;
export const ROW = 72 + GAP; // alto fijo de fila: permite getItemLayout

const sprite = (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export function PokemonRow({ name, url, onPress }: { name: string; url: string; onPress: () => void }) {
  const t = useTheme();
  const id = idOf(url);
  const [types, setTypes] = useState<string[]>([]);

  // Los tipos no vienen en la lista: se piden al aparecer la fila (y quedan en caché para el detalle).
  useEffect(() => {
    let off = false;
    fetchPokemon(name).then((p) => !off && setTypes(p.types), () => {}); // sin tipos la fila sigue siendo usable
    return () => {
      off = true;
    };
  }, [name]);

  const accent = types[0] ? TYPE_COLORS[types[0]] : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${pretty(name)}, ${num(id)}`}
      android_ripple={{ color: t.line }}
      style={({ pressed }) => [styles.row, { backgroundColor: t.card }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.disc, { backgroundColor: accent ? `${accent}${t.wash}` : t.bg }]}>
        <Image source={{ uri: sprite(id) }} style={styles.img} recyclingKey={name} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.name, { color: t.text }]} numberOfLines={1}>{pretty(name)}</Text>
        <View style={styles.chips}>
          {types.map((ty) => <TypeChip key={ty} type={ty} small />)}
        </View>
      </View>
      <Text style={[styles.num, { color: t.sub }]}>{num(id)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: ROW - GAP, marginBottom: GAP, borderRadius: radius.row, overflow: "hidden",
    flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 8,
  },
  pressed: { opacity: 0.6 },
  disc: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  img: { width: 56, height: 56 },
  text: { flex: 1, gap: 4 },
  name: { fontSize: 17, fontWeight: "600", textTransform: "capitalize" },
  chips: { flexDirection: "row", gap: 6, minHeight: 20 }, // altura reservada: no hay salto al llegar los tipos
  num: { fontSize: 15, fontVariant: ["tabular-nums"], paddingRight: 8 },
});
