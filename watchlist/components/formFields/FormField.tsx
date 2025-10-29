import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@react-navigation/native";
import { Text, TextInput, View } from "react-native";
import { createCommonStyles } from "../styles/commonStyles";

const FormField = ({ label, value, onChange, style }: any) => {
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const styles = createCommonStyles(colorScheme, colors);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} style={style} />
    </View>
  );
};

export default FormField;
