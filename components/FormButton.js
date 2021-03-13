import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import styles from "../styles";

const FormButton = (props) => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={props.disabled ? {...styles.disabledFormButtom, ...props.style} : {...styles.formButton, ...props.style}}
    >
      <Text
        style={{
          fontSize: scale(22, 0.4),
          color: props.disabled ? "#666666" : "white",
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default FormButton;
