import { useEffect, useState } from "react";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { PokemonRow, ROW } from "../components/PokemonRow";
import { API, get, idOf } from "../lib/pokeapi";
import { num, pretty, useTheme } from "../theme";

type Entry = { name: string; url: string };

const COUNT = 1025; // Pokédex nacional; después de esa id solo hay formas alternativas (megas, regionales...)

const cry = (url: string) =>
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${idOf(url)}.ogg`;

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
          renderItem={({ item, index }) => (
            <PokemonRow
              index={index}
              name={item.name}
              url={item.url}
              onPress={() => {
                Haptics.selectionAsync();
                playCry(item.url);
                router.push(`/pokemon/${item.name}`);
              }}
            />
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
  iconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
