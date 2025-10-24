import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MediaItem, useMedia } from "../../context/MediaContext";

const TYPE_FILTERS = ["Serie", "Movie", "Youtube"];
const STATUS_FILTERS = ["Watching", "Planned", "Watched"];

export default function HomeScreen() {
  const router = useRouter();
  const { items, setItems } = useMedia();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (items.length === 0) {
      setItems([
        {
          id: "1",
          name: "De Code Van Coppens",
          type: "Serie",
          platform: "VTMgo",
          schedule: "elke woensdag",
          status: "Watching",
          priority: "High",
        },
        {
          id: "2",
          name: "Modern Family",
          type: "Serie",
          platform: "123movies",
          schedule: "",
          status: "Watching",
          priority: "Medium",
        },
        {
          id: "3",
          name: "Average Rob",
          type: "Youtube",
          platform: "youtube",
          schedule: ".",
          status: "Watched",
          priority: "Medium",
        },
        {
          id: "4",
          name: "buncharted",
          type: "Youtube",
          platform: "youtube",
          schedule: ".",
          status: "Watched",
          priority: "Low",
        },
      ]);
    }
  }, []);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Animated.timing(slideAnim, {
      toValue: showFilters ? 0 : 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const slideHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // bigger panel height
  });

  const filteredItems: MediaItem[] = items
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase().trim()))
    .filter((i) =>
      selectedTypes.length > 0 ? selectedTypes.includes(i.type) : true
    )
    .filter((i) =>
      selectedStatuses.length > 0 ? selectedStatuses.includes(i.status!) : true
    );

  const toggleSelection = (value: string, list: string[], setList: any) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with filter icon */}
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: colors.text }]}>
          🎬 Media Tracker
        </Text>
        <TouchableOpacity onPress={toggleFilters} style={styles.filterIcon}>
          <Ionicons
            name="funnel"
            size={28}
            color={
              selectedTypes.length > 0 || selectedStatuses.length > 0
                ? colors.primary // active color
                : colors.text // default color
            }
          />
        </TouchableOpacity>
      </View>

      {/* Sliding filter panel */}
      <Animated.View
        style={[
          styles.filterPanel,
          {
            height: slideHeight,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={{ margin: 8 }}>
          <Text style={[styles.filterTitle, { color: colors.text }]}>Type</Text>
          <View style={styles.filterOptions}>
            {TYPE_FILTERS.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterOption,
                  {
                    backgroundColor: selectedTypes.includes(type)
                      ? colors.primary
                      : colors.card,
                  },
                ]}
                onPress={() =>
                  toggleSelection(type, selectedTypes, setSelectedTypes)
                }
              >
                <Text
                  style={{
                    color: selectedTypes.includes(type)
                      ? colors.background
                      : colors.text,
                  }}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.filterTitle, { color: colors.text }]}>
            Status
          </Text>
          <View style={styles.filterOptions}>
            {STATUS_FILTERS.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterOption,
                  {
                    backgroundColor: selectedStatuses.includes(status)
                      ? colors.primary
                      : colors.card,
                  },
                ]}
                onPress={() =>
                  toggleSelection(status, selectedStatuses, setSelectedStatuses)
                }
              >
                <Text
                  style={{
                    color: selectedStatuses.includes(status)
                      ? colors.background
                      : colors.text,
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>

      <TextInput
        placeholder="Search by name..."
        placeholderTextColor={colors.text + "88"}
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        contentContainerStyle={{ paddingBottom: 16 }}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => {
              const path =
                item.type === "Serie" ? "/detail/serie" : "/detail/movie";
              router.push({ pathname: path, params: { id: item.id } });
            }}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.type, { color: colors.text }]}>
              {item.type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  header: { fontSize: 24, fontWeight: "bold" },
  filterIcon: { padding: 4 },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  filterPanel: {
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    // padding: 8,
  },
  filterTitle: { fontWeight: "bold", marginBottom: 4 },
  filterOptions: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  item: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  type: { fontSize: 14 },
});
