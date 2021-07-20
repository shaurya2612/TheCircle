import {
  declineRequest,
  fetchNameAgeUsernameDpById,
  leaveStream,
  unfriend,
  unmatch,
  uploadUserPhotos,
} from '../../firebase/utils';
import {bdToAge, CLEAR_REDUX_STATE} from '../../utils';
import {setErrorMessage} from './error';
import {startAppLoading, stopAppLoading} from './loading';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {ASIA_SOUTH1, changeUserMatchingStatus, skipThisFOF} from './matching';
import {Alert} from 'react-native';
import functions from '@react-native-firebase/functions';

export const SET_USER_STATE = 'SET_USER_STATE';
export const CLEAR_USER_STATE = 'CLEAR_USER_STATE';
export const SET_USER_PHOTOS = 'SET_USER_PHOTOS';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const UPDATE_ABOUT = 'UPDATE_ABOUT';
export const SET_DP = 'SET_DP';
export const SET_USER = 'SET_USER';
export const SET_USER_STATS = 'SET_USER_STATS';
export const SET_CUE_CARDS = 'SET_CUE_CARDS';
export const ADD_CUE_CARD = 'ADD_CUE_CARD';
export const UPDATE_CUE_CARD = 'UPDATE_CUE_CARD';
export const REMOVE_CUE_CARD = 'REMOVE_CUE_CARD';
export const UPDATE_PROFILE_INFO = 'UPDATE_PROFILE_INFO';
export const UPDATE_INTERESTED_IN = 'UPDATE_INTERESTED_IN';
export const ADD_REQUEST = 'ADD_REQUEST';
export const ADD_MULTIPLE_REQUESTS = 'ADD_MULTIPLE_REQUESTS';
export const ADD_FRIEND = 'ADD_FRIEND';
export const ADD_MATCH = 'ADD_MATCH';
export const REMOVE_MATCH = 'REMOVE_MATCH';
export const UPDATE_MATCH = 'UPDATE_MATCH';
export const REMOVE_FRIEND = 'REMOVE_FRIEND';
export const REMOVE_REQUEST = 'REMOVE_REQUEST';
export const SET_LISTENING_FOR_MATCHES = 'SET_LISTENING_FOR_MATCHES';
export const SET_LISTENING_FOR_FRIENDS = 'SET_LISTENING_FOR_FRIENDS';
export const REMOVE_UNSEEN = 'REMOVE_UNSEEN';
export const SET_FETCHED_MATCH_PROFILE = 'SET_FETCHED_MATCH_PROFILE';
export const SET_CURRENT_MATCH_PROFILE = 'SET_CURRENT_MATCH_PROFILE';
export const SET_CAN_LOAD_MORE_FRIENDS = 'SET_CAN_LOAD_MORE_FRIENDS';
export const SET_CAN_LOAD_MORE_REQUESTS = 'SET_CAN_LOAD_MORE_REQUESTS';

export const setUserState = payload => {
  return {type: SET_USER_STATE, payload};
};

export const clearUserState = () => {
  return {type: CLEAR_USER_STATE};
};

