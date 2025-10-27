import { useMediaApi } from "@/hooks/useMediaApi";
import { clearSheetUrl } from "@/utils/storage";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { Button, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Graphs() {
  const { fetchMedia } = useMediaApi();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with filter icon */}
      <Text style={[styles.header, { color: colors.text }]}>⚙️ Settings</Text>
      {/* temp delete button for spreadsheet */}
      <Button
        title="Change Spreadsheet"
        onPress={() => {
          clearSheetUrl();
          router.replace("/setup");
        }}
      />
      {/* temp refresh button for spreadsheet */}
      <Button
        title="Refresh Data"
        onPress={() => {
          fetchMedia();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
});
