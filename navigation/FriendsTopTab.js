import React from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SearchFriendsScreen from '../screens/friends/SearchFriendsScreen';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FriendRequestsScreen from '../screens/friends/FriendRequestsScreen';
import FriendsScreen from '../screens/friends/FriendsScreen';
import CustomSafeAreaView from '../components/CustomSafeAreaView';
import styles from '../styles';
import StreamsListScreen from '../screens/streams/StreamsListScreen';
import { scale } from 'react-native-size-matters';

const FriendsTopTabNavigator = createMaterialTopTabNavigator();

export default FriendsTopTab = () => {
  return (
    <CustomSafeAreaView style={styles.rootView}>
      <FriendsTopTabNavigator.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: scale(10),
          },
        }}>
        <FriendsTopTabNavigator.Screen
          name="Friends"
          component={FriendsScreen}
        />
        <FriendsTopTabNavigator.Screen
          name="Streams"
          component={StreamsListScreen}
        />
        <FriendsTopTabNavigator.Screen
          name="Requests"
          component={FriendRequestsScreen}
        />
        <FriendsTopTabNavigator.Screen
          name="Search"
          component={SearchFriendsScreen}
        />
      </FriendsTopTabNavigator.Navigator>
    </CustomSafeAreaView>
  );
};
