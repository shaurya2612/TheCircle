import React from "react";
import { Button, Text, TouchableOpacity } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import styles from "../styles";

export const StartMatchingButton = ({title, ...props}) => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={
        props.disabled
          ? { ...styles.disabledSelectionButton, ...props.style }
          : { ...styles.startMatchingButton, ...props.style }
      }
    >
      <Text
        style={{
          fontSize: scale(22, 0.4),
          color: props.disabled ? "#666666" : "white",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default StartMatchingButton;
