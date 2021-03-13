import React from "react";
import CustomHeader from "./CustomHeader";
import Icon from "react-native-vector-icons/Feather";
import { scale } from "react-native-size-matters";

const StackHeader = (props) => (
  <CustomHeader>
    <Icon
      name={"arrow-left"}
      size={scale(30)}
      color={"black"}
      onPress={() => {
        props.navigation.goBack();
      }}
    />
  </CustomHeader>
);

export default StackHeader;
