//Auth Stack
//Shown if the user is not logged in
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import LoginScreen from '../screens/login/LoginScreen';
import PhoneAuthScreen from '../screens/login/PhoneAuthScreen';
import SignupNameScreen from '../screens/signup/SignupNameScreen';
import SignupAgeScreen from '../screens/signup/SignupAgeScreen';
import SignupUsernameScreen from '../screens/signup/SignupUsernameScreen';
import SignupGenderScreen from '../screens/signup/SignupGenderScreen';
import SignupUserPhotos from '../screens/signup/SignupUserPhotos';
import SignupInterestedInScreen from '../screens/signup/SignupInterestedInScreen';
import SignupShowMeInTheSearchForScreen from '../screens/signup/SignupShowMeInTheSearchForScreen';
import PhoneVerificationScreen from '../screens/login/PhoneVerificationScreen';

const AuthStackNavigator = createStackNavigator();

const AuthStack = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={TransitionPresets.SlideFromRightIOS}
      headerMode="none">
      <AuthStackNavigator.Screen
        name="SignupNameScreen"
        component={SignupNameScreen}
        options={TransitionPresets.ModalSlideFromBottomIOS}
      />
      <AuthStackNavigator.Screen
        name="SignupAgeScreen"
        component={SignupAgeScreen}
      />
      <AuthStackNavigator.Screen
        name="SignupUsernameScreen"
        component={SignupUsernameScreen}
      />
      <AuthStackNavigator.Screen
        name="SignupGenderScreen"
        component={SignupGenderScreen}
      />
      <AuthStackNavigator.Screen
        name="SignupShowMeInTheSearchForScreen"
        component={SignupShowMeInTheSearchForScreen}
      />
      <AuthStackNavigator.Screen
        name="SignupInterestedInScreen"
        component={SignupInterestedInScreen}
      />
      <AuthStackNavigator.Screen
        name="SignupUserPhotos"
        component={SignupUserPhotos}
      />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthStack;
