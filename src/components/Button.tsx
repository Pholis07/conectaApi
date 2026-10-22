import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { radius, useTheme } from "../theme";

type Props = { title: string; onPress: () => void; disabled?: boolean };

export function Button({ title, onPress, disabled }: Props) {
  const t = useTheme();
  const scale = useSharedValue(1);
  const press = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <Animated.View style={[styles.wrap, { boxShadow: `0 6px 16px ${t.tint}59` }, press]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        android_ripple={{ color: `${t.onTint}40` }}
        onPress={onPress}
        onPressIn={() => scale.set(withSpring(0.96))}
        onPressOut={() => scale.set(withSpring(1, { damping: 8 }))}
        style={[styles.btn, { backgroundColor: t.tint }, disabled && styles.dim]}
      >
        <Text style={[styles.label, { color: t.onTint }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: "stretch", borderRadius: radius.button },
  btn: { minHeight: 52, borderRadius: radius.button, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  label: { fontSize: 17, fontWeight: "700" },
  dim: { opacity: 0.55 },
});
