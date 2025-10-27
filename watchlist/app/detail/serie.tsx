import FormField from "@/components/formFields/FormField";
import FormPicker from "@/components/formFields/FormPicker";
import FormTextArea from "@/components/formFields/FormTextArea";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMediaApi } from "@/hooks/useMediaApi";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMedia } from "../../context/MediaContext";

export default function SerieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useMedia();
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const serie = items.find((i) => String(i.id) === id && i.type === "Serie");

  useLayoutEffect(() => {
    if (serie) {
      navigation.setOptions({ title: serie.name });
    } else {
      navigation.setOptions({ title: "Serie Detail" });
    }
  }, [navigation, serie]);

  /*
  Form logic
  */
  const [isDataChanged, setIsDataChanged] = useState(false);
  const { updateMedia } = useMediaApi();

  const [form, setForm] = useState({
    id: serie?.id || "",
    name: serie?.name || "",
    type: serie?.type || "", //TODO: add field movie/serie
    platform: serie?.platform || "",
    schedule: serie?.schedule || "",
    season: serie?.season || 1,
    episode: serie?.episode || 1,
    current_season: serie?.current_season || 1,
    current_episode: serie?.current_episode || 1,
    status: serie?.status || "Watching",
    priority: serie?.priority || "Medium",
    notes: serie?.notes || "",
  });

  useEffect(() => {
    if (!serie) return;
    const hasChanged =
      form.name !== serie.name ||
      form.platform !== serie.platform ||
      form.schedule !== serie.schedule ||
      form.season !== serie.season ||
      form.episode !== serie.episode ||
      form.current_season !== serie.current_season ||
      form.current_episode !== serie.current_episode ||
      form.status !== serie.status ||
      form.priority !== serie.priority ||
      form.notes !== serie.notes;
    setIsDataChanged(hasChanged);
  }, [form]);

  const handleSave = async () => {
    if (isDataChanged && serie) {
      console.log("Form data:", form);
      form.id = serie.id;
      await updateMedia(form);
      router.replace("/"); // Go back to app
    }
  };

  if (!serie)
    return (
      <Text style={styles(colorScheme, colors).text}>Serie not found</Text>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        style={[
          styles(colorScheme, colors).container,
          { backgroundColor: colors.background },
        ]}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {serie.image && serie.image !== "." && (
          <Image
            source={{ uri: serie.image }}
            style={styles(colorScheme, colors).image}
            resizeMode="contain"
          />
        )}
        <FormField
          label="Name"
          value={form.name}
          onChange={(text: string) => setForm({ ...form, name: text })}
          colors={colors}
          style={styles(colorScheme, colors).input}
        />
        <FormField
          label="Platform"
          value={form.platform}
          onChange={(text: string) => setForm({ ...form, platform: text })}
          colors={colors}
          style={styles(colorScheme, colors).input}
        />
        <FormField
          label="Schedule"
          value={form.schedule}
          onChange={(text: string) => setForm({ ...form, schedule: text })}
          colors={colors}
          style={styles(colorScheme, colors).input}
        />
        <FormField
          label="Season"
          value={form.season}
          onChange={(text: number) => setForm({ ...form, season: text })}
          colors={colors}
          style={styles(colorScheme, colors).input}
        />
        <FormField
          label="Episode"
          value={form.episode}
          onChange={(text: number) => setForm({ ...form, episode: text })}
          colors={colors}
          style={styles(colorScheme, colors).input}
        />
        <FormPicker
          label="Current Season"
          selectedValue={form.current_season}
          onValueChange={(value: number) =>
            setForm({ ...form, current_season: value })
          }
          options={[
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
          ]}
          colors={colors}
          style={styles(colorScheme, colors).input}
        />
        <FormPicker
          label="Current Episode"
          selectedValue={form.current_episode}
          onValueChange={(value: number) =>
            setForm({ ...form, current_episode: value })
          }
          options={[
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
          ]}
          colors={colors}
          style={styles(colorScheme, colors).input}
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
          colors={colors}
          style={styles(colorScheme, colors).input}
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
          colors={colors}
          style={styles(colorScheme, colors).input}
        />
        <FormTextArea
          label="Notes"
          value={form.notes}
          onChange={(text: string) => setForm({ ...form, notes: text })}
          colors={colors}
          style={styles(colorScheme, colors).input}
        />
      </ScrollView>
      <View style={{ padding: 16, backgroundColor: colors.background }}>
        <Button title="Save" onPress={handleSave} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (colorScheme: "light" | "dark", colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    text: {
      fontSize: 16,
      marginBottom: 8,
      color: colorScheme === "dark" ? "#fff" : "#000",
    },
    image: {
      width: 200,
      height: 300,
      marginBottom: 16,
      borderRadius: 8,
    },
    label: {
      fontSize: 12,
      color: colors.text,
      marginBottom: 4,
      fontWeight: "500",
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      width: "100%",
      color: colors.text,
      borderColor: colors.border,
    },
  });