export const fetchUser = () => {
  return async (dispatch, getState) => {
    const userState = getState().user;
    if (userState.name) return;

    try {
      const db = database();
      const uid = auth().currentUser.uid;
      let [
        userObjSnapshot,
        usernameSnapshot,
        genderSnapshot,
        interestedInSnapshot,
      ] = await Promise.all([
        db.ref('/users').child(uid).once('value'),
        db
          .ref('/usernames')
          .orderByValue()
          .equalTo(uid)
          .limitToFirst(1)
          .once('value'),
        db.ref('/genders').child(uid).once('value'),
        db.ref('/interestedIn').child(uid).once('value'),
      ]);
      if (!userObjSnapshot.exists()) {
        dispatch(logoutUser());
        dispatch(setErrorMessage('An error has occured'));
      }
      const obj = {
        ...userObjSnapshot.val(),
        gender: genderSnapshot.val(),
        username: Object.keys(usernameSnapshot.val())[0],
        interestedIn: interestedInSnapshot.val(),
      };
      dispatch({type: SET_USER, payload: obj});

      //Setting dp from storage
      const dp = await storage().ref(`/profiles/${uid}/0`).getDownloadURL();
      dispatch({type: SET_DP, payload: dp});
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
  };
};

export const listenForUserStats = () => {
  return async (dispatch, getState) => {
    const db = database();
    const uid = auth().currentUser.uid;
    db.ref('/stats')
      .child(uid)
      .on('value', snapshot => {
        dispatch({type: SET_USER_STATS, payload: snapshot.val()});
      });
  };
};

export const listenForPresence = () => {
  return async (dispatch, getState) => {
    const db = database();
    const {uid} = auth().currentUser;
    const amOnlineRef = db.ref('.info/connected');
    const isOnlineRef = db.ref('/isOnline').child(uid);
    amOnlineRef.on('value', async snapshot => {
      if (snapshot.val() === false) {
        return;
      }
      await isOnlineRef.onDisconnect().remove();
      isOnlineRef.set(true);
    });
  };
};

export const fetchUserPhotos = () => {
  return async (dispatch, getState) => {
    const userState = getState().user;
    if (userState.userPhotosUpdated) {
      return;
    }
    try {
      const {uid} = auth().currentUser;
      // get an array of refs of all the objects inside the folder
      const result = await storage().ref(`profiles/${uid}`).listAll();

      // get all the download urls of the images in parallel
      const userPhotos = await Promise.all(
        result.items.map(ref => ref.getDownloadURL()),
      );
      while (userPhotos.length !== 6) {
        userPhotos.push(null);
      }
      dispatch({type: SET_USER_PHOTOS, payload: userPhotos});
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
  };
};

export const updateUserPhotos = photos => {
  return async (dispatch, getState) => {
    dispatch(startAppLoading());
    const userState = getState().user;
    try {
      const {uid} = auth().currentUser;
      const currUserPhotos = userState.userPhotos.filter(item => item !== null);

      //Upload files in parallel
      let userPhotos = await Promise.all(
        photos.map(async (item, index) => {
          //delete the image on this index
          if (!item) {
            return null;
          }
          //Create Blob
          const uploadUri =
            Platform.OS === 'ios' ? item.replace('file://', '') : item;
          const response = await fetch(uploadUri);
          const blob = await response.blob();

          //Return Promise
          return storage().ref(`/profiles/${uid}/${index}`).put(blob);
        }),
      );

      //Get download urls in parallel
      userPhotos = await Promise.all(
        userPhotos.map(async (item, index) => {
          if (!item) return null;
          return storage().ref(item.metadata.fullPath).getDownloadURL();
        }),
      );

      const photosToDelete =
        currUserPhotos.length - photos.filter(item => item !== null).length;
      if (photosToDelete > 0) {
        for (
          var i = currUserPhotos.length - 1;
          i > currUserPhotos.length - 1 - photosToDelete;
          i--
        ) {
          await storage().ref(`profiles/${uid}/${i}`).delete();
        }
      }

      if (userPhotos[0] !== currUserPhotos[0])
        dispatch({type: SET_DP, payload: userPhotos[0]});

      dispatch({type: SET_USER_PHOTOS, payload: userPhotos});
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
    dispatch(stopAppLoading());
  };
};

export const fetchUserProfile = () => {
  return async (dispatch, getState) => {
    const userState = getState().user;
    if (userState.profileUpdated) return;
    try {
      const db = database();
      const {uid} = auth().currentUser;
      await db
        .ref('/profiles')
        .child(uid)
        .once('value', snapshot => {
          dispatch({type: SET_USER_PROFILE, payload: snapshot.val()});
        });
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
  };
};

export const updateAbout = about => {
  return async (dispatch, getState) => {
    try {
      const db = database();
      const {uid} = auth().currentUser;
      //About has been removed
      if (about === '' || about === null) {
        await db.ref('/profiles').child(uid).child('about').remove();
      } else {
        await db.ref('/profiles').child(uid).child('about').set(about);
      }
      dispatch({type: UPDATE_ABOUT, payload: about === '' ? null : about});
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
  };
};

export const updateProfileInfo = (key, value) => {
  return async (dispatch, getState) => {
    try {
      const db = database();
      const {uid} = auth().currentUser;
      await db.ref(`/profiles`).child(uid).child('info').child(key).set(value);
      dispatch({type: UPDATE_PROFILE_INFO, key, payload: value});
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
  };
};

export const updateInterestedIn = value => {
  return async dispatch => {
    try {
      const db = database();
      const {uid} = auth().currentUser;
      await db.ref(`/interestedIn`).child(uid).set(value);
      dispatch({type: UPDATE_INTERESTED_IN, payload: value});
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
  };
};

export const addCueCard = ({qid, ans}) => {
  return async (dispatch, getState) => {
    const currentCueCards = getState().user.cueCards;
    const firestoreDb = firestore();
    const {uid} = auth().currentUser;
    const cueCardsRef = firestoreDb.collection('cueCards').doc(uid);
    const index = (currentCueCards || []).length;
    if (
      index >= 6 ||
      currentCueCards.filter(item => item.qid === qid).length > 0
    )
      return;
    let obj = {};
    obj[index] = {qid, ans};
    cueCardsRef.set(obj, {merge: true});
    dispatch({type: ADD_CUE_CARD, payload: {qid, ans}});
  };
};

export const fetchUserCueCards = () => {
  return async (dispatch, getState) => {
    const currentCueCards = getState().user.cueCards;
    if (currentCueCards !== null) return; //cueCardsAlready fetched
    const firestoreDb = firestore();
    const {uid} = auth().currentUser;
    const cueCardsSnapshot = await firestoreDb
      .collection('cueCards')
      .doc(uid)
      .get();
    const cards = Object.values(cueCardsSnapshot.data() || {});
    dispatch({type: SET_CUE_CARDS, payload: cards});
  };
};

export const updateCueCard = (index, newAns) => {
  return async (dispatch, getState) => {
    const firestoreDb = firestore();
    const {uid} = auth().currentUser;
    await firestoreDb
      .collection('cueCards')
      .doc(uid)
      .set({[index]: {ans: newAns}}, {merge: true});
    dispatch({type: UPDATE_CUE_CARD, payload: {index, newAns}});
  };
};

export const removeCueCard = (index, refreshFn) => {
  return async (dispatch, getState) => {
    dispatch({type: REMOVE_CUE_CARD, payload: index});
    let currentCueCards = getState().user.cueCards;
    let obj = {};
    for (var i = 0; i < currentCueCards.length; i++) {
      obj[i] = {...currentCueCards[i]};
    }
    const firestoreDb = firestore();
    const {uid} = auth().currentUser;
    await firestoreDb.collection('cueCards').doc(uid).set(obj);
    refreshFn(currState => !currState);
  };
};

export const listenForRequests = () => {
  return async (dispatch, getState) => {
    const {listeningForRequests} = getState().user;
    if (listeningForRequests) return; //listener is already on --> end the function

    const db = database();
    const {uid} = auth().currentUser;
    const dbRef = db.ref('/requests').child(uid);
    const dbQuery = dbRef.orderByValue();
    dbQuery.on('child_added', async snapshot => {
      if (!snapshot.exists()) return;
      const name = await db
        .ref('/users')
        .child(snapshot.key)
        .child('name')
        .once('value');
      if (!name.exists()) {
        declineRequest(snapshot.key);
        return;
      }

      const [bd, username, dp] = await Promise.all([
        db.ref('/users').child(snapshot.key).child('bd').once('value'),
        db
          .ref('/usernames')
          .orderByValue()
          .equalTo(snapshot.key)
          .limitToFirst(1)
          .once('value'),
        storage()
          .ref('/profiles')
          .child(snapshot.key)
          .child('0')
          .getDownloadURL(),
      ]);
      let obj = {
        id: snapshot.key,
        name: name.val(),
        age: bdToAge(bd.val()),
        username: Object.keys(username.val())[0],
        dp,
        createdAt: snapshot.val(),
      };
      dispatch({
        type: ADD_REQUEST,
        payload: obj,
      });
    });
    dbQuery.on('child_removed', snapshot => {
      if (!snapshot.exists()) return;
      dispatch({type: REMOVE_REQUEST, payload: snapshot.key});
    });
  };
};

export const listenForFriends = () => {
  return async (dispatch, getState) => {
    try {
      const {listeningForFriends} = getState().user;
      if (listeningForFriends) return; //listener is already on --> end the function

      const db = database();
      const {uid} = auth().currentUser;
      const dbRef = db.ref('/friends').child(uid);
      const dbQuery = dbRef.orderByKey();

      dbQuery.on('child_added', async snapshot => {
        if (!snapshot.exists()) {
          return;
        }

        let [name, username, dp] = await Promise.all([
          db.ref('/users').child(snapshot.key).child('name').once('value'),
          db
            .ref('/usernames')
            .orderByValue()
            .equalTo(snapshot.key)
            .limitToFirst(1)
            .once('value'),

          storage()
            .ref('/profiles')
            .child(snapshot.key)
            .child('0')
            .getDownloadURL(),
        ]);
        let obj = {
          name: name.val(),
          username: Object.keys(username.val())[0],
          id: snapshot.key,
          dp,
        };
        dispatch({type: ADD_FRIEND, payload: obj});
        dispatch({type: SET_LISTENING_FOR_FRIENDS, payload: true});
      });
      dbQuery.on('child_removed', snapshot => {
        if (!snapshot.exists()) return;
        dispatch({type: REMOVE_FRIEND, payload: snapshot.key});
      });
      dispatch({type: SET_LISTENING_FOR_FRIENDS, payload: true});
    } catch (err) {
      dispatch(setErrorMessage(err.message));
      const db = database();
      const {uid} = auth().currentUser;
      const dbRef = db.ref('/friends').child(uid);
      const dbQuery = dbRef.orderByKey().limitToFirst(numOfResults);
      dbQuery.off();
      dispatch({type: SET_LISTENING_FOR_FRIENDS, payload: false});
    }
  };
};

export const listenForMatches = numOfResults => {
  return async (dispatch, getState) => {
    try {
      const {listeningForMatches} = getState().user;
      if (listeningForMatches) return; //listener is already on --> end the function

      const db = database();
      const {uid} = auth().currentUser;
      const dbRef = db.ref('/matches').child(uid);
      const dbQuery = dbRef
        .orderByChild('lastUpdate')
        .limitToLast(numOfResults);

      dbQuery.on('child_added', async snapshot => {
        if (!snapshot.exists()) return;

        let [name, dp, unseen] = await Promise.all([
          db.ref('/users').child(snapshot.key).child('name').once('value'),
          storage()
            .ref('/profiles')
            .child(snapshot.key)
            .child('0')
            .getDownloadURL(),
          db.ref('/unseen').child(uid).child(snapshot.key).once('value'),
        ]);

        let obj = {
          name: name.val(),
          id: snapshot.key,
          lastMessage: snapshot.val().lastMessage
            ? snapshot.val().lastMessage
            : null,
          hasPhoto: snapshot.val().hasPhoto ? true : false,
          unseen: unseen.val(),
          dp,
        };

        dispatch({type: ADD_MATCH, payload: obj});
      });

      dbQuery.on('child_removed', snapshot => {
        if (!snapshot.exists()) return;
        dispatch({type: REMOVE_MATCH, payload: snapshot.key});
      });

      dbQuery.on('child_changed', snapshot => {
        if (!snapshot.exists()) return;
        let updateUnseen = false;
        if (getState().chat.match?.id !== snapshot.key) updateUnseen = true;
        dispatch({
          type: UPDATE_MATCH,
          payload: {
            id: snapshot.key,
            lastMessage: snapshot.val().lastMessage ?? null,
            hasPhoto: snapshot.val().hasPhoto ?? null,
            updateUnseen,
          },
        });
      });

      dispatch({type: SET_LISTENING_FOR_MATCHES, payload: true});
    } catch (err) {
      dispatch(setErrorMessage(err.message));
      const db = database();
      const {uid} = auth().currentUser;
      const dbRef = db.ref('/matches').child(uid);
      const dbQuery = dbRef.orderByValue().limitToFirst(numOfResults);
      dbQuery.off();
      dispatch({type: SET_LISTENING_FOR_MATCHES, payload: false});
    }
  };
};

export const acceptRequest = friendId => {
  return async (dispatch, getState) => {
    const {uid} = auth().currentUser;
    const db = database();

    const gender = await db.ref('/genders').child(friendId).once('value');
    if (!gender.exists()) {
      //User is deleted
      return;
    }
    db.ref('/friends').child(uid).child(friendId).set(gender.val());

    //add user in the friends list of accepted friend
    const userState = getState().user;
    db.ref('/friends').child(friendId).child(uid).set(userState.gender);

    db.ref('/requests').child(uid).child(friendId).remove();

    //update user friends stat
    const userFriendsStatRef = db.ref('/stats').child(uid).child('friends');
    userFriendsStatRef.transaction(currentFriends => {
      if (currentFriends == null) return 1;
      return currentFriends + 1;
    });

    //update friends friend stat
    const friendFriendsStatRef = db
      .ref('/stats')
      .child(friendId)
      .child('friends');
    friendFriendsStatRef.transaction(currentFriends => {
      if (currentFriends == null) return 1;
      return currentFriends + 1;
    });
  };
};

export const fetchMatchProfile = matchId => {
  return async (dispatch, getState) => {
    //Already fetched this result
    if (matchId === getState().user.currentMatchProfile?.id) return;

    dispatch({type: SET_FETCHED_MATCH_PROFILE, payload: false});
    const db = database();
    let [name, bd, profile] = await Promise.all([
      db.ref('/users').child(matchId).child('name').once('value'),
      db.ref('/users').child(matchId).child('bd').once('value'),
      db.ref('/profiles').child(matchId).once('value'),
    ]);

    [name, bd, profile] = [name.val(), bd.val(), profile.val()];
    // get an array of refs of all the objects inside the folder
    const result = await storage().ref(`profiles/${matchId}`).listAll();

    // get all the download urls of the images in parallel
    const userPhotos = await Promise.all(
      result.items.map(ref => ref.getDownloadURL()),
    );
    while (userPhotos.length !== 6) {
      userPhotos.push(null);
    }
    dispatch({
      type: SET_CURRENT_MATCH_PROFILE,
      payload: {id: matchId, name, age: bdToAge(bd), profile, userPhotos},
    });
    dispatch({type: SET_FETCHED_MATCH_PROFILE, payload: true});
  };
};

export const logoutUser = () => {
  return async (dispatch, getState) => {
    const matchingState = getState().matching;
    dispatch(startAppLoading());
    try {
      const db = database();
      const uid = auth().currentUser.uid;
      const existingToken = await messaging().getToken();

      //deleting fcm token
      await firestore()
        .collection('tokens')
        .doc(uid)
        .update({
          tokens: firestore.FieldValue.arrayRemove(existingToken),
        });

      await auth().signOut();

      //detach all possible matching status listeners
      db.ref('/matchingStatus').child(uid).off();

      //Stop chat room listeners
      if (matchingState.FOF !== null) {
        let FOF = matchingState.FOF;

        db.ref('/chatRooms').child(FOF.id).off();
        db.ref('/matchingStatus').child(FOF.id).off();
        const refString =
          uid < FOF.id ? uid + '@' + FOF.id : FOF.id + '@' + uid;
        db.ref('/messages').child(refString).off();
        db.ref('/isOnline').child(FOF.id).off();
        db.ref('/isTyping').child(FOF.id).off();
      }

      //Stop match chat listeners
      const chatState = getState().chat;
      const {match} = chatState;

      if (match) {
        const refString =
          uid < match.id ? uid + '@' + match.id : match.id + '@' + uid;
        db.ref('/messages').child(refString).off();
        db.ref('/isOnline').child(match.id).off();
        db.ref('/isTyping').child(refString).child(match.id).off();
      }

      //Stop listening for stats
      db.ref('/stats').child(uid).off();

      //Stop listening for user's presence
      db.ref('.info/connected').off();

      //Stop listening to requests
      db.ref('/requests').child(uid).off();

      //Stop listening to friends
      db.ref('/friends').child(uid).off();

      //Stop listening for matches
      db.ref('/matches').child(uid).off();

      dispatch({type: CLEAR_REDUX_STATE});
    } catch (err) {
      dispatch(setErrorMessage(err));
    }
    dispatch(stopAppLoading());
  };
};

export const deleteUser = () => {
  return async (dispatch, getState) => {
    const matchingState = getState().matching;
    dispatch(startAppLoading());
    try {
      const db = database();
      const uid = auth().currentUser.uid;

      //TURN OFF ALL LISTENERS
      db.ref('/matchingStatus').child(uid).off();

      //Stop chat room listeners
      if (matchingState.FOF !== null) {
        dispatch(skipThisFOF());
        dispatch(changeUserMatchingStatus(0));
      }

      //Stop match chat listeners
      const chatState = getState().chat;
      const {match} = chatState;

      if (match) {
        const refString =
          uid < match.id ? uid + '@' + match.id : match.id + '@' + uid;
        db.ref('/messages').child(refString).off();
        db.ref('/isOnline').child(match.id).off();
        db.ref('/isTyping').child(refString).child(match.id).off();
      }

      //Stop listening for user's presence
      db.ref('.info/connected').off();

      //Stop listening to requests
      db.ref('/requests').child(uid).off();

      //Stop listening to friends
      db.ref('/friends').child(uid).off();

      //Stop listening for matches
      db.ref('/matches').child(uid).off();

      await functions()
        .app.functions(ASIA_SOUTH1)
        .httpsCallable('deleteUser')();

      dispatch({type: CLEAR_REDUX_STATE});
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
    dispatch(stopAppLoading());
    Alert.alert('Your account was deleted');
  };
};
