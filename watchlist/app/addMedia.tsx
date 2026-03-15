import CustomButton from "@/components/CustomButton";
import FormField from "@/components/formFields/FormField";
import FormPicker from "@/components/formFields/FormPicker";
import FormTextArea from "@/components/formFields/FormTextArea";
import Spinner from "@/components/Spinner";
import { createCommonStyles } from "@/components/styles/commonStyles";
import { useMediaApi } from "@/hooks/useMediaApi";
import {
  getEpisodeOptions,
  getSeasonOptions,
  parseEpisodeString,
} from "@/utils/episodeUtils";
import { searchMediaByType } from "@/utils/searchMediaByType";
import { useTheme } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const initialForm = {
  id: "",
  name: "",
  image: "",
  type: "",
  platform: "",
  schedule: "",
  season: 1,
  episode: "1",
  current_season: 1,
  current_episode: 1,
  status: "Planned",
  priority: "Medium",
  notes: "",
};

export default function AddMedia() {
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const styles = createCommonStyles(colorScheme, colors);
  const router = useRouter();
  const navigation = useNavigation();
  const { addMedia } = useMediaApi();

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", search);
    setIsSearching(true);
    searchMediaByType(search, form.type)
      .then((results) => {
        console.log("Search results:", results);
        if (results) {
          setSearchResults([results]);
        } else {
          setSearchResults([]);
        }
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      Toast.show({ type: "error", text1: "Name is required" });
      return false;
    }
    if (!form.type.trim()) {
      Toast.show({ type: "error", text1: "Type is required" });
      return false;
    }
    if (form.season <= 0 || form.current_season <= 0) {
      Toast.show({ type: "error", text1: "Season must be positive" });
      return false;
    }
    if (
      form.type !== "video" &&
      (parseInt(form.episode) <= 0 || form.current_episode <= 0)
    ) {
      Toast.show({ type: "error", text1: "Episode must be positive" });
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (isDataChanged) {
      setIsSaving(true);
      console.log("Form data:", form);
      addMedia(form)
        .then(() => {
          Toast.show({ type: "success", text1: "Media added successfully" });
          router.replace("/"); // Go back to app
        })
        .catch((error) => {
          Toast.show({ type: "error", text1: "Failed to add media" });
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  };

  useEffect(() => {
    const hasChanged = Object.keys(initialForm).some(
      (key) => (form as any)[key] !== (initialForm as any)[key],
    );
    setIsDataChanged(hasChanged);
  }, [form]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Add New Record" });
  }, [navigation]);

  const seasonEpisodes = useMemo(
    () => parseEpisodeString(form.episode),
    [form.episode],
  );

  const seasonOptions = useMemo(
    () => getSeasonOptions(Number(form.season) || 1),
    [seasonEpisodes, form.season],
  );

  const episodeOptions = useMemo(
    () => getEpisodeOptions(seasonEpisodes, form.current_season),
    [seasonEpisodes, form.current_season],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* selecting and searching a media item */}
        {form.name == "" && (
          <View style={{ flex: 1 }}>
            <FormPicker
              label="What are you adding?"
              selectedValue={""}
              onValueChange={(value: string) => {
                setForm({ ...form, type: value });
              }}
              placeholder="Select type..."
              options={[
                { label: "Serie", value: "Serie" },
                { label: "Movie", value: "Movie" },
                { label: "Video", value: "Video" },
              ]}
              style={styles.picker}
            />
            {form.type != "" && form.type != "video" && (
              <>
                <TextInput
                  placeholder="Search by name..."
                  placeholderTextColor={colors.text + "88"}
                  style={[
                    styles.searchInputFull,
                    {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  value={search}
                  onChangeText={setSearch}
                />
                <CustomButton
                  title={isSearching ? "Searching..." : "Search media"}
                  onPress={handleSearch}
                  disabled={search === "" || isSearching}
                />
                {isSearching && <Spinner color={colors.text} />}
                {searchResults.length > 0 &&
                  searchResults.map((item: any) => (
                    <TouchableOpacity
                      key={item.id}
                      style={{
                        marginTop: 12,
                        padding: 12,
                        backgroundColor: colors.card,
                        borderRadius: 8,
                      }}
                      onPress={() => {
                        console.log("Selected media item:", item);
                        setForm({
                          ...form,
                          ...item,
                        });
                        setSearchResults([]);
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 12,
                        }}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={{ width: 100, height: 150, marginBottom: 8 }}
                          resizeMode="cover"
                        />
                        <View>
                          <Text
                            style={[
                              styles.text,
                              { fontSize: 16, fontWeight: "bold" },
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={[
                              styles.text,
                              { fontSize: 14, color: colors.text + "88" },
                            ]}
                          >
                            {item.platform}
                          </Text>
                          <Text
                            style={[
                              styles.text,
                              { fontSize: 14, color: colors.text + "88" },
                            ]}
                          >
                            Every {item.schedule}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.text, { fontSize: 14 }]}>
                        {item.notes}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </>
            )}
          </View>
        )}
        {/* edit form once media item is selected  */}
        {form.name != "" && (
          <View>
            <Text style={[styles.text, { fontSize: 20, marginBottom: 16 }]}>
              Adding: {form.name} ({form.type})
            </Text>
            {/* Additional form fields can be added here */}
            <FormField
              label="Name"
              value={form.name}
              onChange={(text: string) => setForm({ ...form, name: text })}
              style={styles.input}
            />
            <FormField
              label="Image URL"
              value={form.image}
              onChange={(text: string) => setForm({ ...form, image: text })}
              style={styles.input}
            />
            <FormField
              label="Platform"
              value={form.platform}
              onChange={(text: string) => setForm({ ...form, platform: text })}
              style={styles.input}
            />
            <FormField
              label="Schedule"
              value={form.schedule}
              onChange={(text: string) => setForm({ ...form, schedule: text })}
              style={styles.input}
            />
            {form.type != "video" && (
              <>
                <FormField
                  label="Season"
                  value={form.season?.toString()}
                  onChange={(text: number) =>
                    setForm({ ...form, season: text })
                  }
                  style={styles.input}
                />
                <FormField
                  label="Episode"
                  value={form.episode?.toString()}
                  onChange={(text: string) =>
                    setForm({ ...form, episode: text })
                  }
                  style={styles.input}
                />
                <FormPicker
                  label="Current Season"
                  selectedValue={form.current_season}
                  onValueChange={(value: number) =>
                    setForm({
                      ...form,
                      current_season: value,
                      current_episode: 1,
                    })
                  }
                  options={seasonOptions}
                  style={styles.picker}
                />
                <FormPicker
                  label="Current Episode"
                  selectedValue={form.current_episode}
                  onValueChange={(value: number) =>
                    setForm({ ...form, current_episode: value })
                  }
                  options={episodeOptions}
                  style={styles.picker}
                />
              </>
            )}
            <FormPicker
              label="Status"
              selectedValue={form.status}
              onValueChange={(value: string) =>
                setForm({ ...form, status: value })
              }
              options={[
                { label: "Planned", value: "Planned" },
                { label: "Watching", value: "Watching" },
                { label: "Watched", value: "Watched" },
                { label: "Skipped", value: "Skipped" },
              ]}
              style={styles.picker}
            />
            <FormPicker
              label="Priority"
              selectedValue={form.priority}
              onValueChange={(value: string) =>
                setForm({ ...form, priority: value })
              }
              options={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
              style={styles.picker}
            />
            <FormTextArea
              label="Notes"
              value={form.notes}
              onChange={(text: string) => setForm({ ...form, notes: text })}
              style={styles.input}
            />
          </View>
        )}
      </ScrollView>
      {form.name != "" && (
        <CustomButton
          title={isSaving ? "Saving..." : "Save"}
          onPress={handleSave}
          disabled={!isDataChanged || isSaving}
          isLoading={isSaving}
        />
      )}
    </KeyboardAvoidingView>
  );
}
