import CustomButton from "@/components/CustomButton";
import FormField from "@/components/formFields/FormField";
import FormPicker from "@/components/formFields/FormPicker";
import FormTextArea from "@/components/formFields/FormTextArea";
import { createCommonStyles } from "@/components/styles/commonStyles";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMediaApi } from "@/hooks/useMediaApi";
import {
  getEpisodeOptions,
  getSeasonOptions,
  parseEpisodeString,
} from "@/utils/episodeUtils";
import { validateMediaForm } from "@/utils/mediaValidation";
import { toastError, toastSuccess, toastWarning } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMedia } from "../../context/MediaContext";

export default function SerieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useMedia();
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const styles = createCommonStyles(colorScheme, colors);
  const router = useRouter();
  const navigation = useNavigation();
  const { updateMedia } = useMediaApi();

  const serie = items.find((i) => String(i.id) === id && i.type === "Serie");

  const [isSaving, setIsSaving] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);

  const [form, setForm] = useState({
    id: serie?.id || "",
    name: serie?.name || "",
    image: serie?.image || "",
    type: serie?.type || "",
    platform: serie?.platform || "",
    schedule: serie?.schedule || "",
    season: String(serie?.season ?? "1"),
    episode: String(serie?.episode ?? "1"),
    current_season: serie?.current_season || 1,
    current_episode: serie?.current_episode || 1,
    status: serie?.status || "Watching",
    priority: serie?.priority || "Medium",
    notes: serie?.notes || "",
    category: serie?.category || "",
    updated_on: serie?.updated_on || new Date().toISOString(),
    rating: serie?.rating || 0,
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: serie ? serie.name : "Serie Detail" });
  }, [navigation, serie]);

  useEffect(() => {
    if (!serie) return;
    const hasChanged =
      form.name !== serie.name ||
      form.image !== serie.image ||
      form.type !== serie.type ||
      form.platform !== serie.platform ||
      form.schedule !== serie.schedule ||
      form.season !== String(serie.season) ||
      form.episode !== String(serie.episode) ||
      form.current_season !== serie.current_season ||
      form.current_episode !== serie.current_episode ||
      form.status !== serie.status ||
      form.priority !== serie.priority ||
      form.notes !== serie.notes ||
      form.category !== serie.category ||
      form.rating !== serie.rating;
    setIsDataChanged(hasChanged);
  }, [form]);

  const handleSave = () => {
    const result = validateMediaForm(form);
    if (!result.valid) {
      toastWarning(result.message);
      return;
    }
    if (isDataChanged && serie) {
      setIsSaving(true);
      console.log("Form data:", form);
      form.updated_on = new Date().toISOString();
      var updatedMedia = {
        ...form,
        id: serie.id,
        season: Number(form.season),
        episode: form.episode,
      };
      updateMedia(updatedMedia)
        .then(() => {
          toastSuccess("Serie updated successfully");
          router.replace("/"); // Go back to app
        })
        .catch((error) => {
          toastError("Failed to update serie");
        })
        .finally(() => setIsSaving(false));
    }
  };

  if (!serie) return <Text style={styles.text}>Serie not found</Text>;

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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {serie.image && serie.image !== "." && (
          <Image
            source={{ uri: serie.image }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
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
        <FormPicker
          label="Type"
          selectedValue={form.type}
          onValueChange={(value: string) => setForm({ ...form, type: value })}
          options={[
            { label: "Serie", value: "Serie" },
            { label: "Movie", value: "Movie" },
          ]}
          style={styles.picker}
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
        <FormField
          label="Season"
          value={form.season}
          onChange={(text: string) => setForm({ ...form, season: text })}
          style={styles.input}
        />
        <FormField
          label={
            <View style={{ flexDirection: "row", width: 100 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.text,
                  fontWeight: "500",
                  marginTop: 12,
                }}
              >
                Episode
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Episode Format",
                    "Use ';' to separate seasons.\n\nExample:\n4;12;8\n\nSeason 1 = 4 episodes\nSeason 2 = 12 episodes\nSeason 3 = 8 episodes",
                  )
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={colors.text}
                  style={{ marginLeft: 4, marginTop: 12 }}
                />
              </TouchableOpacity>
            </View>
          }
          value={form.episode}
          onChange={(text: string) => setForm({ ...form, episode: text })}
          style={styles.input}
        />
        <FormPicker
          label="Current Season"
          selectedValue={form.current_season}
          onValueChange={(value: number) =>
            setForm({ ...form, current_season: value, current_episode: 1 })
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
        <FormPicker
          label="Status"
          selectedValue={form.status}
          onValueChange={(value: string) => setForm({ ...form, status: value })}
          options={[
            { label: "Watching", value: "Watching" },
            { label: "Watched", value: "Watched" },
            { label: "Skipped", value: "Skipped" },
            { label: "Planned", value: "Planned" },
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
        <FormPicker
          label="Category"
          selectedValue={form.category}
          onValueChange={(value: string) =>
            setForm({ ...form, category: value })
          }
          options={[
            { label: "Action", value: "Action" },
            { label: "Comedy", value: "Comedy" },
            { label: "Drama", value: "Drama" },
            { label: "Fantasy", value: "Fantasy" },
            { label: "Horror", value: "Horror" },
            { label: "Romance", value: "Romance" },
            { label: "Sci-Fi", value: "Sci-Fi" },
            { label: "Vlaams", value: "Vlaams" },
            { label: "Other", value: "Other" },
            { label: "Reality", value: "Reality" },
            { label: "Documentary", value: "Documentary" },
            { label: "Sitcom", value: "Sitcom" },
            { label: "Costume", value: "Costume" },
          ]}
          style={styles.picker}
        />
        <FormField
          label="Updated On"
          value={new Date(form.updated_on).toLocaleString("en-GB")}
          editable={false}
          style={[styles.input, { backgroundColor: colors.card }]}
        />
        <FormField
          label="Rating"
          value={form.rating?.toString()}
          onChange={(text: number) => setForm({ ...form, rating: text })}
          style={styles.input}
        />
      </ScrollView>
      <View style={{ padding: 16, backgroundColor: colors.background }}>
        <CustomButton
          title={isSaving ? "Saving..." : "Save"}
          onPress={handleSave}
          disabled={!isDataChanged || isSaving}
          isLoading={isSaving}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
