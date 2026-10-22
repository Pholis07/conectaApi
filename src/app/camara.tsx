import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { Button } from "../components/Button";
import { overlay, useTheme } from "../theme";

export default function Camara() {
  const t = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Cámara" }} />
        <Ionicons name="camera-outline" size={56} color={t.tint} />
        <Text style={[styles.title, { color: t.text }]}>Permiso de cámara</Text>
        <Text style={[styles.msg, { color: t.sub }]}>
          La Pokédex necesita la cámara para mostrarte la vista previa.
        </Text>
        <Button title="Permitir cámara" onPress={requestPermission} />
      </View>
    );
  }
  return (
    <View style={styles.flex}>
      <Stack.Screen options={{ title: "Cámara" }} />
      <CameraView style={styles.flex} facing={facing} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltear cámara"
        style={styles.flip}
        onPress={() => {
          Haptics.selectionAsync();
          setFacing((f) => (f === "back" ? "front" : "back"));
        }}
      >
        <Ionicons name="camera-reverse-outline" size={28} color={overlay.icon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  msg: { fontSize: 16, textAlign: "center", marginBottom: 8, maxWidth: 320 },
  flip: {
    position: "absolute", bottom: 40, alignSelf: "center", width: 56, height: 56,
    borderRadius: 28, backgroundColor: overlay.scrim, alignItems: "center", justifyContent: "center",
  },
});
