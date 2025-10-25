import { Text, TextInput, View } from "react-native";

const FormTextArea = ({ label, value, onChange, colors, style }: any) => {
  return (
    <View
      style={{
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: colors.text,
          fontWeight: "500",
          width: 100,
          marginTop: 12, // zodat het label mooi bovenaan uitlijnt met de TextInput
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline
        style={[style, { flex: 1, height: 100, textAlignVertical: "top" }]} // top-align voor multiline
      />
    </View>
  );
};

export default FormTextArea;
