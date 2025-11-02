import React from "react";
import { ActivityIndicator, View } from "react-native";

const Spinner = ({ color = "#000" }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={color} />
    </View>
  );
};

export default Spinner;
