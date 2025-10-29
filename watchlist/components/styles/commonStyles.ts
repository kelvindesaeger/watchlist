import { StyleSheet } from "react-native";

export const createCommonStyles = (colorScheme: "light" | "dark", colors: any) =>
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
      alignSelf: "center",
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
      flex: 1,
      color: colors.text,
      borderColor: colors.border,
    },
    picker: {
      borderWidth: 1,
      borderRadius: 8,
      borderColor: colors.border,
    },
    fieldContainer: {
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    fieldLabel: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "500",
      width: 100,
      marginTop: 12,
    },
  });
