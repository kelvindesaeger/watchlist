import { useColorScheme } from "@/hooks/use-color-scheme";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";
import { createCommonStyles } from "../styles/commonStyles";

const FormPicker = ({
  label,
  selectedValue,
  onValueChange,
  options,
  style,
}: any) => {
  const colorScheme = useColorScheme() ?? "light";
  const { colors } = useTheme();
  const styles = createCommonStyles(colorScheme, colors);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={[style, { flex: 1, justifyContent: "center" }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
        >
          {options.map((opt: any) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default FormPicker;
