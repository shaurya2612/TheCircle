import React, { useState } from "react";
import { TextInput } from "react-native";
import styles from "../styles";

const FormTextInput = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <TextInput
    {...props}
    
      onFocus={
        props.onFocus
          ? props.onFocus
          : () => {
              setIsSelected(true);
            }
      }
      onBlur={
        props.onBlur
          ? props.onBlur
          : () => {
              setIsSelected(false);
            }
      }
      selectionColor={"black"}
      style={isSelected?{...styles.selectedFormTextInput, ...props.style}:{...styles.formTextInput, ...props.style}}
      onChangeText={props.onChangeText}
      placeholderTextColor = {"#cccccc"}
    />
  );
};

export default FormTextInput;
