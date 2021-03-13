import React from "react";
import { View } from "react-native";
import { verticalScale } from "react-native-size-matters";

const Spacer = (props) => (
  <View style={{ height: verticalScale(props.height) }}></View>
);

export default Spacer;
