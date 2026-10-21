import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

type Detail = {
  id: number;
  artwork: string;
  types: string[];
  stats: { name: string; value: number }[];
  description: string;
};

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD",
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP", attack: "Ataque", defense: "Defensa",
  "special-attack": "At. esp.", "special-defense": "Def. esp.", speed: "Velocidad",
};

const MAX_STAT = 255; // tope teórico de un stat base

const get = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export default function PokemonDetail() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, s] = await Promise.all([
          get(`https://pokeapi.co/api/v2/pokemon/${name}`),
          get(`https://pokeapi.co/api/v2/pokemon-species/${name}`),
        ]);
        const entry = s.flavor_text_entries.find((e: any) => e.language.name === "es");
        if (cancelled) return;
        setData({
          id: p.id,
          artwork: p.sprites.other["official-artwork"].front_default ?? p.sprites.front_default,
          types: p.types.map((t: any) => t.type.name),
          stats: p.stats.map((st: any) => ({ name: st.stat.name, value: st.base_stat })),
          description: entry ? entry.flavor_text.replace(/[\n\f]/g, " ") : "Sin descripción en español.",
        });
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [name]);

  return (
    <>
      <Stack.Screen options={{ title: name }} />
      {!data ? (
        <View style={styles.center}>{error ? <Text>{error}</Text> : <ActivityIndicator size="large" />}</View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Image source={{ uri: data.artwork }} style={styles.artwork} resizeMode="contain" />
          <Text style={styles.name}>
            {name} <Text style={styles.num}>#{data.id}</Text>
          </Text>
          <View style={styles.chips}>
            {data.types.map((t) => (
              <Text key={t} style={[styles.chip, { backgroundColor: TYPE_COLORS[t] ?? "#777" }]}>
                {t}
              </Text>
            ))}
          </View>
          <Text style={styles.desc}>{data.description}</Text>
          {data.stats.map((s) => (
            <View key={s.name} style={styles.statRow}>
              <Text style={styles.statLabel}>{STAT_LABELS[s.name] ?? s.name}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <View style={styles.track}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${(s.value / MAX_STAT) * 100}%`,
                      backgroundColor: TYPE_COLORS[data.types[0]] ?? "#777",
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 16, alignItems: "center", gap: 12 },
  artwork: { width: 240, height: 240 },
  name: { fontSize: 28, fontWeight: "bold", textTransform: "capitalize" },
  num: { fontSize: 18, color: "#888", fontWeight: "normal" },
  chips: { flexDirection: "row", gap: 8 },
  chip: {
    color: "#fff", fontWeight: "bold", textTransform: "capitalize",
    paddingHorizontal: 14, paddingVertical: 4, borderRadius: 14, overflow: "hidden",
  },
  desc: { fontSize: 16, textAlign: "center", marginVertical: 8 },
  statRow: { flexDirection: "row", alignItems: "center", gap: 8, width: "100%" },
  statLabel: { width: 90, fontWeight: "600" },
  statValue: { width: 36, textAlign: "right" },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: "#e5e5e5", overflow: "hidden" },
  bar: { height: "100%", borderRadius: 5 },
});
