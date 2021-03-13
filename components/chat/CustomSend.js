import React from "react";
import { View } from "react-native";
import { Send } from "react-native-gifted-chat";
import { scale } from "react-native-size-matters";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const CustomSend = (props) => {
  return (
    <Send {...props}>
      <View
        style={{
        //   backgroundColor: "#00C6FF",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: scale(50),
          borderColor: "black",
        }}
      >
        <FontAwesome5Icon
          name={"chevron-circle-right"}
          color={"white"}
          size={scale(30)}
        />
      </View>
    </Send>
  );
};

export default CustomSend;
