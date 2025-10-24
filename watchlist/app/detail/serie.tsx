import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useMedia } from "../../context/MediaContext";

export default function SerieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useMedia();
  const colorScheme = useColorScheme() ?? "light";

  const serie = items.find((i) => i.id === id && i.type === "Serie");
  if (!serie)
    return <Text style={styles(colorScheme).text}>Serie not found</Text>;

  return (
    <View style={styles(colorScheme).container}>
      <Text style={styles(colorScheme).title}>{serie.name}</Text>
      <Text style={styles(colorScheme).text}>Platform: {serie.platform}</Text>
      <Text style={styles(colorScheme).text}>Schedule: {serie.schedule}</Text>
      <Text style={styles(colorScheme).text}>Season: {serie.season}</Text>
      <Text style={styles(colorScheme).text}>Episode: {serie.episode}</Text>
      <Text style={styles(colorScheme).text}>Status: {serie.status}</Text>
      <Text style={styles(colorScheme).text}>Priority: {serie.priority}</Text>
      <Text style={styles(colorScheme).text}>Notes: {serie.notes}</Text>
    </View>
  );
}

const styles = (colorScheme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: colorScheme === "dark" ? "#fff" : "#000",
    },
    text: {
      fontSize: 16,
      marginBottom: 8,
      color: colorScheme === "dark" ? "#fff" : "#000",
    },
  });
