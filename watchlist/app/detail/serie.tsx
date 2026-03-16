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
import { toastError, toastSuccess } from "@/utils/toast";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
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
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: serie ? serie.name : "Serie Detail" });
  }, [navigation, serie]);

  useEffect(() => {
    if (!serie) return;
    const hasChanged =
      form.name !== serie.name ||
      form.platform !== serie.platform ||
      form.schedule !== serie.schedule ||
      form.season !== String(serie.season) ||
      form.episode !== String(serie.episode) ||
      form.current_season !== serie.current_season ||
      form.current_episode !== serie.current_episode ||
      form.status !== serie.status ||
      form.priority !== serie.priority ||
      form.notes !== serie.notes;
    setIsDataChanged(hasChanged);
  }, [form]);

  const handleSave = () => {
    if (isDataChanged && serie) {
      setIsSaving(true);
      console.log("Form data:", form);
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
          label="Episode"
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
