import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import MatchesListScreen from '../screens/MatchesListScreen';
import ChatScreen from '../screens/ChatScreen';
import PhoneAuthScreen from '../screens/login/PhoneAuthScreen';
import PhoneVerificationScreen from '../screens/login/PhoneVerificationScreen';
import LoginScreen from '../screens/login/LoginScreen';

const PhoneAuthStackNavigator = createStackNavigator();

export const PhoneAuthStack = () => {
  return (
    <PhoneAuthStackNavigator.Navigator headerMode="none">
      <PhoneAuthStackNavigator.Screen
        name="LoginScreen"
        component={LoginScreen}
      />
      <PhoneAuthStackNavigator.Screen
        name={'PhoneAuthScreen'}
        component={PhoneAuthScreen}
        options={TransitionPresets.ModalSlideFromBottomIOS}
      />
      <PhoneAuthStackNavigator.Screen
        name={'PhoneVerificationScreen'}
        component={PhoneVerificationScreen}
      />
    </PhoneAuthStackNavigator.Navigator>
  );
};
