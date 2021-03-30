import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {Keyboard, Platform, TouchableOpacity, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../../styles';
import AppText from '../AppText';
import AvatarCircle from '../AvatarCircle';
import CustomHeader from '../CustomHeader';
import IconCircle from '../IconCircle';
import colors from '../../constants/colors';

const AnonymousChatHeader = ({
  onPressCards,
  onPressEllipsis,
  FOF,
  viaFriend,
  online,
  ...props
}) => {
  return (
    <View>
      <View
        style={{
          backgroundColor: '#cccccc',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AppText>via {viaFriend.name}</AppText>
      </View>
      {FOF.nonBinary ? (
        <LinearGradient
          colors={['blue', 'red', 'yellow', 'green']}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              paddingHorizontal: scale(10),
              backgroundColor: '#0078ff',
              borderRadius: scale(100),
              margin: scale(2),
              borderWidth: 1,
              borderColor: 'white',
            }}>
            <AppText style={{color: 'white'}}>Shown in {FOF.gender}</AppText>
          </View>
        </LinearGradient>
      ) : null}
      <CustomHeader
        style={{
          backgroundColor: 'white',
          overflow: 'visible',
          ...(Platform.OS === 'android'
            ? styles.elevation_small
            : {borderBottomWidth: scale(0.5), borderColor: 'grey'}),
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: scale(10),
            overflow: 'hidden',
          }}>
          <View
            style={{
              flexDirection: 'row',
              // justifyContent: "center",
              alignItems: 'center',
              overflow: 'scroll',
            }}>
            <Icon name={'user'} size={scale(20)} color={'black'} />
            <View
              style={{
                flexWrap: 'nowrap',
                overflow: 'scroll',
                maxWidth: '70%',
                // flexDirection: 'row',
                ...styles.centerView,
              }}>
              <AppText
                style={{
                  ...styles.nameText,
                  marginHorizontal: scale(10),
                  color: 'black',
                }}>
                {`${FOF.nonBinary ?? FOF.gender}, ${FOF.age}`}
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
              {/* {online ? (
                <FontAwesome5Icon name={'circle'} solid color={'green'} />
              ) : null} */}
            </View>
          </View>
        </View>

        {/* Right Section */}
        <TouchableOpacity
          style={{
            width: scale(40),
            height: '100%',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={onPressCards}>
          <FontAwesome5Icon
            style={{
              transform: [{rotateY: '180deg'}],
            }}
            name={'clone'}
            size={scale(20)}
            color={'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: scale(40),
            height: '100%',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={onPressEllipsis}>
          <FontAwesome5Icon
            style={{
              transform: [{rotateY: '180deg'}],
            }}
            name={'ellipsis-v'}
            size={scale(20)}
            color={'black'}
          />
        </TouchableOpacity>
      </CustomHeader>
    </View>
  );
};

export default AnonymousChatHeader;
