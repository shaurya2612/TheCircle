import React from "react";
import { ImageBackground, TouchableOpacity } from "react-native";

export const AvatarCircle = ({ size, source, onPress, disabled, onLongPress, ...props }) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} onLongPress={onLongPress}>
      <ImageBackground
        {...props}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          ...props.style,
        }}
        imageStyle={{ resizeMode: "cover" }}
        source={source}
      />
    </TouchableOpacity>
  );
};

export default AvatarCircle;
