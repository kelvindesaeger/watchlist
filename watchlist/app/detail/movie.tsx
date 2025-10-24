import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useMedia } from "../../context/MediaContext";

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useMedia();
  const colorScheme = useColorScheme() ?? "light";

  const movie = items.find(
    (i) => i.id === id && (i.type === "Movie" || i.type === "Youtube")
  );
  if (!movie)
    return <Text style={styles(colorScheme).text}>Movie not found</Text>;

  return (
    <View style={styles(colorScheme).container}>
      <Text style={styles(colorScheme).title}>{movie.name}</Text>
      <Text style={styles(colorScheme).text}>Platform: {movie.platform}</Text>
      <Text style={styles(colorScheme).text}>Schedule: {movie.schedule}</Text>
      {/* <Text style={styles(colorScheme).text}>Season: {movie.season}</Text>
      <Text style={styles(colorScheme).text}>Episode: {movie.episode}</Text> */}
      <Text style={styles(colorScheme).text}>Status: {movie.status}</Text>
      <Text style={styles(colorScheme).text}>Priority: {movie.priority}</Text>
      <Text style={styles(colorScheme).text}>Notes: {movie.notes}</Text>
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
