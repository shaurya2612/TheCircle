import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MatchesListScreen from "../screens/MatchesListScreen";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import FAQsScreen from "../screens/settings/FAQsScreen";

const SettingsStackNavigator = createStackNavigator();

export const SettingsStack = () => {
  return (
    <SettingsStackNavigator.Navigator
      headerMode="none"
      initialRouteName="SettingsScreen"
    >
      <SettingsStackNavigator.Screen
        name={"SettingsScreen"}
        component={SettingsScreen}
      />
      <SettingsStackNavigator.Screen
        name={"FAQsScreen"}
        component={FAQsScreen}
      />
    </SettingsStackNavigator.Navigator>
  );
};
