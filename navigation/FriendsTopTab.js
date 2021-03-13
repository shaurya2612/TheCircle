import React from "react";
import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SearchFriendsScreen from "../screens/SearchFriendsScreen";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FriendRequestsScreen from "../screens/FriendRequestsScreen";
import FriendsScreen from "../screens/FriendsScreen";
import CustomSafeAreaView from "../components/CustomSafeAreaView";
import styles from "../styles";

const FriendsTopTabNavigator = createMaterialTopTabNavigator();

export default FriendsTopTab = () => {
  return (
    <CustomSafeAreaView style={styles.rootView}>
      <FriendsTopTabNavigator.Navigator>
        <FriendsTopTabNavigator.Screen
          name="Friends"
          component={FriendsScreen}
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
