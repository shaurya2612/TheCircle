import React from "react";
import { TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import styles from "../styles";
import CountryCodeInput from "./CountryCodeInput";
import FormTextInput from "./FormTextInput";

export const SearchBar = ({ placeholder, ...props }) => {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Icon
        style={{ marginHorizontal: scale(5) }}
        name="search"
        color="black"
        size={scale(20)}
      />
      <FormTextInput
        {...props}
        style={{ width: "80%" }}
        placeholder={placeholder}
      />
    </View>
  );
};

export default SearchBar;
