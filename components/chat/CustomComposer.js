import React from "react";
import { Composer } from "react-native-gifted-chat";
import { scale } from "react-native-size-matters";
import styles from "../../styles";

const CustomComposer = (props) => {
  return (
    <Composer
      {...props}
      textInputStyle={{
        ...styles.chatComposerText,
        ...styles.elevation_small,
        backgroundColor: "white",
        borderRadius: scale(25),
        paddingHorizontal: scale(10),
        marginRight: scale(5),
        justifyContent: "center",
        alignItems: "center",
        overflow: "scroll"
      }}
    ></Composer>
  );
};

export default CustomComposer;
