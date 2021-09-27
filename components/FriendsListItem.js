import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import colors from "../constants/colors";
import styles from "../styles";
import AppText from "./AppText";
import AvatarCircle from "./AvatarCircle";
import LastMessageText from "./LastMessageText";
import NameText from "./NameText";

export const FriendsListItem = ({
  imageUri,
  name,
  userId,
  onPress,
  username,
  age,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        flexDirection: "row",
        paddingVertical: verticalScale(10),
        backgroundColor: "white",
      }}
      onPress={onPress}
    >
      <View
        style={{ ...styles.expandedCenterView, paddingHorizontal: scale(10) }}
      >
        {/* Avatar */}
        <AvatarCircle disabled size={scale(65)} source={{ uri: imageUri }} />
      </View>

      <View
        style={{
          flex: 3,
          justifyContent: "center",
          paddingHorizontal: scale(10),
        }}
      >
        {/* Name */}
        <NameText>{name}</NameText>
        <AppText style={{...styles.usernameText, fontSize: scale(12)}}>{username}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default FriendsListItem;
