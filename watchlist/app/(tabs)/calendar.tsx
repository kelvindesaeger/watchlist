import { createCommonStyles } from "@/components/styles/commonStyles";
import { useMediaApi } from "@/hooks/useMediaApi";
import { useTheme } from "@react-navigation/native";
import { Text, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Graphs() {
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const styles = createCommonStyles(colorScheme, colors);

  const { fetchMedia } = useMediaApi();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with filter icon */}
      <Text style={styles.text}>Calendar</Text>
    </SafeAreaView>
  );
}
