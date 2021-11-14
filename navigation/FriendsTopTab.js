import React from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SearchFriendsScreen from '../screens/friends/SearchFriendsScreen';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FriendRequestsScreen from '../screens/friends/FriendRequestScreen';
import FriendsScreen from '../screens/friends/FriendsScreen';
import CustomSafeAreaView from '../components/CustomSafeAreaView';
import styles from '../styles';
import StreamsListScreen from '../screens/streams/StreamsListScreen';
import {scale, verticalScale} from 'react-native-size-matters';
import colors from '../constants/colors';
import AppText from '../components/AppText';

const FriendsTopTabNavigator = createMaterialTopTabNavigator();

const FriendsTopTab = () => {
  return (
    <CustomSafeAreaView style={styles.rootView}>
      <View
        style={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
        <View
          style={{
            paddingHorizontal: scale(10),
            backgroundColor: 'white',
            marginVertical: verticalScale(10),
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
          }}>
          <AppText style={{...styles.titleText, fontFamily: 'Quicksand-Bold'}}>
            Connect
          </AppText>
          <View>
            {/* <AppText style={{fontFamily: 'Quicksand-Bold', color: 'steelblue'}}>
              Copy invite
            </AppText> */}
          </View>
        </View>
      </View>
      <FriendsTopTabNavigator.Navigator
        tabBarOptions={{
          labelStyle: {
            textTransform: 'none',
            fontSize: scale(11),
            fontWeight: 'bold',
          },
          activeTintColor: 'white',
          inactiveTintColor: 'grey',
          indicatorStyle: {
            height: null,
            top: '20%',
            bottom: '20%',
            backgroundColor: colors.primary,
            borderRadius: scale(100),
          },
          // renderIndicator:() => <View style={{backgroundColor:'blue'}}></View>,
          allowFontScaling: false,
          style: {backgroundColor: 'white'},
          tabBarBadge: () => (
            <View
              style={{height: 40, width: 40, backgroundColor: 'red'}}></View>
          ),
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

export default FriendsTopTab;
