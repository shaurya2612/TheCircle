import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import colors from "../constants/colors";
import styles from "../styles";
import AppText from "./AppText";
import AvatarCircle from "./AvatarCircle";
import LastMessageText from "./LastMessageText";
import NameText from "./NameText";

export const ChatListItem = ({
  imageUri,
  name,
  lastMessage,
  id,
  label,
  onPressAvatar,
  onPress,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        flexDirection: "row",
        paddingVertical: verticalScale(10),
        backgroundColor: "white",
        borderColor: colors.primary,
      }}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View
        style={{ ...styles.expandedCenterView, paddingHorizontal: scale(10) }}
      >
        {/* Avatar */}
        <AvatarCircle
          onPress={onPressAvatar}
          size={scale(65)}
          source={{ uri: imageUri }}
        />
      </View>

      <View
        style={{
          flex: 3,
          justifyContent: "center",
          paddingHorizontal: scale(10),
        }}
      >
        {/* Name and last message */}
        <NameText>{name}</NameText>
        <AppText style={{ ...styles.lastMessageText, color: "grey" }}>
          {lastMessage}
        </AppText>
      </View>

      <View
        style={{
          ...styles.rootView,
        }}
      >
        {/* Label */}
        {label ? (
          <View style={{ ...styles.rootView, flexDirection: "row" }}>
            <View style={{ flex: 1 }} />
            <View
              style={{
                // height: scale(10),
                // width: scale(10),
                // borderRadius: scale(10),
                ...styles.expandedCenterView,
                backgroundColor: colors.primary,
              }}
            >
              <Text style={{ ...styles.labelText, color: "white" }}>
                {label}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default ChatListItem;
