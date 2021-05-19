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

const SignupStackNavigator = createStackNavigator();

const SignupStack = () => {
  return (
    <SignupStackNavigator.Navigator
      screenOptions={TransitionPresets.SlideFromRightIOS}
      headerMode="none">
      <SignupStackNavigator.Screen
        name="SignupNameScreen"
        component={SignupNameScreen}
        options={TransitionPresets.ModalSlideFromBottomIOS}
      />
      <SignupStackNavigator.Screen
        name="SignupAgeScreen"
        component={SignupAgeScreen}
      />
      <SignupStackNavigator.Screen
        name="SignupUsernameScreen"
        component={SignupUsernameScreen}
      />
      <SignupStackNavigator.Screen
        name="SignupGenderScreen"
        component={SignupGenderScreen}
      />
      <SignupStackNavigator.Screen
        name="SignupShowMeInTheSearchForScreen"
        component={SignupShowMeInTheSearchForScreen}
      />
      <SignupStackNavigator.Screen
        name="SignupInterestedInScreen"
        component={SignupInterestedInScreen}
      />
      <SignupStackNavigator.Screen
        name="SignupUserPhotos"
        component={SignupUserPhotos}
      />
    </SignupStackNavigator.Navigator>
  );
};

export default SignupStack;
