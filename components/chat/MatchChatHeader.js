import React from 'react';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import styles from '../../styles';
import AppText from '../AppText';
import AvatarCircle from '../AvatarCircle';
import CustomHeader from '../CustomHeader';

const MatchChatHeader = ({onPressName, onPressCueCards, online, ...props}) => {
  const match = useSelector(state => state.chat.match);
  return (
    <CustomHeader
      style={{
        backgroundColor: 'white',
        overflow: 'visible',
        ...(Platform.OS === 'android'
          ? styles.elevation_small
          : {borderBottomWidth: scale(0.5), borderColor: 'grey'}),
      }}>
      {/* Left Section */}
      <TouchableOpacity
        style={{
          width: scale(40),
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          Keyboard.dismiss();
          props.navigation.goBack();
        }}>
        <Icon name={'arrow-left'} size={scale(20)} color={'black'} />
      </TouchableOpacity>
      {/* Middle Section */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: scale(10),
          overflow: 'hidden',
        }}>
        <TouchableOpacity
          onPress={onPressName}
          style={{
            flexDirection: 'row',
            // justifyContent: "center",
            alignItems: 'center',
            overflow: 'scroll',
          }}>
          <AvatarCircle disabled size={scale(30)} source={{uri: match.dp}} />
          <View
            style={{
              flexWrap: 'nowrap',
              overflow: 'scroll',
              maxWidth: '70%',
              ...styles.centerView,
            }}>
            <AppText
              style={{
                ...styles.nameText,
                marginHorizontal: scale(10),
                color: 'black',
              }}>
              {match.name}
            </AppText>
            {online ? (
              <View
                style={{
                  alignSelf: 'flex-start',
                  marginHorizontal: scale(10),
                }}>
                <AppText style={{color: 'black', fontSize: scale(10)}}>
                  online
                </AppText>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
      {/* Right Section */}
      <TouchableOpacity
        style={{
          width: scale(40),
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onPressCueCards}>
        <FontAwesome5Icon
          style={{transform: [{rotateY: '180deg'}]}}
          name={'clone'}
          size={scale(20)}
        />
      </TouchableOpacity>
    </CustomHeader>
  );
};

export default MatchChatHeader;
