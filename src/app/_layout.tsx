import { Stack } from "expo-router";
import { useTheme } from "../theme";

export default function RootLayout() {
  const t = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: t.bg },
        headerShadowVisible: false,
        headerTintColor: t.tint,
        headerTitleStyle: { color: t.text },
        contentStyle: { backgroundColor: t.bg },
      }}
    />
  );
}
