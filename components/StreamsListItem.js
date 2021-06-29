import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../constants/colors';
import styles from '../styles';
import AppText from './AppText';
import NameText from './NameText';

export const StreamsListItemIcon = ({
  size,
  borderColor,
  iconSize,
  icon,
  ...props
}) => {
  return (
    <View
      style={{
        height: size - scale(1), //border width adds 1
        width: size - scale(1),
        borderColor: borderColor,
        borderWidth: scale(1),
        borderRadius: scale(100),
        ...styles.centerView,
        ...props.style,
      }}>
      <FontAwesome5Icon name={icon} size={iconSize} />
    </View>
  );
};

const StreamsListItem = ({icon, name, onPress, members}) => {
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        flexDirection: 'row',
        paddingVertical: verticalScale(10),
        backgroundColor: 'white',
      }}
      onPress={onPress}>
      <View
        style={{...styles.expandedCenterView, paddingHorizontal: scale(10)}}>
        {/* Stream Icon */}
        <StreamsListItemIcon
          size={scale(65)}
          iconSize={scale(32.5)}
          borderColor={'black'}
          icon={icon}
        />
      </View>

      <View
        style={{
          flex: 3,
          justifyContent: 'center',
          paddingHorizontal: scale(10),
        }}>
        {/* Name */}
        <NameText>{name}</NameText>
        <AppText style={{...styles.usernameText, fontSize: scale(12)}}>{`${
          members ?? 'No'
        } Members`}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default StreamsListItem;
