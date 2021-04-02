import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../styles';
import AuthStack from './AuthStack';
import MainAppBottomTab from './MainAppBottomTab';
import LoadingScreen from '../screens/LoadingScreen';
import ErrorScreen from '../screens/ErrorScreen';
import {
  clearUserState,
  fetchUserData,
  setUserState,
} from '../store/actions/user';
import {startAppLoading, stopAppLoading} from '../store/actions/loading';
import auth from '@react-native-firebase/auth';
import {PhoneAuthStack} from './PhoneAuthStack';
import database from '@react-native-firebase/database';

const AppNavigator = () => {
  const userState = useSelector(state => state.user);
  const {isAuthenticated, isProfileCompleted} = userState;
  const loadingState = useSelector(state => state.loading);
  const {appLoading} = loadingState;
  const {errorMessage} = useSelector(state => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(startAppLoading());
        dispatch(setUserState({...userState, isAuthenticated: true}));
      } else dispatch(clearUserState());
    });
  }, []);

  useEffect(() => {
    //Check whether user profile is completed or not
    const fn = async () => {
      if (isAuthenticated) {
        dispatch(startAppLoading());
        const name = await database()
          .ref('/users/' + auth().currentUser.uid)
          .child('name')
          .once('value');
        if (name.exists())
          dispatch(setUserState({...userState, isProfileCompleted: true}));
        else dispatch(setUserState({...userState, isProfileCompleted: false}));
        dispatch(stopAppLoading());
      }
    };
    fn();
  }, [isAuthenticated]);

  return (
    <View style={styles.rootView}>
      {/* loading screen */}
      <ReactNativeModal
        backdropTransitionOutTiming={0}
        style={{margin: 0}}
        isVisible={appLoading}>
        <LoadingScreen />
      </ReactNativeModal>

      {/* error screen */}
      <ReactNativeModal
        backdropTransitionOutTiming={0}
        style={{margin: 0}}
        isVisible={errorMessage === null ? false : true}>
        <ErrorScreen />
      </ReactNativeModal>

      {isAuthenticated ? (
        isProfileCompleted ? (
          <MainAppBottomTab />
        ) : (
          <AuthStack />
        )
      ) : (
        <PhoneAuthStack />
      )}
    </View>
  );
};

export default AppNavigator;
