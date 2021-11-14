import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import colors from '../constants/colors';
import gstyles from '../styles';
import AppText from './AppText';
import AvatarCircle from './AvatarCircle';
import NameText from './NameText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ConnectListItem = ({
  name,
  username,
  uid,
  status,
  dp,
  onPress,
  buttonInRow,
  facebook,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}>
      <View style={[styles.row, {flex: 1}]}>
        <View style={styles.avatarContainer}>
          {/* Avatar */}
          <AvatarCircle disabled size={scale(65)} source={{uri: dp}} />
        </View>

        <View style={styles.textContainer}>
          {/* Name */}
          <View style={[styles.row, {alignItems: 'center'}]}>
            <View style={styles.nameContainer}>
              <NameText numberOfLines={1}>{name}</NameText>
            </View>
            <View style={[styles.iconContainer]}>
              {facebook && (
                <MaterialCommunityIcons
                  size={scale(15)}
                  name="facebook"
                  style={styles.icon}
                />
              )}
              {/* {true ? (
                        <AntDesign
                          size={scale(15)}
                          name="contacts"
                          style={styles.icon}
                        />
                      ) : null} */}
            </View>
          </View>
          <AppText
            numberOfLines={1}
            style={{...gstyles.usernameText, ...styles.username}}>
            {'@' + username}
          </AppText>
        </View>
        {buttonInRow && props.children}
      </View>
      {!buttonInRow && props.children}
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

export default ConnectListItem;
