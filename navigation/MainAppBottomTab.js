import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import colors from '../constants/colors';
import Icon from 'react-native-vector-icons/Feather';
import {scale, verticalScale} from 'react-native-size-matters';
import MatchesListScreen from '../screens/matches/MatchesListScreen';
import FriendsTopTab from './FriendsTopTab';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import AvatarCircle from '../components/AvatarCircle';
import {Alert, Text, View} from 'react-native';
import styles from '../styles';
import CurrentUserProfileStack from './UserProfileStack';
import HomeStack from './HomeStack';
import {useDispatch, useSelector} from 'react-redux';
import {MatchesStack} from './MatchesStack';
import {listenForPresence} from '../store/actions/user';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import {FCMMessageHandler} from '../store/actions/pubsub';

const MainAppBottomTabNavigator = createBottomTabNavigator();

async function saveTokenToDatabase(token) {
  const userId = auth().currentUser.uid;

  // Add the token to firestore
  await firestore().collection('tokens').doc(userId).set({
    token,
  });

  console.warn('saved token to database');
}

const MainAppBottomTab = () => {
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {dp} = userState;

  useEffect(() => {
    dispatch(listenForPresence());
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    // Listen to whether the token changes
    const unsubscribe = messaging().onTokenRefresh(token => {
      return saveTokenToDatabase(token);
    });

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      console.warn('remoteMessage', remoteMessage);
      dispatch(FCMMessageHandler(remoteMessage));
    });

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    crashlytics().setUserId(auth().currentUser.uid);
  }, []);

  return (
    <MainAppBottomTabNavigator.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showLabel: false,
        activeTintColor: colors.primary,
        inactiveTintColor: '#cccccc',
        keyboardHidesTabBar: true,
      }}>
      <MainAppBottomTabNavigator.Screen
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name={'home'}
              color={focused ? color.primary : '#cccccc'}
              size={scale(25)}
            />
          ),
        }}
        name={'Home'}
        component={HomeStack}
      />
      <MainAppBottomTabNavigator.Screen
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name={'users'}
              color={focused ? color.primary : '#cccccc'}
              size={scale(25)}
            />
          ),
        }}
        name={'Friends'}
        component={FriendsTopTab}
      />

      <MainAppBottomTabNavigator.Screen
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name={'heart'}
              color={focused ? color.primary : '#cccccc'}
              size={scale(25)}
            />
          ),
        }}
        name={'Matches'}
        component={MatchesStack}
      />
      <MainAppBottomTabNavigator.Screen
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <View style={styles.expandedCenterView}>
              <AvatarCircle
                disabled
                style={{
                  borderWidth: scale(2),
                  borderColor: focused ? color.primary : 'white',
                }}
                size={scale(30)}
                source={{
                  uri: dp,
                }}
              />
            </View>
          ),
        }}
        name={'User'}
        component={CurrentUserProfileStack}
      />
    </MainAppBottomTabNavigator.Navigator>
  );
};
export default MainAppBottomTab;
