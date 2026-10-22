import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming,
} from "react-native-reanimated";
import { Button } from "../../components/Button";
import { damage, toFighter, type Fighter } from "../../lib/battle";
import { fetchPokemon } from "../../lib/pokeapi";
import { hpColor, pretty, radius, useTheme } from "../../theme";

const MAX_ID = 151; // rival aleatorio entre los de la primera generación
const FOE_TURN_MS = 800;

function HpBar({ value, max }: { value: number; max: number }) {
  const t = useTheme();
  const ratio = value / max;
  const fill = useAnimatedStyle(() => ({ transform: [{ scaleX: withTiming(ratio, { duration: 450 }) }] }));
  return (
    <View style={[styles.track, { backgroundColor: t.track }]}>
      <Animated.View style={[styles.fill, { backgroundColor: hpColor(ratio) }, fill]} />
    </View>
  );
}

export default function Batalla() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [fighters, setFighters] = useState<[Fighter, Fighter] | null>(null);
  const [hp, setHp] = useState<[number, number]>([0, 0]);
  const [log, setLog] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const foeTurn = useRef<ReturnType<typeof setTimeout>>(undefined);
  const shakeMe = useSharedValue(0);
  const shakeFoe = useSharedValue(0);
  const meStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeMe.value }] }));
  const foeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeFoe.value }] }));

  const hit = (v: typeof shakeMe) => {
    v.value = withSequence(
      withTiming(-12, { duration: 40 }),
      withRepeat(withTiming(12, { duration: 70 }), 4, true),
      withTiming(0, { duration: 40 }),
    );
  };

  const start = async () => {
    try {
      setError(null);
      const rival = Math.ceil(Math.random() * MAX_ID);
      const [me, foe] = (await Promise.all([fetchPokemon(name), fetchPokemon(rival)])).map(toFighter);
      setFighters([me, foe]);
      setHp([me.hp, foe.hp]);
      setLog(`¡Un ${pretty(foe.name)} salvaje apareció!`);
      setBusy(false);
    } catch {
      setError("No se pudo iniciar el combate. Revisa tu conexión.");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial al montar
    start();
    return () => clearTimeout(foeTurn.current); // al salir no deben dispararse el golpe ni la vibración pendientes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  if (!fighters) {
    return (
      <View style={styles.center}>
        {error ? (
          <>
            <Text style={[styles.logText, { color: t.sub }]}>{error}</Text>
            <Button title="Reintentar" onPress={start} />
          </>
        ) : (
          <ActivityIndicator size="large" color={t.tint} />
        )}
      </View>
    );
  }

  const [me, foe] = fighters;
  const over = hp[0] === 0 || hp[1] === 0;

  const attack = () => {
    setBusy(true);
    const dealt = damage(me, foe);
    const foeHp = Math.max(0, hp[1] - dealt);
    setHp([hp[0], foeHp]);
    setLog(`${pretty(me.name)} hace ${dealt} de daño`);
    hit(shakeFoe);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (foeHp === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLog(`¡${pretty(me.name)} ganó el combate!`);
      return;
    }
    foeTurn.current = setTimeout(() => {
      const back = damage(foe, me);
      const myHp = Math.max(0, hp[0] - back);
      setHp([myHp, foeHp]);
      hit(shakeMe);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      if (myHp === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setLog(`${pretty(foe.name)} te derrotó`);
        return;
      }
      setLog(`${pretty(foe.name)} hace ${back} de daño`);
      setBusy(false);
    }, FOE_TURN_MS);
  };

  const info = (f: Fighter, i: 0 | 1) => (
    <View style={[styles.info, { backgroundColor: t.card }]}>
      <View style={styles.infoTop}>
        <Text style={[styles.name, { color: t.text }]} numberOfLines={1}>{pretty(f.name)}</Text>
        <Text style={[styles.hpText, { color: t.sub }]}>{hp[i]}/{f.hp}</Text>
      </View>
      <HpBar value={hp[i]} max={f.hp} />
    </View>
  );

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Combate" }} />

      <View style={styles.arena}>
        <View style={styles.side}>
          {info(foe, 1)}
          <Animated.View style={foeStyle}>
            <Image source={{ uri: foe.front }} style={styles.sprite} contentFit="contain" />
          </Animated.View>
        </View>

        <View style={styles.side}>
          <Animated.View style={meStyle}>
            <Image source={{ uri: me.back }} style={styles.spriteMe} contentFit="contain" />
          </Animated.View>
          {info(me, 0)}
        </View>
      </View>

      {/* acciones abajo, al alcance del pulgar */}
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={[styles.logCard, { backgroundColor: t.card }]} accessibilityLiveRegion="polite">
          <Text style={[styles.logText, { color: t.text }]}>{log}</Text>
        </View>
        {over ? <Button title="Revancha" onPress={start} /> : <Button title="Atacar" onPress={attack} disabled={busy} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  screen: { flex: 1 },
  arena: { flex: 1, padding: 16, gap: 24, justifyContent: "center" },
  actions: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  side: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  info: { flex: 1, borderRadius: radius.row, padding: 14, gap: 10 },
  infoTop: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 8 },
  name: { flex: 1, fontSize: 17, fontWeight: "700", textTransform: "capitalize" },
  hpText: { fontSize: 14, fontVariant: ["tabular-nums"] },
  track: { height: 8, borderRadius: 4, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4, transformOrigin: "left" },
  sprite: { width: 130, height: 130 },
  spriteMe: { width: 150, height: 150 },
  logCard: { borderRadius: radius.row, padding: 16, minHeight: 56, justifyContent: "center" },
  logText: { fontSize: 17, textAlign: "center" },
});
