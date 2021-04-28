import React from 'react';
import {View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {infoIconNames} from '../constants/infoIconsConfig';
import styles from '../styles';
import AppText from './AppText';

const InfoPill = ({
  text,
  iconName,
  iconType,
  backgroundColor,
  contentColor,
  ...props
}) => {
  return (
    <View
      style={{
        height: verticalScale(20),
        backgroundColor: backgroundColor ?? 'white',
        paddingHorizontal: scale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: scale(2.5),
        borderRadius: scale(100),
      }}>
      <View
        style={{
          width: scale(15),
          ...styles.centerView,
        }}>
        <FontAwesome5Icon
          name={infoIconNames[iconType] ?? iconName}
          color={contentColor ?? 'black'}
        />
      </View>
      <AppText
        style={{
          fontSize: verticalScale(10),
          color: contentColor ?? 'black',
          marginLeft: scale(5),
          alignSelf: 'center',
        }}>
        {text}
      </AppText>
    </View>
  );
};

export default InfoPill;
