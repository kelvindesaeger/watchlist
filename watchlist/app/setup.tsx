import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { getSheetUrl, saveSheetUrl } from "../utils/storage";

export default function SetupScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [url, setUrl] = useState("");

  useEffect(() => {
    (async () => {
      const existingUrl = await getSheetUrl();
      if (existingUrl) router.replace("/"); // Skip setup if already saved
    })();
  }, []);

  const handleSave = async () => {
    if (!url.startsWith("https://script.google.com/macros")) {
      alert("Please enter a valid Google Sheets link");
      return;
    }
    await saveSheetUrl(url);
    router.replace("/"); // Go back to app
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        🔗 Setup Google Sheet
      </Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Paste the link to your shared Google Sheet below.
      </Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="https://docs.google.com/spreadsheets/..."
        placeholderTextColor={colors.text + "88"}
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
