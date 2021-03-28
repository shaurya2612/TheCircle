import React from 'react';
import {View} from 'react-native';
import styles from '../../styles';
import AppText from '../AppText';

export const SmallStatBox = props => {
  return (
    <View {...props} style={{...styles.smallStatBoxView, ...props.style}}>
      <AppText
        style={{...styles.labelText, color: 'black', ...props.labelStyle}}>
        {props.statName}
      </AppText>
      <AppText
        style={{...styles.titleText, color: 'black', ...props.textStyle}}>
        {props.statNumber}
      </AppText>
    </View>
  );
};

export default SmallStatBox;
