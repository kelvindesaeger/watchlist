import FormPicker from "@/components/formFields/FormPicker";
import Spinner from "@/components/Spinner";
import { createCommonStyles } from "@/components/styles/commonStyles";
import { getSheetUrl } from "@/utils/storage";
import { toastError, toastSuccess } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "@react-navigation/elements";
import { useTheme } from "@react-navigation/native";
import { format, isValid, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MediaItem, useMedia } from "../../context/MediaContext";
import { useMediaApi } from "../../hooks/useMediaApi";
const TYPE_FILTERS = ["Serie", "Movie", "Video"];
const STATUS_FILTERS = ["Watching", "Planned", "Watched"];
const PRIORITY_FILTERS = ["Low", "Medium", "High"];
const CATEGORY_FILTERS = [
  "-",
  "Action",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Sci-Fi",
  "Vlaams",
  "Other",
  "Reality",
  "Documentary",
  "Sitcom",
];

const SORT_OPTIONS = [
  { label: "Schedule", value: "schedule" },
  { label: "Updated", value: "updated_on" },
  { label: "A-Z", value: "alphabetical" },
  { label: "Rating", value: "rating" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { items, setItems } = useMedia();
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const styles = createCommonStyles(colorScheme, colors);
  const { fetchMedia } = useMediaApi();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "Watching",
  ]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("-");
  const [selectedSort, setSelectedSort] = useState<string>("updated_on");
  const [isLoading, setIsLoading] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<MediaItem | null>(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const { updateMedia } = useMediaApi();

  useEffect(() => {
    (async () => {
      const link = await getSheetUrl();
      if (!link) {
        router.replace("/setup");
      }
      if (items.length === 0) {
        setIsLoading(true);
        try {
          await fetchMedia();
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    })();
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
    outputRange: [0, 290], // bigger panel height
  });

  const filteredItems: MediaItem[] = items
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase().trim()))
    .filter((i) =>
      selectedTypes.length > 0 ? selectedTypes.includes(i.type) : true,
    )
    .filter((i) =>
      selectedStatuses.length > 0 ? selectedStatuses.includes(i.status!) : true,
    )
    .filter((i) =>
      selectedPriorities.length > 0
        ? selectedPriorities.includes(i.priority!)
        : true,
    )
    .filter((i) =>
      selectedCategory !== "-" ? i.category === selectedCategory : true,
    )
    .sort((a, b) => {
      switch (selectedSort) {
        case "alphabetical":
          return a.name.localeCompare(b.name);

        case "schedule":
          return (
            new Date(a.schedule || 0).getTime() -
            new Date(b.schedule || 0).getTime()
          );

        case "updated_on":
          return (
            new Date(b.updated_on || 0).getTime() -
            new Date(a.updated_on || 0).getTime()
          );

        case "rating":
          return (b.rating || 0) - (a.rating || 0);

        default:
          return 0;
      }
    });

  const toggleSelection = (value: string, list: string[], setList: any) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  };

  const onIncrement = (item: MediaItem) => {
    setUpdatingItem(item);
    item.current_episode = item.current_episode ? item.current_episode + 1 : 1;
    updateMedia(item)
      .then(() => {
        toastSuccess("Progress updated successfully");
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, ...item } : i)),
        );
      })
      .catch((err) => {
        toastError("Failed to update progress");
      })
      .finally(() => setUpdatingItem(null));
  };

  return (
    <SafeAreaView
      style={[inlineStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with filter icon */}
      <View style={inlineStyles.headerRow}>
        <Text style={[inlineStyles.header, { color: colors.text }]}>
          🎬 Media Tracker
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={toggleFilters}
            style={inlineStyles.filterIcon}
          >
            <Ionicons
              name="funnel"
              size={24}
              color={
                selectedTypes.length > 0 ||
                selectedStatuses.length > 0 ||
                selectedPriorities.length > 0 ||
                selectedCategory
                  ? colors.primary // active color
                  : colors.text // default color
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/addMedia")}
            style={inlineStyles.filterIcon}
          >
            <Ionicons
              name="add"
              size={34}
              color={
                selectedTypes.length > 0 || selectedStatuses.length > 0
                  ? colors.primary // active color
                  : colors.text // default color
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sliding filter panel */}
      <Animated.View
        style={[
          inlineStyles.filterPanel,
          {
            height: slideHeight,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={{ margin: 8 }}>
          <Text style={[inlineStyles.filterTitle, { color: colors.text }]}>
            Type
          </Text>
          <View style={inlineStyles.filterOptions}>
            {TYPE_FILTERS.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  inlineStyles.filterOption,
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

          <Text style={[inlineStyles.filterTitle, { color: colors.text }]}>
            Status
          </Text>
          <View style={inlineStyles.filterOptions}>
            {STATUS_FILTERS.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  inlineStyles.filterOption,
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

          <Text style={[inlineStyles.filterTitle, { color: colors.text }]}>
            Priority
          </Text>
          <View style={inlineStyles.filterOptions}>
            {PRIORITY_FILTERS.map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  inlineStyles.filterOption,
                  {
                    backgroundColor: selectedPriorities.includes(priority)
                      ? colors.primary
                      : colors.card,
                  },
                ]}
                onPress={() =>
                  toggleSelection(
                    priority,
                    selectedPriorities,
                    setSelectedPriorities,
                  )
                }
              >
                <Text
                  style={{
                    color: selectedPriorities.includes(priority)
                      ? colors.background
                      : colors.text,
                  }}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[inlineStyles.filterOptions]}>
            <View style={{ width: "100%" }}>
              <FormPicker
                label="Category"
                selectedValue={selectedCategory}
                onValueChange={setSelectedCategory}
                options={CATEGORY_FILTERS.map((c) => ({ label: c, value: c }))}
                style={[styles.picker, { width: "100%" }]}
              />
            </View>
          </View>
        </View>
      </Animated.View>
      <View style={{ marginBottom: -4 }}>
        <FormPicker
          label="Sort By"
          selectedValue={selectedSort}
          onValueChange={setSelectedSort}
          options={[{ label: "None", value: "" }, ...SORT_OPTIONS]}
          style={styles.picker}
        />
      </View>

      <TextInput
        placeholder="Search by name..."
        placeholderTextColor={colors.text + "88"}
        style={[
          inlineStyles.searchInput,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={search}
        onChangeText={setSearch}
      />
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color={colors.text} />
        </View>
      ) : (
        <>
          {filteredItems.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.text }}>No media found</Text>
            </View>
          ) : (
            <FlatList
              contentContainerStyle={{ paddingBottom: 16 }}
              data={filteredItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const episodeString =
                  typeof item.episode === "string" ? item.episode : "";
                const episodesPerSeason = episodeString.includes(";")
                  ? episodeString.split(";").map(Number)
                  : [];
                const totalEpisodes = episodesPerSeason.reduce(
                  (a, b) => a + b,
                  0,
                );
                let watchedEpisodes = 0;
                if (item.current_season && item.current_episode) {
                  for (let i = 0; i < item.current_season - 1; i++) {
                    watchedEpisodes += episodesPerSeason[i] || 0;
                  }
                  watchedEpisodes += item.current_episode;
                }
                const progress =
                  totalEpisodes > 0 ? watchedEpisodes / totalEpisodes : 0;
                return (
                  <TouchableOpacity
                    style={[
                      inlineStyles.item,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => {
                      const path =
                        item.type === "Serie"
                          ? "/detail/serie"
                          : "/detail/movie";
                      router.push({ pathname: path, params: { id: item.id } });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#121212",
                        borderRadius: 16,
                        alignItems: "center",
                      }}
                    >
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={{
                            width: 60,
                            height: 90,
                            borderRadius: 10,
                            marginRight: 10,
                          }}
                          resizeMode="cover"
                        />
                      ) : null}
                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text
                          style={[inlineStyles.title, { color: colors.text }]}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}
                        >
                          {item.platform}
                          {item.schedule !== "." && item.schedule !== ""
                            ? ` | ${
                                item.schedule &&
                                isValid(parseISO(item.schedule))
                                  ? format(item.schedule, "dd/MM/yyyy")
                                  : item.schedule
                              }`
                            : ""}
                        </Text>
                        <Text
                          style={{ color: "#ddd", fontSize: 12, marginTop: 6 }}
                        >
                          S{item.current_season} E{item.current_episode}
                        </Text>
                        <View
                          style={{
                            height: 4,
                            backgroundColor: "#333",
                            borderRadius: 4,
                            marginTop: 6,
                            overflow: "hidden",
                          }}
                        >
                          <View
                            style={{
                              height: 4,
                              backgroundColor: "#facc15",
                              width: `${progress * 100}%`,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 8,
                          }}
                        >
                          <View style={{ gap: 6 }}>
                            <Text
                              style={{
                                color: "#aaa",
                                fontSize: 12,
                              }}
                            >
                              {item.status}
                              {" | " + item.priority}
                            </Text>
                            <Badge
                              visible
                              style={{
                                backgroundColor:
                                  item.type === "Serie" ? "#4f83cc" : "#cc4f4f",
                                alignSelf: "flex-start",
                              }}
                            >
                              {item.type.toUpperCase()}
                            </Badge>
                          </View>
                          <TouchableOpacity
                            onPress={() => onIncrement(item)}
                            style={{
                              backgroundColor: "#3b82f6",
                              paddingHorizontal: 10,
                              paddingVertical: 8,
                              borderRadius: 12,
                              marginLeft: 10,
                              opacity: updatingItem?.id === item.id ? 0.6 : 1,
                            }}
                            disabled={updatingItem?.id === item.id}
                          >
                            {updatingItem?.id === item.id ? (
                              <Spinner color="#fff" />
                            ) : (
                              <Text
                                style={{ color: "#fff", fontWeight: "bold" }}
                              >
                                +1
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const inlineStyles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  header: { fontSize: 24, fontWeight: "bold" },
  filterIcon: { padding: 8 },
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
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    overflow: "hidden",
    flexShrink: 1,
  },
  type: { fontSize: 14 },
});
