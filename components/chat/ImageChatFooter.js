import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Send } from "react-native-gifted-chat";
import { scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import AppText from "../AppText";

const ImageChatFooter = ({onDismiss, text, ...props}) => {
  return (
    <View style={{ height: scale(30), flexDirection: "row" }}>
      <View
        style={{ height: scale(30), width: scale(5), backgroundColor: "black" }}
      ></View>
      <View style={{ flexDirection: "row" }}>
        <Icon name={'camera'} size={scale(15)} style={{margin:scale(5)}} />
        <AppText
          style={{
            color: "gray",
            paddingLeft: scale(10),
            paddingTop: scale(5),
          }}
        >
          {text}
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

export default ImageChatFooter;
