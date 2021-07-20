/* eslint-disable no-undef */
import {bdToAge} from '../../utils';
import {setErrorMessage} from './error';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {serverKey} from '../../firebase/config';
import {sendNotification} from '../../firebase/utils';
import functions from '@react-native-firebase/functions';
// import {
//   InterstitialAd,
//   TestIds,
//   AdEventType,
// } from '@react-native-firebase/admob';
import {Platform} from 'react-native';
import {setAdOpened, setLoadingAd} from './loading';

export const SET_USER_MATCHING_STATUS = 'SET_USER_MATCHING_STATUS';
export const SET_CHAT_ROOM = 'SET_CHAT_ROOM';
export const REMOVE_CHAT_ROOM = 'REMOVE_CHAT_ROOM';
export const ADD_MESSAGE_IN_CHAT_ROOM = 'ADD_MESSAGE_IN_CHAT_ROOM';
export const SET_FOF_CUE_CARDS = 'SET_FOF_CUE_CARDS';
export const SET_IS_FOF_ONLINE = 'SET_IS_FOF_ONLINE';
export const SET_IS_FOF_TYPING = 'SET_IS_FOF_TYPING';
export const SET_CAN_LOAD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM =
  'SET_CAN_LOAD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM';
export const ADD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM =
  'ADD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM';
export const SET_LISTENING_FOR_ANONYMOUS_CHAT_ROOM =
  'SET_LISTENING_FOR_ANONYMOUS_CHAT_ROOM';
export const ASIA_SOUTH1 = 'asia-south1';

export const listenForUserMatchingStatus = () => {
  return (dispatch, getState) => {
    const {listeningForUserMatchingStatus} = getState().matching;
    if (listeningForUserMatchingStatus) return; //listener is already on
    const {uid} = auth().currentUser;
    const db = database();
    db.ref(`/matchingStatus`)
      .child(uid)
      .on('value', snapshot => {
        dispatch({
          type: SET_USER_MATCHING_STATUS,
          payload: snapshot.val(),
        });
      });
  };
};

export const changeUserMatchingStatus = newStatus => {
  return async (dispatch, getState) => {
    const matchingState = getState().matching;
    try {
      const userState = getState().user;
      const adOpened = getState().loading.adOpened;
      const {uid} = auth().currentUser;
      const db = database();
      const firestoreDb = firestore();

      //Matching off
      if (newStatus === 0) {
        //Remove from waiting list
        await firestoreDb.collection('waitingUsers').doc(uid).delete();
        dispatch(skipThisFOF());
        await db.ref('/matchingStatus').child(uid).set(0);
      }

      //Matching on
      if (newStatus === 1) {
        // dispatch(setLoadingAd(true));
        // const adUnitId = __DEV__
        //   ? TestIds.INTERSTITIAL
        //   : Platform.OS === 'android'
        //   ? 'ca-app-pub-6422755385693448/9628631675' //Under Ad Unit Id section of adMob
        //   : 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy';
        // const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
        //   requestNonPersonalizedAdsOnly: true,
        // });
        // interstitial.onAdEvent(async type => {
        //   if (type === AdEventType.LOADED) {
        //     dispatch(setLoadingAd(false));
        //     console.warn('reached for showing ad');
        //     console.warn('asa ' + adOpened);
        //     if (!adOpened) {
        //       await interstitial.show({immersiveModeEnabled: true});
        //       dispatch(setAdOpened(true));
        //     }
        //   }
        //   if (type === AdEventType.CLOSED) {
        //     dispatch(setAdOpened(false));
        //     dispatch(setLoadingAd(false));
        //     await match();
        //   }
        // });
        // if (!adOpened) {
        //   interstitial.load();
        // }
        try {
          const res = await functions()
            .app.functions(ASIA_SOUTH1)
            .httpsCallable('match')();
        } catch (err) {
          dispatch(setErrorMessage(err.message));
          dispatch(changeUserMatchingStatus(0));
        }
      }

      if (newStatus === 2) {
        await db.ref('/matchingStatus').child(uid).set(2);
      }

      if (newStatus === 3) {
        //check if the other user likes you too
        let FOFMatchingStatus = await db
          .ref('/matchingStatus')
          .child(matchingState.FOF.id)
          .once('value');

        FOFMatchingStatus = FOFMatchingStatus.val();
        if (FOFMatchingStatus === 3) {
          //other user likes you too, add to matches
          dispatch(addFOFToMatches());
          return;
        }
        await db.ref('/matchingStatus').child(uid).set(3);
      }
    } catch (err) {
      dispatch(setErrorMessage(err.message));
      dispatch(changeUserMatchingStatus(0)); //set matching back to off
    }
  };
};

