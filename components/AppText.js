import React from "react";
import { Text } from "react-native";
import styles from "../styles";

const AppText = (props) => <Text {...props} style={{...styles.appText, ...props.style}}>{props.children}</Text>;

export default AppText;
