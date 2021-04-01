//Auth Stack
//Shown if the user is not logged in
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import PhoneAuthScreen from '../screens/PhoneAuthScreen';
import SignupNameScreen from '../screens/SignupNameScreen';
import SignupAgeScreen from '../screens/SignupAgeScreen';
import SignupUsernameScreen from '../screens/SignupUsernameScreen';
import SignupPasswordScreen from '../screens/SignupPasswordScreen';
import SignupGenderScreen from '../screens/SignupGenderScreen';
import SignupUserPhotos from '../screens/SignupUserPhotos';
import SignupInterestedInScreen from '../screens/SignupInterestedInScreen';
import SignupShowMeInTheSearchForScreen from '../screens/SignupShowMeInTheSearchForScreen';
import PhoneVerificationScreen from '../screens/PhoneVerificationScreen';

const AuthStackNavigator = createStackNavigator();

const AuthStack = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={TransitionPresets.SlideFromRightIOS}
      headerMode="none"
      // initialRouteName={"SignupUserPhotos"}
    >
      {/* <AuthStackNavigator.Screen name="LoginScreen" component={LoginScreen} /> */}
      {/* <AuthStackNavigator.Screen
        name="PhoneAuthScreen"
        component={PhoneAuthScreen}
        options={TransitionPresets.ModalSlideFromBottomIOS}
      /> */}
      {/* <AuthStackNavigator.Screen
        name="PhoneVerificationScreen"
        component={PhoneVerificationScreen}
      /> */}
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
        name="SignupPasswordScreen"
        component={SignupPasswordScreen}
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
