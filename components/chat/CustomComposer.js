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
        backgroundColor: "white",
        borderRadius: scale(50),
        paddingHorizontal: scale(10),
        marginRight: scale(5),
        justifyContent: "center",
        alignItems: "center",
      }}
    ></Composer>
  );
};

export default CustomComposer;
