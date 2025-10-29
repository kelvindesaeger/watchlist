import FormField from "@/components/formFields/FormField";
import FormPicker from "@/components/formFields/FormPicker";
import FormTextArea from "@/components/formFields/FormTextArea";
import { createCommonStyles } from "@/components/styles/commonStyles";
import { useMediaApi } from "@/hooks/useMediaApi";
import { searchMediaByType } from "@/utils/searchMediaByType";
import { useTheme } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
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

const initialForm = {
  id: "",
  name: "",
  type: "",
  platform: "",
  schedule: "",
  season: 1,
  episode: 1,
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

  /*
    Form logic
  */
  const [search, setSearch] = useState("");
  const [isDataChanged, setIsDataChanged] = useState(false);
  const { addMedia } = useMediaApi();
  const navigation = useNavigation();

  const [form, setForm] = useState(initialForm);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const handleSearch = () => {
    // Implement search logic here
    console.log("Searching for:", search);
    searchMediaByType(search, form.type).then((results) => {
      console.log("Search results:", results);
      if (results) {
        setSearchResults([results]);
      } else {
        setSearchResults([]);
      }
    });
  };

  const handleSave = async () => {
    if (isDataChanged) {
      console.log("Form data:", form);
      await addMedia(form);
      router.replace("/"); // Go back to app
    }
  };

  useEffect(() => {
    const hasChanged = Object.keys(initialForm).some(
      (key) => (form as any)[key] !== (initialForm as any)[key]
    );
    setIsDataChanged(hasChanged);
  }, [form]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Add New Record" });
  }, [navigation]);

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
        {/* selecting and searching a media item */}
        {form.name == "" && (
          <View style={{ padding: 16 }}>
            <FormPicker
              label="What are you adding?"
              selectedValue={""}
              onValueChange={(value: string) => {
                setForm({ ...form, type: value });
              }}
              options={[
                { label: "Serie", value: "Serie" },
                { label: "Movie", value: "Movie" },
                { label: "Video", value: "Video" },
              ]}
              style={styles.picker}
            />
            {form.type != "" && form.type != "video" && (
              <View>
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
                <View
                  style={{ padding: 16, backgroundColor: colors.background }}
                >
                  <Button
                    title="Search media"
                    onPress={handleSearch}
                    disabled={search == ""}
                    color={search != "" ? "#348512" : "#888"}
                  />
                </View>
                {searchResults.length > 0 && (
                  <View style={{ padding: 16 }}>
                    <Text style={[styles.text, { marginBottom: 8 }]}>
                      Search Results:
                    </Text>
                    {searchResults.map((item: any) => (
                      <TouchableOpacity
                        key={item.id}
                        style={{
                          marginBottom: 12,
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
                        <Image
                          source={{ uri: item.image }}
                          style={{ width: 100, height: 150, marginBottom: 8 }}
                          resizeMode="cover"
                        />
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
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
        {/* edit form once media item is selected  */}
        {form.name != "" && (
          <View style={{ padding: 16 }}>
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
                  onChange={(text: number) =>
                    setForm({ ...form, episode: text })
                  }
                  style={styles.input}
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
                  style={styles.picker}
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
          </View>
        )}
      </ScrollView>
      {form.name != "" && (
        <View style={{ padding: 16, backgroundColor: colors.background }}>
          <Button
            title="Save"
            onPress={handleSave}
            disabled={!isDataChanged}
            color={isDataChanged ? "" : "#888"}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
