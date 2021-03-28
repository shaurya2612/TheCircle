import React, {useState} from 'react';
import {TextInput} from 'react-native';
import colors from '../constants/colors';
import styles from '../styles';

const FormTextInput = props => {
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
      selectionColor={'black'}
      style={
        isSelected
          ? {
              ...styles.selectedFormTextInput,
              ...props.style,
              borderColor: props.selectedBorderColor
                ? props.selectedBorderColor
                : colors.primary,
            }
          : {...styles.formTextInput, ...props.style}
      }
      selectionColor={props.selectionColor ?? 'black'}
      onChangeText={props.onChangeText}
      placeholderTextColor={'#cccccc'}
      ref={props.ref ?? null}
    />
  );
};

export default FormTextInput;
