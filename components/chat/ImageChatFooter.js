import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {Send} from 'react-native-gifted-chat';
import {scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../../styles';
import AppText from '../AppText';

const ImageChatFooter = ({onDismiss, text, imageUri,...props}) => {
  const footerHeight = verticalScale(60);
  return (
    <View
      style={{
        height: scale(footerHeight),
        flexDirection: 'row',
        ...styles.centerView,
        ...styles.elevation_medium
      }}>
      <View
        style={{
          height: scale(footerHeight),
          width: scale(5),
          backgroundColor: 'black',
        }}></View>
      <View
        style={{flexDirection: 'row', padding: scale(2), ...styles.centerView}}>
        {/* <Icon name={'camera'} size={scale(15)} style={{margin:scale(5)}} /> */}
        <View style={{height: footerHeight, width: scale(70)}}>
          <Image
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
            source={{uri: imageUri}}/>
        </View>
        <AppText
          style={{
            color: 'gray',
            paddingLeft: scale(10),
            paddingTop: scale(5),
          }}>
          {text}
        </AppText>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: scale(10),
        }}>
        <TouchableOpacity onPress={onDismiss}>
          <Icon name="x" color="#0084ff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImageChatFooter;
