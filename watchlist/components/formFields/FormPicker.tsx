import { Picker } from "@react-native-picker/picker";
import { Text, View } from "react-native";

const FormPicker = ({
  label,
  selectedValue,
  onValueChange,
  options,
  colors,
  style,
}: any) => {
  return (
    <View
      style={{ marginBottom: 16, flexDirection: "row", alignItems: "center" }}
    >
      <Text
        style={{
          fontSize: 12,
          color: colors.text,
          fontWeight: "500",
          width: 100,
        }}
      >
        {label}
      </Text>

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
