import React from "react";
import { Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import styles from "../styles";

const CountryCodeInput = () => <TouchableHighlight style={styles.countryCodeInputView}>
    <Text style={{fontSize:moderateScale(20, 0.4)}}>IN +91</Text>
</TouchableHighlight>;

export default CountryCodeInput;
