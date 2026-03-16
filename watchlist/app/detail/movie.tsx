import CustomButton from "@/components/CustomButton";
import FormField from "@/components/formFields/FormField";
import FormPicker from "@/components/formFields/FormPicker";
import FormTextArea from "@/components/formFields/FormTextArea";
import { createCommonStyles } from "@/components/styles/commonStyles";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { toastError, toastSuccess } from "@/utils/toast";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useMedia } from "../../context/MediaContext";
import { useMediaApi } from "../../hooks/useMediaApi";

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useMedia();
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const styles = createCommonStyles(colorScheme, colors);
  const router = useRouter();
  const navigation = useNavigation();

  const [isSaving, setIsSaving] = useState(false);

  const movie = items.find(
    (i) => String(i.id) === id && (i.type === "Movie" || i.type === "Video"),
  );

  useLayoutEffect(() => {
    if (movie) {
      navigation.setOptions({ title: movie.name });
    } else {
      navigation.setOptions({ title: "Movie/Video Detail" });
    }
  }, [navigation, movie]);

  /*
  Form logic
  */
  const [isDataChanged, setIsDataChanged] = useState(false);
  const { updateMedia } = useMediaApi();

  const [form, setForm] = useState({
    id: movie?.id || "",
    name: movie?.name || "",
    image: movie?.image || "",
    type: movie?.type || "",
    platform: movie?.platform || "",
    schedule: movie?.schedule || "",
    status: movie?.status || "Watching",
    priority: movie?.priority || "Medium",
    notes: movie?.notes || "",
  });

  useEffect(() => {
    if (!movie) return;
    const hasChanged =
      form.name !== movie.name ||
      form.platform !== movie.platform ||
      form.type !== movie.type ||
      form.schedule !== movie.schedule ||
      form.status !== movie.status ||
      form.priority !== movie.priority ||
      form.notes !== movie.notes;
    setIsDataChanged(hasChanged);
  }, [form]);

  const handleSave = () => {
    if (isDataChanged && movie) {
      setIsSaving(true);
      console.log("Form data:", form);
      form.id = movie.id;
      updateMedia(form)
        .then(() => {
          toastSuccess("Movie/Video updated successfully");
          router.replace("/"); // Go back to app
        })
        .catch((error) => {
          console.error("Error updating media:", error);
          toastError("Failed to update movie/video");
        })
        .finally(() => setIsSaving(false));
    }
  };

  if (!movie) {
    return <Text style={styles.text}>Movie not found</Text>;
  }

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
        {movie.image && movie.image !== "." && (
          <Image
            source={{ uri: movie.image }}
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
            { label: "Movie", value: "Movie" },
            { label: "Video", value: "Video" },
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
