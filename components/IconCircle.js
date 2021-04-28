import React from 'react';
import {View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../constants/colors';
import {infoIconNames} from '../constants/infoIconsConfig';
import styles from '../styles';
import AppText from './AppText';

export const IconCircle = ({
  iconType,
  label,
  labelStyle,
  iconName,
  iconColor,
  iconSize,
  iconStyle,
  solid,
  size,
  ...props
}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: scale(100),
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: scale(3),
          borderRadius: verticalScale(50),
          backgroundColor: 'white',
          height: size ?? verticalScale(65),
          width: size ?? verticalScale(65),
          ...props.style,
        }}>
        <Icon
          name={infoIconNames[iconType] ?? iconName}
          size={iconSize ?? verticalScale(30)}
          color={iconColor ?? 'black'}
          solid={solid}
        />
      </View>
      <AppText
        style={{...styles.labelText, margin: verticalScale(5), ...labelStyle}}>
        {label}
      </AppText>
    </View>
  );
};

export default IconCircle;
