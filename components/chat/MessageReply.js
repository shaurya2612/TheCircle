import React from "react";
import { Text, View } from "react-native";

export const MessageReply = ({ replyTo, replyMsg, ...props }) => {
  return (
    <View style={props.containerStyle}>
      <View style={{ padding: 5 }}>
        <View style={{ backgroundColor: "#005CB5", borderRadius: 15 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: 50,
                width: 10,
                backgroundColor: "#00468A",
                borderTopLeftRadius: 15,
                borderBottomLeftRadius: 15,
              }}
            />
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "white",
                  paddingHorizontal: 10,
                  paddingTop: 5,
                  fontWeight: "700",
                }}
              >
                {replyTo}
              </Text>
              <Text
                style={{ color: "white", paddingHorizontal: 10, paddingTop: 5 }}
              >
                {replyMsg}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
