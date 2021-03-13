import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Send } from "react-native-gifted-chat";
import { scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import AppText from "../AppText";

const ReplyChatFooter = ({onDismiss, ...props}) => {
  return (
    <View style={{ height: scale(50), flexDirection: "row" }}>
      <View
        style={{ height: scale(50), width: scale(5), backgroundColor: "red" }}
      ></View>
      <View style={{ flexDirection: "column" }}>
        <AppText
          style={{ color: "red", paddingLeft: scale(10), paddingTop: scale(5) }}
        >
          {"replyTo"}
        </AppText>
        <AppText
          style={{
            color: "gray",
            paddingLeft: scale(10),
            paddingTop: scale(5),
          }}
        >
          {"replyMsg"}
        </AppText>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-end",
          paddingRight: scale(10),
        }}
      >
        <TouchableOpacity onPress={onDismiss}>
          <Icon name="x" color="#0084ff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReplyChatFooter;
