import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming,
} from "react-native-reanimated";
import { Button } from "../../components/Button";
import { damage, toFighter, type Fighter } from "../../lib/battle";
import { fetchPokemon } from "../../lib/pokeapi";
import { hpColor, pretty, radius, TYPE_COLORS, useTheme } from "../../theme";

const MAX_ID = 151; // rival aleatorio entre los de la primera generación
const FOE_TURN_MS = 800;
const LUNGE = 36; // cuánto embiste el atacante hacia su rival

// Último golpe: `seq` cambia en cada ataque y cada sprite decide si embiste o recibe.
type Fx = { seq: number; attacker: 0 | 1; dealt: number };
const NO_FX: Fx = { seq: 0, attacker: 0, dealt: 0 };

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

type SpriteProps = { uri: string; size: number; self: 0 | 1; fx: Fx; fainted: boolean; won: boolean };

// Entra deslizando, respira en reposo, embiste al atacar, tiembla y parpadea al recibir, cae al perder y salta al ganar.
function FighterSprite({ uri, size, self, fx, fainted, won }: SpriteProps) {
  const dir = self === 0 ? 1 : -1; // el propio mira a la derecha, el rival a la izquierda
  const x = useSharedValue(-dir * 140);
  const bob = useSharedValue(0);
  const jump = useSharedValue(0);
  const alpha = useSharedValue(1);
  const dmg = useSharedValue(0);

  useEffect(() => {
    x.set(withSpring(0, { damping: 12 }));
    bob.set(withRepeat(withSequence(withTiming(-6, { duration: 900 }), withTiming(0, { duration: 900 })), -1));
  }, [x, bob]);

  useEffect(() => {
    if (!fx.seq) return;
    if (fx.attacker === self) {
      x.set(withSequence(withTiming(LUNGE * dir, { duration: 110 }), withSpring(0, { damping: 10 })));
      return;
    }
    x.set(withSequence(withTiming(-10 * dir, { duration: 40 }), withRepeat(withTiming(10 * dir, { duration: 70 }), 4, true), withTiming(0, { duration: 40 })));
    alpha.set(withSequence(withTiming(0.3, { duration: 60 }), withTiming(1, { duration: 120 }), withTiming(0.3, { duration: 60 }), withTiming(1, { duration: 120 })));
    dmg.set(0);
    dmg.set(withTiming(1, { duration: 800 }));
  }, [fx, self, dir, x, alpha, dmg]);

  useEffect(() => {
    if (fainted) alpha.set(withTiming(0.25, { duration: 500 })); // declarado después del parpadeo: gana el último estado
  }, [fainted, alpha]);

  useEffect(() => {
    if (won) jump.set(withRepeat(withSequence(withTiming(-18, { duration: 250 }), withTiming(0, { duration: 250 })), -1));
  }, [won, jump]);

  const body = useAnimatedStyle(() => ({
    opacity: alpha.get(),
    transform: [{ translateX: x.get() }, { translateY: bob.get() + jump.get() }],
  }));
  const floating = useAnimatedStyle(() => ({
    opacity: interpolate(dmg.get(), [0, 0.15, 1], [0, 1, 0]),
    transform: [{ translateY: -50 * dmg.get() }, { scale: interpolate(dmg.get(), [0, 0.2, 1], [0.5, 1.3, 1]) }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={body}>
        <Image source={{ uri }} style={{ width: size, height: size }} contentFit="contain" />
      </Animated.View>
      <Animated.Text pointerEvents="none" style={[styles.dmg, floating]}>-{fx.dealt}</Animated.Text>
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
  const [fx, setFx] = useState<Fx>(NO_FX);
  const [round, setRound] = useState(0); // cambia en cada combate: los sprites vuelven a hacer su entrada
  const foeTurn = useRef<ReturnType<typeof setTimeout>>(undefined);

  const start = async () => {
    try {
      setError(null);
      const rival = Math.ceil(Math.random() * MAX_ID);
      const [me, foe] = (await Promise.all([fetchPokemon(name), fetchPokemon(rival)])).map(toFighter);
      setFighters([me, foe]);
      setHp([me.hp, foe.hp]);
      setFx(NO_FX);
      setRound((r) => r + 1);
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
    setFx((f) => ({ seq: f.seq + 1, attacker: 0, dealt }));
    setLog(`${pretty(me.name)} hace ${dealt} de daño`);
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
      setFx((f) => ({ seq: f.seq + 1, attacker: 1, dealt: back }));
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

  const panel = (f: Fighter, i: 0 | 1) => {
    const info = (
      <View style={[styles.info, { backgroundColor: t.card }]}>
        <View style={styles.infoTop}>
          <Text style={[styles.name, { color: t.text }]} numberOfLines={1}>{pretty(f.name)}</Text>
          <Text style={[styles.hpText, { color: t.sub }]}>{hp[i]}/{f.hp}</Text>
        </View>
        <HpBar value={hp[i]} max={f.hp} />
      </View>
    );
    const sprite = (
      <FighterSprite
        key={`${round}-${i}`}
        uri={i === 0 ? f.back : f.front}
        size={i === 0 ? 150 : 130}
        self={i}
        fx={fx}
        fainted={hp[i] === 0}
        won={hp[i] > 0 && hp[1 - i] === 0}
      />
    );
    return (
      <View style={[styles.panel, { backgroundColor: `${TYPE_COLORS[f.type] ?? t.tint}${t.wash}` }]}>
        {i === 0 ? sprite : info}
        {i === 0 ? info : sprite}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Combate" }} />

      <View style={styles.arena}>
        {panel(foe, 1)}
        {panel(me, 0)}
      </View>

      {/* acciones abajo, al alcance del pulgar */}
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={[styles.logCard, { backgroundColor: t.card }]} accessibilityLiveRegion="polite">
          <Animated.Text key={log} entering={FadeIn.duration(200)} style={[styles.logText, { color: t.text }]}>
            {log}
          </Animated.Text>
        </View>
        {over ? <Button title="Revancha" onPress={start} /> : <Button title="Atacar" onPress={attack} disabled={busy} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  screen: { flex: 1 },
  arena: { flex: 1, padding: 16, gap: 16, justifyContent: "center" },
  actions: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  panel: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, borderRadius: 28, padding: 14 },
  info: { flex: 1, borderRadius: radius.row, padding: 14, gap: 10 },
  infoTop: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: 8 },
  name: { flex: 1, fontSize: 17, fontWeight: "800", textTransform: "capitalize" },
  hpText: { fontSize: 14, fontWeight: "600", fontVariant: ["tabular-nums"] },
  track: { height: 10, borderRadius: 5, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 5, transformOrigin: "left" },
  dmg: {
    position: "absolute", top: 0, alignSelf: "center", fontSize: 30, fontWeight: "900", color: "#FF453A",
    textShadowColor: "rgba(0,0,0,0.45)", textShadowRadius: 4, textShadowOffset: { width: 0, height: 1 },
  },
  logCard: { borderRadius: radius.row, padding: 16, minHeight: 56, justifyContent: "center" },
  logText: { fontSize: 17, fontWeight: "600", textAlign: "center" },
});
