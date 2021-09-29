import React, {useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import AppText from '../../../../components/AppText';
import AvatarCircle from '../../../../components/AvatarCircle';
import NameText from '../../../../components/NameText';
import gstyles from '../../../../styles';
import ButtonContainer from './ButtonContainer';
import styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';

const SearchListItem = ({userId, onPress, ...props}) => {
  const facebookRecommendationData = useSelector(
    state => state.recommendations.facebook.byIds?.[userId] || {},
  );
  const {name, username, uid, status, dp} = facebookRecommendationData;

  if (!facebookRecommendationData) return null;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
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
              {true ? (
                <MaterialCommunityIcons
                  size={scale(15)}
                  name="facebook"
                  style={styles.icon}
                />
              ) : null}
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

        <ButtonContainer uid={uid} />
      </View>

      {/* <View style={{height: 10, width: 10, backgroundColor: 'red'}}></View> */}
    </TouchableOpacity>
  );
};

export default SearchListItem;
