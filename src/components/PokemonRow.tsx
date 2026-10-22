import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from "react-native-reanimated";
import { fetchPokemon, idOf } from "../lib/pokeapi";
import { num, pretty, radius, TYPE_COLORS, useTheme } from "../theme";
import { TypeChip } from "./TypeChip";

const GAP = 8;
export const ROW = 72 + GAP; // alto fijo de fila: permite getItemLayout

const sprite = (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

type Props = { name: string; url: string; index: number; onPress: () => void };

export function PokemonRow({ name, url, index, onPress }: Props) {
  const t = useTheme();
  const id = idOf(url);
  const [types, setTypes] = useState<string[]>([]);
  const scale = useSharedValue(1);
  const press = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  // Los tipos no vienen en la lista: se piden al aparecer la fila (y quedan en caché para el detalle).
  useEffect(() => {
    let off = false;
    fetchPokemon(name).then(
      (p) => !off && setTypes(p.types),
      () => {},
    ); // sin tipos la fila sigue siendo usable
    return () => {
      off = true;
    };
  }, [name]);

  const accent = types[0] ? TYPE_COLORS[types[0]] : undefined;

  return (
    // `entering` y el rebote van en vistas distintas: si comparten transform, la entrada pisa el rebote
    <Animated.View
      entering={FadeInRight.delay(Math.min(index, 8) * 45)
        .springify()
        .damping(14)} // cascada solo en las primeras filas
      style={styles.wrap}
    >
      <Animated.View style={[styles.inner, press]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${pretty(name)}, ${num(id)}`}
          android_ripple={{ color: t.line }}
          onPressIn={() => scale.set(withSpring(0.97))}
          onPressOut={() => scale.set(withSpring(1, { damping: 8 }))}
          style={[styles.row, { backgroundColor: accent ? `${accent}${t.rowWash}` : t.card }]}
          onPress={onPress}
        >
          <View style={[styles.disc, { backgroundColor: accent ?? t.line }]}>
            <Image source={{ uri: sprite(id) }} style={styles.img} recyclingKey={name} />
          </View>
          <View style={styles.text}>
            <Text style={[styles.name, { color: t.text }]} numberOfLines={1}>
              {pretty(name)}
            </Text>
            <View style={styles.chips}>
              {types.map((ty) => (
                <Animated.View key={ty} entering={ZoomIn.springify().damping(12)}>
                  <TypeChip type={ty} small />
                </Animated.View>
              ))}
            </View>
          </View>
          <Text style={[styles.num, { color: t.sub }]}>{num(id)}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: ROW - GAP, marginBottom: GAP },
  inner: { flex: 1 },
  row: {
    flex: 1,
    borderRadius: radius.row,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
  },
  disc: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  img: { width: 56, height: 56 },
  text: { flex: 1, gap: 4 },
  name: { fontSize: 17, fontWeight: "700", textTransform: "capitalize" },
  chips: { flexDirection: "row", gap: 6, minHeight: 20 }, // altura reservada: no hay salto al llegar los tipos
  num: { fontSize: 15, fontWeight: "600", fontVariant: ["tabular-nums"], paddingRight: 8 },
});
