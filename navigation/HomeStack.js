import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import HomeScreen from "../screens/home/HomeScreen";
import EditProfileScreen from "../screens/user/EditProfileScreen";

const HomeStackNavigator = createStackNavigator();

export const HomeStack = () => {
  return (
    <HomeStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStackNavigator.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
      />
    </HomeStackNavigator.Navigator>
  );
};

export default HomeStack;
