import { Text, TextInput, View } from "react-native";

const FormField = ({ label, value, onChange, colors, style }: any) => {
  return (
    <View style={{ marginBottom: 16, flexDirection: "row" }}>
      <Text
        style={{
          fontSize: 12,
          color: colors.text,
          marginBottom: 4,
          fontWeight: "500",
          width: 100,
          marginTop: 12, // zodat het label mooi bovenaan uitlijnt met de TextInput
        }}
      >
        {label}
      </Text>
      <TextInput value={value} onChangeText={onChange} style={style} />
    </View>
  );
};

export default FormField;
