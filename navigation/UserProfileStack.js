import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EditProfileScreen from "../screens/user/EditProfileScreen";
import UserScreen from "../screens/user/UserScreen";
import SettingsScreen from "../screens/user/SettingsScreen";
import UserCueCardsScreen from "../screens/user/UserCueCardsScreen";

const CurrentUserProfileStackNavigator = createStackNavigator();

const CurrentUserProfileStack = () => {
  return (
    <CurrentUserProfileStackNavigator.Navigator
      screenOptions={{ headerShown: false }}
    >
      <CurrentUserProfileStackNavigator.Screen
        name="UserScreen"
        component={UserScreen}
      />
      <CurrentUserProfileStackNavigator.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
      />
      <CurrentUserProfileStackNavigator.Screen
        name="SettingsScreen"
        component={SettingsScreen}
      />
      <CurrentUserProfileStackNavigator.Screen
        name="UserCueCardsScreen"
        component={UserCueCardsScreen}
      />
    </CurrentUserProfileStackNavigator.Navigator>
  );
};

export default CurrentUserProfileStack;
