import React from "react";
import { ActivityIndicator, View } from "react-native";
import colors from "../constants/colors";
import styles from "../styles";

export const LoadingScreen = () => {
  return (
    <View style={{ ...styles.expandedCenterView, backgroundColor: "white" }}>
      <ActivityIndicator size={"large"} color={colors.primary}/>
    </View>
  );
};

export default LoadingScreen;
