import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import colors from '../constants/colors';
import Icon from 'react-native-vector-icons/Feather';
import {scale, verticalScale} from 'react-native-size-matters';
import MatchesListScreen from '../screens/MatchesListScreen';
import SearchFriendsScreen from '../screens/SearchFriendsScreen';
import FriendsTopTab from './FriendsTopTab';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import AvatarCircle from '../components/AvatarCircle';
import {View} from 'react-native';
import styles from '../styles';
import CurrentUserProfileStack from './UserProfileStack';
import HomeStack from './HomeStack';
import {useDispatch, useSelector} from 'react-redux';
import {MatchesStack} from './MatchesStack';
import {listenForPresence} from '../store/actions/user';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

const MainAppBottomTabNavigator = createBottomTabNavigator();

async function saveTokenToDatabase(token) {
  const userId = auth().currentUser.uid;
  console.warn(userId);
  // Add the token to firestore
  const firestoreRef = firestore().collection('tokens').doc(userId);

  await firestoreRef.set({
    tokens: firestore.FieldValue.arrayUnion(token),
  });
}

const MainAppBottomTab = () => {
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {dp} = userState;

  useEffect(() => {
    dispatch(listenForPresence());
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
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
              size={verticalScale(25)}
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
              size={verticalScale(25)}
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
              size={verticalScale(25)}
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
                size={verticalScale(30)}
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
