import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../styles';
import SignupStack from './SignupStack';
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
import {checkVersion} from 'react-native-check-version';
import NeedsUpdateScreen from '../screens/NeedsUpdateScreen';
import {getFacebookUid} from '../utils';
import {db} from '../firebase/util';

const AppNavigator = () => {
  const userState = useSelector(state => state.user);
  const {isAuthenticated, isProfileCompleted} = userState;
  const [initialAppLoading, setInitialAppLoading] = useState(true);
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [needsUpdateScreenProps, setNeedsUpdateScreenProps] = useState(null);
  const loadingState = useSelector(state => state.loading);
  const {appLoading} = loadingState;
  const {errorMessage} = useSelector(state => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkForUpdate = async () => {
      const version = await checkVersion({country: 'india'});
      if (version.needsUpdate) {
        setUpdateNeeded(true);
        setNeedsUpdateScreenProps({
          latestVersion: version.version,
          url: version.url,
        });
      }
    };
    checkForUpdate();
  }, [updateNeeded, dispatch]);

  useEffect(() => {
    console.log('Shaurya');
    auth().onAuthStateChanged(user => {
      console.log('Damn son', user);
      if (user) {
        if (getFacebookUid(user) !== null) {
          db.ref('/facebookUids/' + getFacebookUid(user)).set(user.uid);
        }
        dispatch(startAppLoading());
        dispatch(setUserState({...userState, isAuthenticated: true}));
      } else dispatch(clearUserState());
    });
  }, []);

  useEffect(() => {
    //Check whether user profile is completed or not
    const checkIfProfileIsComplete = async () => {
      dispatch(startAppLoading());
      const uid = auth().currentUser.uid;
      if (isAuthenticated) {
        const name = await db
          .ref('/users/' + uid)
          .child('name')
          .once('value');
        console.log('SUDA', name.val());
        if (name.exists())
          dispatch(setUserState({...userState, isProfileCompleted: true}));
        else dispatch(setUserState({...userState, isProfileCompleted: false}));
      }
      if (initialAppLoading) setInitialAppLoading(false);
      dispatch(stopAppLoading());
    };
    checkIfProfileIsComplete();
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('DADADDA', isAuthenticated, isProfileCompleted);
  }, [isAuthenticated, isProfileCompleted]);

  if (initialAppLoading) return <LoadingScreen />;

  return (
    <View style={styles.rootView}>
      {/* update needed */}
      <ReactNativeModal
        backdropTransitionOutTiming={0}
        useNativeDriver={true}
        style={{margin: 0}}
        isVisible={updateNeeded}>
        <NeedsUpdateScreen {...needsUpdateScreenProps} />
      </ReactNativeModal>

      {/* loading screen */}
      <ReactNativeModal
        backdropTransitionOutTiming={0}
        useNativeDriver={true}
        style={{margin: 0}}
        isVisible={appLoading}>
        <LoadingScreen />
      </ReactNativeModal>

      {/* error screen */}
      <ReactNativeModal
        backdropTransitionOutTiming={0}
        useNativeDriver={true}
        style={{margin: 0}}
        isVisible={errorMessage === null ? false : true}>
        <ErrorScreen />
      </ReactNativeModal>

      {isAuthenticated ? (
        isProfileCompleted ? (
          <MainAppBottomTab />
        ) : (
          <SignupStack />
        )
      ) : (
        <PhoneAuthStack />
      )}
    </View>
  );
};

export default AppNavigator;
