import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EditProfileScreen from "../screens/user/EditProfileScreen";
import UserScreen from "../screens/user/UserScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import UserCueCardsScreen from "../screens/user/UserCueCardsScreen";
import { SettingsStack } from "./SettingsStack";

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
        name="SettingsStack"
        component={SettingsStack}
      />
      <CurrentUserProfileStackNavigator.Screen
        name="UserCueCardsScreen"
        component={UserCueCardsScreen}
      />
    </CurrentUserProfileStackNavigator.Navigator>
  );
};

export default CurrentUserProfileStack;
