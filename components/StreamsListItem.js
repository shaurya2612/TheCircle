import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../constants/colors';
import gstyles from '../styles';
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
        ...gstyles.centerView,
        ...props.style,
      }}>
      <FontAwesome5Icon name={icon} size={iconSize} />
    </View>
  );
};

const StreamsListItem = ({icon, name, onPress, members}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}>
      <View style={[styles.row, {flex: 1}]}>
        <View style={styles.avatarContainer}>
          {/* Avatar */}
          <StreamsListItemIcon
            size={scale(65)}
            iconSize={scale(32.5)}
            borderColor={'black'}
            icon={icon}
          />
        </View>

        <View style={styles.textContainer}>
          {/* Name */}
          <View style={[styles.row, {alignItems: 'center'}]}>
            <View style={styles.nameContainer}>
              <NameText numberOfLines={1}>{name}</NameText>
            </View>
          </View>
          <AppText
            numberOfLines={1}
            style={{...gstyles.usernameText, ...styles.username}}>
            {`${members ?? 'No'} Members`}
          </AppText>
        </View>
      </View>
      {/* <View style={{height: 10, width: 10, backgroundColor: 'red'}}></View> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // flexDirection: 'row',
    paddingVertical: verticalScale(10),
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {fontSize: scale(12)},
  avatarContainer: {
    paddingHorizontal: scale(10),
  },
  nameContainer: {
    maxWidth: '75%',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(4),
    height: '100%',
  },
});

export default StreamsListItem;
