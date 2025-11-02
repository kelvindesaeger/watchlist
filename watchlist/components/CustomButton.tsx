import { createCommonStyles } from "@/components/styles/commonStyles";
import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const CustomButton = ({
  title,
  onPress,
  disabled = false,
  isLoading = false,
}: CustomButtonProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const styles = createCommonStyles(colorScheme, colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[styles.button, (disabled || isLoading) && styles.buttonDisabled]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {isLoading && <ActivityIndicator size="small" color={colors.text} />}
        <Text
          style={[
            styles.buttonText,
            (disabled || isLoading) && styles.buttonTextDisabled,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
