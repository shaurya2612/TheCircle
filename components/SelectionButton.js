import React, {useEffect} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import styles from '../styles';

const SelectionButton = props => {
  return (
    <TouchableOpacity
      {...props}
      disabled={props.disabled}
      onPress={props.onPress}
      style={
        props.disabled || props.disabledStyle
          ? {...styles.disabledSelectionButton, ...props.style}
          : {...styles.selectionButton, ...props.style}
      }>
      <Text
        style={{
          fontSize: scale(22),
          color: props.disabled ? '#cccccc' : props.textColor ?? 'black',
        }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default SelectionButton;