export const configureAnonymousChatRoom = () => {
  return async (dispatch, getState) => {
    try {
      const uid = auth().currentUser.uid;
      const db = database();

      let [FOFId, via] = await Promise.all([
        db.ref('/chatRooms').child(uid).once('value'),
        db.ref('/via').child(uid).once('value'),
      ]);

      //Not matched previously
      if (!FOFId.exists()) {
        dispatch(changeUserMatchingStatus(1));
        return;
      }

      //Matched previously
      FOFId = FOFId.val();
      ({id: viaFriendOrStreamId, type: viaType} = via.val());

      //Check if user has been skipped while they were offline
      let FOFPairedWithId = await db
        .ref('/chatRooms')
        .child(FOFId)
        .once('value');
      FOFPairedWithId = FOFPairedWithId.val();
      if (FOFPairedWithId !== uid) {
        dispatch(changeUserMatchingStatus(0));
        return;
      }

      let [
        FOFBd,
        FOFGender,
        FOFNonBinary,
        FOFName,
        FOFDp,
        viaFriendOrStreamName,
      ] = await Promise.all([
        db.ref('/users').child(FOFId).child('bd').once('value'),
        db.ref('/genders').child(FOFId).once('value'),
        db.ref('/nonBinary').child(FOFId).once('value'),
        viaType === 'stream'
          ? db.ref('/users').child(FOFId).child('name').once('value')
          : null,
        viaType === 'stream'
          ? storage().ref(`/profiles/${FOFId}/0`).getDownloadURL()
          : null,
        viaType === 'friend'
          ? db
              .ref('/users')
              .child(viaFriendOrStreamId)
              .child('name')
              .once('value')
          : db
              .ref('/streams')
              .child(viaFriendOrStreamId)
              .child('name')
              .once('value'),
      ]);

      FOFBd = FOFBd.val();
      FOFGender = FOFGender.val();
      FOFNonBinary = FOFNonBinary.val();
      FOFName = FOFName?.val();
      //FOFDp is a string from storage
      viaFriendOrStreamName = viaFriendOrStreamName.val();

      dispatch({
        type: SET_CHAT_ROOM,
        payload: {
          via: {
            name: viaFriendOrStreamName,
            id: viaFriendOrStreamId,
            type: viaType,
          },
          FOF: {
            id: FOFId,
            age: bdToAge(FOFBd),
            gender: FOFGender,
            nonBinary: FOFNonBinary,
            dp: FOFDp,
            name: FOFName,
          },
        },
      });
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
  };
};

export const sendMessageInAnonymousChatRoom = messages => {
  return async (dispatch, getState) => {
    const {FOF} = getState().matching;
    const db = database();
    const {uid} = auth().currentUser;
    const refString = uid < FOF.id ? uid + '@' + FOF.id : FOF.id + '@' + uid;

    let imageUrl = null;
    let promisesArr = [];
    for (var i = 0; i < messages.length; i++) {
      const messageId = messages[i]._id;
      const attachedImage = messages[i].image;

      if (attachedImage) {
        const uploadUri =
          Platform.OS === 'ios'
            ? attachedImage.replace('file://', '')
            : attachedImage;
        const response = await fetch(uploadUri);
        const blob = await response.blob();
        await storage().ref(`/messages/${refString}/${messageId}`).put(blob);
        imageUrl = await storage()
          .ref(`/messages/${refString}/${messageId}`)
          .getDownloadURL();
      }

      promisesArr.push(
        db
          .ref('/messages')
          .child(refString)
          .child(messageId)
          .set({
            ...messages[i],
            _id: null,
            createdAt: database.ServerValue.TIMESTAMP,
            image: imageUrl,
          }),
      );
    }
    await Promise.all(promisesArr);
    await sendNotification(
      FOF.id,
      'Someone just texted you 💞',
      messages[0].text,
    );
  };
};

export const paginateMessagesInAnonymousChatRoomQuery = () => {
  return async (dispatch, getState) => {
    const {FOF, messages} = getState().matching;
    const db = database();
    const {uid} = auth().currentUser;
    const refString = uid < FOF.id ? uid + '@' + FOF.id : FOF.id + '@' + uid;

    let dbQuery = db
      .ref('/messages')
      .child(refString)
      .orderByChild('createdAt');

    if (messages?.length > 0) {
      dbQuery = dbQuery.endAt(messages[messages.length - 1].createdAt);
    }

    dbQuery.limitToLast(40).once('value', snapshot => {
      let olderMessagesVals = [];

      snapshot.forEach(child => {
        olderMessagesVals.unshift({...child.val(), _id: child.key});
      });

      //All the chats have been fetched
      if (olderMessagesVals.length < 40)
        dispatch({
          type: SET_CAN_LOAD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM,
          payload: false,
        });
      else
        dispatch({
          type: SET_CAN_LOAD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM,
          payload: true,
        });

      olderMessagesVals.shift();

      dispatch({
        type: ADD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM,
        payload: olderMessagesVals,
      });
    });
  };
};

export const startListeningForAnonymousChatRoom = () => {
  return async (dispatch, getState) => {
    const matchingState = getState().matching;
    const {FOF} = matchingState;

    if (FOF === null) return;

    const uid = auth().currentUser.uid;
    const db = database();

    //listen for chat room pairing (in case the other person is not in the chat room OR skips)
    db.ref('/chatRooms')
      .child(FOF.id)
      .on('value', snapshot => {
        //user has been skipped
        if (snapshot.val() !== uid) {
          dispatch(skipThisFOF());
        }
      });

    //listen for chat messages
    const refString = uid < FOF.id ? uid + '@' + FOF.id : FOF.id + '@' + uid;
    db.ref('/messages')
      .child(refString)
      .orderByChild('createdAt')
      .limitToLast(1)
      .on('child_added', snapshot => {
        if (!snapshot.exists()) return;
        dispatch({
          type: ADD_MESSAGE_IN_CHAT_ROOM,
          payload: {...snapshot.val(), _id: snapshot.key},
        });
      });

    //Listen for online presence
    db.ref('/isOnline')
      .child(FOF.id)
      .on('value', snapshot => {
        if (snapshot.exists())
          dispatch({type: SET_IS_FOF_ONLINE, payload: true});
        else dispatch({type: SET_IS_FOF_ONLINE, payload: false});
      });

    //listen if FOF is typing
    db.ref('/isTyping')
      .child(refString)
      .child(FOF.id)
      .on('value', snapshot => {
        if (snapshot.exists()) {
          dispatch({type: SET_IS_FOF_TYPING, payload: true});
        } else dispatch({type: SET_IS_FOF_TYPING, payload: false});
      });

    dispatch({type: SET_LISTENING_FOR_ANONYMOUS_CHAT_ROOM, payload: true});
  };
};

export const skipThisFOF = (keepChats = false) => {
  return async (dispatch, getState) => {
    const uid = auth().currentUser.uid;
    const db = database();
    const matchingState = getState().matching;
    const {FOF} = matchingState;

    //User was skipped when they were offline
    if (!FOF) {
      await db.ref('/chatRooms').child(uid).remove();
      return;
    }

    //check if FOF is in matches
    let FOFInMatches = await db
      .ref('/matches')
      .child(uid)
      .child(FOF.id)
      .once('value');
    if (FOFInMatches.exists()) keepChats = true;

    //delete chats
    if (!keepChats) {
      const refString = uid < FOF.id ? uid + '@' + FOF.id : FOF.id + '@' + uid;
      await db.ref('/messages').child(refString).remove();
      try {
        await storage().ref('/messages').child(refString).delete();
      } catch (err) {
        if (err.code !== 'storage/object-not-found')
          dispatch(setErrorMessage(err.message));
      }
    }

    db.ref('/chatRooms').child(FOF.id).off();
    db.ref('/matchingStatus').child(FOF.id).off();
    const refString = uid < FOF.id ? uid + '@' + FOF.id : FOF.id + '@' + uid;
    db.ref('/messages').child(refString).off();
    db.ref('/isOnline').child(FOF.id).off();
    db.ref('/isTyping').child(FOF.id).off();

    await Promise.all([
      db.ref('/chatRooms').child(uid).remove(),
      db.ref('/via').child(uid).remove(),
    ]);

    if (keepChats) {
      await sendNotification(
        FOF.id,
        "It's a perfect match! 😍",
        'Press to check who it is!',
      );
    } else {
      await sendNotification(FOF.id, 'Woops! 😳', 'Someone just skipped you');
    }

    dispatch({type: REMOVE_CHAT_ROOM});
    dispatch({type: SET_LISTENING_FOR_ANONYMOUS_CHAT_ROOM, payload: false});
  };
};

export const addFOFToMatches = () => {
  return async (dispatch, getState) => {
    const {FOF} = getState().matching;
    const uid = auth().currentUser.uid;
    const db = database();
    const refString = uid < FOF.id ? uid + '@' + FOF.id : FOF.id + '@' + uid;

    let lastMessage = await db
      .ref('/messages')
      .child(refString)
      .orderByChild('createdAt')
      .limitToLast(1)
      .once('value');

    lastMessage = lastMessage.val()?.text;

    await Promise.all([
      db
        .ref('/matches')
        .child(uid)
        .child(FOF.id)
        .set({
          lastUpdate: database.ServerValue.TIMESTAMP,
          lastMessage: lastMessage ?? null,
        }),
      db
        .ref('/matches')
        .child(FOF.id)
        .child(uid)
        .set({
          lastUpdate: database.ServerValue.TIMESTAMP,
          lastMessage: lastMessage ?? null,
        }),
    ]);

    //update user matches stat
    const userMatchesStatRef = db.ref('/stats').child(uid).child('matches');
    userMatchesStatRef.transaction(currentMatches => {
      if (currentMatches == null) return 1;
      return currentMatches + 1;
    });

    //update match matches stat
    const matchMatchesStatRef = db.ref('/stats').child(FOF.id).child('matches');
    matchMatchesStatRef.transaction(currentMatches => {
      if (currentMatches == null) return 1;
      return currentMatches + 1;
    });

    dispatch(skipThisFOF(true));
  };
};

export const fetchFOFCueCards = () => {
  return async (dispatch, getState) => {
    const FOF = getState().matching.FOF;
    const firestoreDb = firestore();
    const {uid} = auth().currentUser;
    const cueCardsRef = firestoreDb.collection('cueCards').doc(FOF.id);
    const cards = await cueCardsRef.get();
    dispatch({
      type: SET_FOF_CUE_CARDS,
      payload: Object.values(cards.data() || {}),
    });
  };
};
