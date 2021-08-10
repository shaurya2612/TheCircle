import React, {useEffect} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {color} from 'react-native-reanimated';
import {moderateScale, scale} from 'react-native-size-matters';
import colors from '../constants/colors';
import styles from '../styles';

const FormButton = props => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={
        props.disabled
          ? {...styles.disabledFormButtom, ...props.style}
          : {...styles.formButton, ...styles.elevation_small, ...props.style}
      }>
      <Text
        style={{
          fontSize: props.textSize ?? scale(22, 0.4),
          color: props.disabled ? '#cccccc' : props.textColor ?? colors.primary,
        }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default FormButton;
