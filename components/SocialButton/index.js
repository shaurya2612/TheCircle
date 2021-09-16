import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import colors from '../../constants/colors';
import styles from '../../styles';
import AppText from '../AppText';

const SocialButton = props => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      activeOpacity={0.8}
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
        {props.title}
      </AppText>
    </TouchableOpacity>
  );
};

export default SocialButton;
