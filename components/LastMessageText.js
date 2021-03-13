import React from "react";
import { Text } from "react-native";
import styles from "../styles";

export const LastMessageText = (props) => {
  return <Text {...props} style={{...styles.lastMessageText, ...props.style}}>{props.children}</Text>;
};

export default LastMessageText;
