import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CustomSafeAreaView = (props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        marginTop: insets.top,
        marginLeft: insets.left,
        marginRight: insets.right,
        ...props.style,
      }}
    >
      {props.children}
    </View>
  );
};

export default CustomSafeAreaView;
