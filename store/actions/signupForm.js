import {Platform} from 'react-native';
import {isUsernameValid, uploadUserPhotos} from '../../firebase/util';
import {setErrorMessage} from './error';
import {setSigningUp, startAppLoading, stopAppLoading} from './loading';
import {loginUser, setUserState} from './user';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export const SET_FORM_DATA = 'SET_FORM_DATA';
export const CLEAR_FORM_DATA = 'CLEAR_FORM_DATA';
export const setSignupFormData = data => {
  return {
    type: SET_FORM_DATA,
    payload: data,
  };
};

export const clearSignupFormData = data => {
  return {
    type: CLEAR_FORM_DATA,
  };
};

export const signupUser = () => {
  return async (dispatch, getState) => {
    dispatch(startAppLoading());
    dispatch(setSigningUp(true));
    const {
      phoneNumber,
      name,
      birthDate,
      username,
      gender,
      password,
      userPhotos,
      interestedIn,
      nonBinary,
    } = getState().signupForm;
    const userState = getState().user;
    try {
      //Firebase auth state will change

      const {uid} = auth().currentUser;
      const db = database();

      //Setting array for tokens (notifications)
      if (!isUsernameValid(username))
        throw {
          msg: 'There was an error while signing up, please try again',
        };

      //Upload files in parallel
      await uploadUserPhotos(userPhotos);

      //object in users
      const bdInInt = new Date(
        `${birthDate.mm}/${birthDate.dd}/${birthDate.yyyy}`,
      ).getTime();
      await db.ref('/users').child(uid).set({
        name: name.trim(),
        bd: bdInInt,
      });

      // object in usernames
      await db.ref('/usernames').child(username).set(uid);

      //object in genders
      await db.ref('/genders').child(uid).set(gender);

      //object in non-binary
      if (nonBinary && nonBinary !== null)
        await db.ref('/nonBinary').child(uid).set(nonBinary);

      //object in interestedIn
      await db.ref('/interestedIn').child(uid).set(interestedIn);

      //matching status
      await db.ref('/matchingStatus').child(uid).set(0);

      await db.ref('/stats').child(uid).set({friends: 0, matches: 0});

      dispatch(clearSignupFormData());
      dispatch(setUserState({...userState, isProfileCompleted: true}));
    } catch (err) {
      dispatch(setErrorMessage(err));
      const uid = auth()?.currentUser?.uid;
      if (uid) {
        auth().currentUser.delete();
        auth().signOut();
        storage().ref(`/profiles/${uid}`).delete();
      }
    }
    dispatch(stopAppLoading());
    dispatch(setSigningUp(false));
  };
};
