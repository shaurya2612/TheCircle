import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MatchesListScreen from "../screens/MatchesListScreen";
import ChatScreen from "../screens/ChatScreen";

const MatchesStackNavigator = createStackNavigator();

export const MatchesStack = () => {
  return (
    <MatchesStackNavigator.Navigator
      headerMode="none"
      initialRouteName="MatchesListScreen"
    >
      <MatchesStackNavigator.Screen
        name={"MatchesListScreen"}
        component={MatchesListScreen}
      />
      <MatchesStackNavigator.Screen
        name={"ChatScreen"}
        component={ChatScreen}
      />
    </MatchesStackNavigator.Navigator>
  );
};
