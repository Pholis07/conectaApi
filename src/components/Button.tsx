import { Pressable, StyleSheet, Text } from "react-native";
import { radius, useTheme } from "../theme";

type Props = { title: string; onPress: () => void; disabled?: boolean };

export function Button({ title, onPress, disabled }: Props) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      android_ripple={{ color: `${t.onTint}40` }}
      onPress={onPress}
      style={({ pressed }) => [styles.btn, { backgroundColor: t.tint }, (pressed || disabled) && styles.dim]}
    >
      <Text style={[styles.label, { color: t.onTint }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { minHeight: 52, borderRadius: radius.button, overflow: "hidden", alignItems: "center", justifyContent: "center", alignSelf: "stretch" },
  label: { fontSize: 17, fontWeight: "600" },
  dim: { opacity: 0.55 },
});
