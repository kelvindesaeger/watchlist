import { createCommonStyles } from "@/components/styles/commonStyles";
import { useMedia } from "@/context/MediaContext";
import { useMediaApi } from "@/hooks/useMediaApi";
import { useTheme } from "@react-navigation/native";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { Text, useColorScheme, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

const legendItems = [
  { label: "Series", color: "#4f83cc" },
  { label: "Movies", color: "#cc4f4f" },
  { label: "Videos", color: "#4fcc7a" },
];

const weekdayMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const getDatesForWeekday = (weekday: number, baseDate = new Date()) => {
  const start = startOfMonth(baseDate);
  const end = endOfMonth(baseDate);

  const dates: string[] = [];

  let current = start;

  while (current <= end) {
    if (current.getDay() === weekday) {
      dates.push(format(current, "yyyy-MM-dd"));
    }
    current = addDays(current, 1);
  }

  return dates;
};

export default function CalendarScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const styles = createCommonStyles(colorScheme, colors);
  const { fetchMedia } = useMediaApi();
  const { items, setItems } = useMedia();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Calendar" });
  }, [navigation]);

  useEffect(() => {
    if (items.length === 0) {
      fetchMedia();
    }
  }, []);

  // Create marked dates based on items with a schedule date
  const markedDates = useMemo(() => {
    const marks: any = {};

    items.forEach((item) => {
      if (item.status !== "Watching") return;
      if (!item.schedule) return;

      const weekday = weekdayMap[item.schedule];
      if (weekday === undefined) return;

      const dates = getDatesForWeekday(weekday);

      const color =
        item.type === "Serie"
          ? "#4f83cc"
          : item.type === "Movie"
            ? "#cc4f4f"
            : "#4fcc7a";

      dates.forEach((dateStr) => {
        if (!marks[dateStr]) {
          marks[dateStr] = { dots: [] };
        }

        marks[dateStr].dots.push({
          key: item.id,
          color,
        });
      });
    });

    return marks;
  }, [items]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.background,
          dayTextColor: colors.text,
          monthTextColor: colors.text,
          arrowColor: colors.text,
          todayTextColor: "#ff0000",
        }}
        onDayPress={(day) => {
          router.push({
            pathname: "/calendar/day",
            params: { date: day.dateString },
          });
        }}
        firstDay={1}
      />

      <View style={{ marginTop: 16 }}>
        {legendItems.map((item) => (
          <View
            key={item.label}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: item.color,
                marginRight: 6,
              }}
            />
            <Text style={[styles.text]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
