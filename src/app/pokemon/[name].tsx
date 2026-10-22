import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Button } from "../../components/Button";
import { TypeChip } from "../../components/TypeChip";
import { fetchPokemon, get, type Pokemon } from "../../lib/pokeapi";
import { num, pretty, radius, TYPE_COLORS, useTheme } from "../../theme";

const STAT_LABELS: Record<string, string> = {
  hp: "PS", attack: "Ataque", defense: "Defensa",
  "special-attack": "At. esp.", "special-defense": "Def. esp.", speed: "Velocidad",
};

const MAX_STAT = 255; // tope teórico de un stat base

export default function PokemonDetail() {
  const t = useTheme();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [data, setData] = useState<{ p: Pokemon; description: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await fetchPokemon(name);
        const s = await get(p.speciesUrl); // las formas (deoxys-normal...) no existen como species por nombre
        const entry = s.flavor_text_entries.find((e: any) => e.language.name === "es");
        if (cancelled) return;
        setData({ p, description: entry ? entry.flavor_text.replace(/[\n\f]/g, " ") : "Sin descripción en español." });
      } catch {
        if (!cancelled) setError("No se pudo cargar este Pokémon. Revisa tu conexión.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [name]);

  const accent = data ? (TYPE_COLORS[data.p.types[0]] ?? t.tint) : t.tint;

  return (
    <>
      <Stack.Screen options={{ title: pretty(name) }} />
      {!data ? (
        <View style={styles.center}>
          {error ? <Text style={[styles.error, { color: t.sub }]}>{error}</Text> : <ActivityIndicator size="large" color={t.tint} />}
        </View>
      ) : (
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
          <View style={[styles.hero, { backgroundColor: `${accent}${t.wash}` }]}>
            <Image source={{ uri: data.p.artwork }} style={styles.artwork} contentFit="contain" />
          </View>

          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={[styles.name, { color: t.text }]}>{pretty(name)}</Text>
              <Text style={[styles.num, { color: t.sub }]}>{num(data.p.id)}</Text>
            </View>

            <View style={styles.chips}>
              {data.p.types.map((ty) => <TypeChip key={ty} type={ty} />)}
            </View>

            <Text style={[styles.desc, { color: t.text }]}>{data.description}</Text>

            <Button
              title="Combatir"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/batalla/${name}`);
              }}
            />

            <View style={[styles.stats, { backgroundColor: t.card }]}>
              <Text style={[styles.section, { color: t.text }]}>Estadísticas base</Text>
              {Object.entries(data.p.stats).map(([stat, value], i) => (
                <Animated.View key={stat} entering={FadeInDown.delay(i * 50)} style={styles.statRow}>
                  <Text style={[styles.statLabel, { color: t.sub }]}>{STAT_LABELS[stat] ?? stat}</Text>
                  <Text style={[styles.statValue, { color: t.text }]}>{value}</Text>
                  <View style={[styles.track, { backgroundColor: t.track }]}>
                    <View style={[styles.bar, { width: `${(value / MAX_STAT) * 100}%`, backgroundColor: accent }]} />
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  error: { fontSize: 16, textAlign: "center" },
  content: { paddingBottom: 32 },
  hero: { alignItems: "center", paddingVertical: 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  artwork: { width: 260, height: 260 },
  body: { padding: 20, gap: 16 },
  titleRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  name: { fontSize: 32, fontWeight: "700", textTransform: "capitalize", letterSpacing: -0.5 },
  num: { fontSize: 17, fontVariant: ["tabular-nums"] },
  chips: { flexDirection: "row", gap: 8 },
  desc: { fontSize: 17, lineHeight: 24, maxWidth: 560 },
  stats: { borderRadius: radius.card, padding: 16, gap: 12 },
  section: { fontSize: 17, fontWeight: "600" },
  statRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statLabel: { width: 84, fontSize: 15 },
  statValue: { width: 36, fontSize: 15, fontWeight: "600", textAlign: "right", fontVariant: ["tabular-nums"] },
  track: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  bar: { height: "100%", borderRadius: 4 },
});
