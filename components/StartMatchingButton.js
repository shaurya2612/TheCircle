import React from 'react';
import {Button, Text, TouchableOpacity} from 'react-native';
import {moderateScale, scale} from 'react-native-size-matters';
import colors from '../constants/colors';
import styles from '../styles';
import AppText from './AppText';

export const StartMatchingButton = ({title, ...props}) => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={
        props.disabled
          ? {...styles.disabledSelectionButton, ...props.style}
          : {
              ...styles.startMatchingButton,
              ...styles.elevation_medium,
              ...props.style,
            }
      }>
      <AppText
        style={{
          fontSize: scale(20, 0.4),
          color: props.disabled ? '#cccccc' : colors.accent,
        }}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
};

export default StartMatchingButton;
