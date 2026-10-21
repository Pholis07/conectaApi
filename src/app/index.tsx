import { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text } from "react-native";

type Pokemon = { name: string; url: string };

const sprite = (url: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${url.split("/").filter(Boolean).pop()}.png`;

const id = (url: string) => url.split("/").filter(Boolean).pop();
const cry = (url: string) =>
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id(url)}.ogg`;

export default function Index() {
  const player = useAudioPlayer(null); // un solo reproductor, se reemplaza la fuente al tocar
  const playCry = (url: string) => {
    player.replace({ uri: cry(url) });
    player.play();
  };
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [next, setNext] = useState<string | null>("https://pokeapi.co/api/v2/pokemon?limit=30");
  const [loading, setLoading] = useState(false);
  const busy = useRef(false); // evita cargas duplicadas antes de que loading se actualice
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!next || busy.current) return;
    busy.current = true;
    setLoading(true);
    try {
      const res = await fetch(next);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPokemons((prev) => [...prev, ...data.results]);
      setNext(data.next);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial al montar
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlatList
      data={pokemons}
      keyExtractor={(p) => p.name}
      contentContainerStyle={styles.list}
      onEndReached={load}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <Pressable style={styles.row} onPress={() => {
            playCry(item.url);
            router.push(`/pokemon/${item.name}`);
          }}>
          <Image source={{ uri: sprite(item.url) }} style={styles.img} />
          <Text style={styles.name}>{item.name}</Text>
        </Pressable>
      )}
      ListFooterComponent={
        loading ? (
          <ActivityIndicator style={styles.footer} />
        ) : error ? (
          <Text style={styles.footer}>{error}</Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  img: { width: 64, height: 64 },
  name: { fontSize: 18, textTransform: "capitalize" },
  footer: { padding: 16, textAlign: "center" },
});
