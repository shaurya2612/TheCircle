import React from 'react';
import {useState} from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import colors from '../../constants/colors';
import styles from '../../styles';
import AppText from '../AppText';
import SmallStatBox from './SmallStatBox';

const HomeStatCard = ({onPressImage, friends, matches}) => {
  const userState = useSelector(state => state.user);
  const {name, dp, username} = userState;
  const [areEditOptionsVisible, setAreEditOptionsVisible] = useState(true);
  return (
    <View>
      <View style={{...styles.homeStatCardView, ...styles.elevation_medium}}>
        <TouchableWithoutFeedback onPressIn={onPressImage}>
          <ImageBackground
            source={{
              uri: dp,
            }}
            style={{
              ...styles.homeStatCardImageBackground,
              ...styles.elevation_small,
            }}></ImageBackground>
        </TouchableWithoutFeedback>
        <AppText
          style={{
            ...styles.titleText,
            textAlign: 'center',
            marginTop: verticalScale(20),
          }}>
          {name}
        </AppText>
        <AppText
          style={{
            ...styles.usernameText,
            textAlign: 'center',
          }}>
          {username ? '@' + username : 'Loading...'}
        </AppText>
        {/* <View
        style={{
          flexDirection: 'row',
          marginTop: verticalScale(10),
          ...styles.centerView,
        }}>
        <SmallStatBox
          statName="Friends"
          statNumber={
            friends == 0
              ? '- -'
              : friends < 10
              ? '0' + friends.toString()
              : friends
          }
        />
        <SmallStatBox
          style={{borderLeftWidth: scale(1)}}
          statName="Matches"
          statNumber={
            matches == 0
              ? '- -'
              : matches < 10
              ? '0' + matches.toString()
              : matches
          }
        />
      </View> */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          ...styles.elevation_medium,
          borderBottomLeftRadius: verticalScale(15),
          borderBottomRightRadius: verticalScale(15),
          overflow: 'hidden',
        }}>
        <View
          style={{
            height: scale(80),
            flex: 1,
            backgroundColor: '#3490dc',
            borderRightWidth: scale(0.5),
            borderColor: "grey",
            ...styles.centerView,
          }}>
          <View style={{height: '100%', paddingVertical: scale(10)}}>
            <View
              style={{
                flexDirection: 'row',
                ...styles.centerView,
                alignSelf: 'flex-start',
              }}>
              <Icon
                name="users"
                color="white"
                size={scale(15)}
                style={{marginRight: scale(5)}}
              />
              <AppText style={{color: 'white', fontSize: scale(15)}}>
                {'Friends'}
              </AppText>
            </View>
            <AppText
              style={{
                color: 'white',
                fontSize: scale(25),
                alignSelf: 'center',
                marginTop: scale(5),
              }}>
              {friends == 0
                ? '- -'
                : friends < 10
                ? '0' + friends.toString()
                : friends}
            </AppText>
          </View>
        </View>
        <View
          style={{
            height: scale(80),
            flex: 1,
            backgroundColor: '#ff72c6',
            ...styles.centerView,
          }}>
          <View style={{height: '100%', paddingVertical: scale(10)}}>
            <View
              style={{
                flexDirection: 'row',
                ...styles.centerView,
                alignSelf: 'flex-start',
              }}>
              <Icon
                name="heart"
                color="white"
                size={scale(15)}
                style={{marginRight: scale(5)}}
              />
              <AppText style={{color: 'white', fontSize: scale(15)}}>
                {'Matches'}
              </AppText>
            </View>
            <AppText
              style={{
                color: 'white',
                fontSize: scale(25),
                alignSelf: 'center',
                marginTop: scale(5),
              }}>
              {friends == 0
                ? '- -'
                : friends < 10
                ? '0' + friends.toString()
                : friends}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeStatCard;
