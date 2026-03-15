import { useMedia } from "@/context/MediaContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { format, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DayDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const { items } = useMedia();

  const formattedDate = format(parseISO(date as string), "EEEE, MMMM d, yyyy");

  // Filter media items that match this date
  const weekday = format(parseISO(date as string), "EEEE");

  const mediaForDate = items.filter((item) => {
    if (item.status !== "Watching") return false;
    if (!item.schedule) return false;
    return item.schedule === weekday;
  });
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}
    >
      {/* Header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.text }}>
          {formattedDate}
        </Text>
      </View>

      {/* Content */}
      {mediaForDate.length === 0 ? (
        <Text style={{ color: colors.text, opacity: 0.6 }}>
          No media scheduled.
        </Text>
      ) : (
        <FlatList
          data={mediaForDate}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const path =
                  item.type === "Serie" ? "/detail/serie" : "/detail/movie";
                router.push({ pathname: path, params: { id: item.id } });
              }}
              style={{
                backgroundColor: colors.card,
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: colors.text }}
              >
                {item.name}
              </Text>
              <Text style={{ color: colors.text, opacity: 0.8 }}>
                {item.type} • {item.status}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
