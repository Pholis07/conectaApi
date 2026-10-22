import { useEffect, useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { API, get, idOf } from "../lib/pokeapi";
import { num, pretty, radius, useTheme } from "../theme";

type Entry = { name: string; url: string };

const COUNT = 1025; // Pokédex nacional; después de esa id solo hay formas alternativas (megas, regionales...)

const sprite = (url: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idOf(url)}.png`;

const cry = (url: string) =>
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${idOf(url)}.ogg`;

const GAP = 8;
const ROW = 72 + GAP; // alto fijo de fila: permite getItemLayout

export default function Index() {
  const t = useTheme();
  const player = useAudioPlayer(null); // un solo reproductor, se reemplaza la fuente al tocar
  const playCry = (url: string) => {
    player.replace({ uri: cry(url) });
    player.play();
  };
  const [all, setAll] = useState<Entry[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  const load = () => {
    setError(false);
    get(`${API}/pokemon?limit=${COUNT}`).then((d) => setAll(d.results), () => setError(true));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial al montar
    load();
  }, []);

  const q = query.trim().toLowerCase();
  const data = all && q ? all.filter((p) => pretty(p.name).includes(q) || num(idOf(p.url)).includes(q)) : all;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Pokédex",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: { backgroundColor: t.bg },
          headerSearchBarOptions: {
            placeholder: "Buscar por nombre o número",
            autoCapitalize: "none",
            onChangeText: (e) => setQuery(e.nativeEvent.text),
          },
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir cámara"
              hitSlop={8}
              style={styles.iconBtn}
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/camara");
              }}
            >
              <Ionicons name="camera-outline" size={26} color={t.tint} />
            </Pressable>
          ),
        }}
      />
      {!data ? (
        <View style={styles.center}>
          {error ? (
            <>
              <Text style={[styles.msg, { color: t.sub }]}>No se pudo cargar la Pokédex. Revisa tu conexión.</Text>
              <Button title="Reintentar" onPress={load} />
            </>
          ) : (
            <ActivityIndicator size="large" color={t.tint} />
          )}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(p) => p.name}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.list}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          getItemLayout={(_, i) => ({ length: ROW, offset: ROW * i, index: i })}
          ListEmptyComponent={<Text style={[styles.msg, { color: t.sub }]}>Sin resultados para “{query}”.</Text>}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${pretty(item.name)}, ${num(idOf(item.url))}`}
              android_ripple={{ color: t.line }}
              style={({ pressed }) => [styles.row, { backgroundColor: t.card }, pressed && styles.pressed]}
              onPress={() => {
                Haptics.selectionAsync();
                playCry(item.url);
                router.push(`/pokemon/${item.name}`);
              }}
            >
              <View style={[styles.disc, { backgroundColor: t.bg }]}>
                <Image source={{ uri: sprite(item.url) }} style={styles.img} recyclingKey={item.name} />
              </View>
              <Text style={[styles.name, { color: t.text }]} numberOfLines={1}>
                {pretty(item.name)}
              </Text>
              <Text style={[styles.num, { color: t.sub }]}>{num(idOf(item.url))}</Text>
            </Pressable>
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  msg: { fontSize: 16, textAlign: "center", padding: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    height: ROW - GAP, marginBottom: GAP, borderRadius: radius.row, overflow: "hidden",
    flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 8,
  },
  pressed: { opacity: 0.6 },
  disc: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  img: { width: 56, height: 56 },
  name: { flex: 1, fontSize: 17, fontWeight: "600", textTransform: "capitalize" },
  num: { fontSize: 15, fontVariant: ["tabular-nums"], paddingRight: 8 },
  iconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
