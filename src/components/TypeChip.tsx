import { StyleSheet, Text } from "react-native";
import { onColor, radius, TYPE_COLORS, TYPE_ES, useTheme } from "../theme";

export function TypeChip({ type, small }: { type: string; small?: boolean }) {
  const t = useTheme();
  const bg = TYPE_COLORS[type] ?? t.sub;
  return (
    <Text style={[styles.chip, small && styles.small, { backgroundColor: bg, color: onColor(bg) }]}>
      {TYPE_ES[type] ?? type}
    </Text>
  );
}

const styles = StyleSheet.create({
  chip: { fontSize: 14, fontWeight: "600", paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.chip, overflow: "hidden" },
  small: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 2 },
});
