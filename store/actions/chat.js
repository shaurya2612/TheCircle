import {REMOVE_UNSEEN} from './user';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Platform} from 'react-native';
import functions from '@react-native-firebase/functions';
import {sendFCM} from '../../firebase/util';

export const SET_LISTENING_FOR_CHAT = 'SET_LISTENING_FOR_CHAT';
export const ADD_MESSAGE_IN_CHAT = 'ADD_MESSAGE_IN_CHAT';
export const ADD_EARLIER_MESSAGES_IN_CHAT = 'ADD_EARLIER_MESSAGES_IN_CHAT';
export const ADD_MULTIPLE_MESSAGES_IN_CHAT = 'ADD_MULTIPLE_MESSAGES_IN_CHAT';
export const SET_CAN_LOAD_EARLIER_MESSAGES = 'SET_CAN_LOAD_EARLIER_MESSAGES';
export const SET_MATCH_CUE_CARDS = 'SET_MATCH_CUE_CARDS';
export const CLEAR_CHAT_STATE = 'CLEAR_CHAT_STATE';
export const SET_MATCH = 'SET_MATCH';
export const SET_IS_MATCH_ONLINE = 'SET_IS_MATCH_ONLINE';
export const SET_IS_MATCH_TYPING = 'SET_IS_MATCH_TYPING';

export const setMatch = match => {
  return {type: SET_MATCH, payload: match};
};

export const startListeningForChat = () => {
  return async (dispatch, getState) => {
    const chatState = getState().chat;
    const {match} = chatState;

    if (match === null) return;

    const uid = auth().currentUser.uid;
    const db = database();

    //listen for chat messages
    const refString =
      uid < match.id ? uid + '@' + match.id : match.id + '@' + uid;

    db.ref('/messages')
      .child(refString)
      .orderByChild('createdAt')
      .limitToLast(1)
      .on('child_added', snapshot => {
        if (!snapshot.exists()) return;
        dispatch({
          type: ADD_MESSAGE_IN_CHAT,
          payload: {...snapshot.val(), _id: snapshot.key},
        });
      });
    dispatch({type: SET_LISTENING_FOR_CHAT, payload: true});

    db.ref('/isOnline')
      .child(match.id)
      .on('value', snapshot => {
        if (snapshot.exists())
          dispatch({type: SET_IS_MATCH_ONLINE, payload: true});
        else dispatch({type: SET_IS_MATCH_ONLINE, payload: false});
      });

    db.ref('/isTyping')
      .child(refString)
      .child(match.id)
      .on('value', snapshot => {
        if (snapshot.exists()) {
          dispatch({type: SET_IS_MATCH_TYPING, payload: true});
        } else dispatch({type: SET_IS_MATCH_TYPING, payload: false});
      });
  };
};

export const stopListeningForChat = () => {
  return async (dispatch, getState) => {
    const uid = auth().currentUser.uid;
    const db = database();

    const chatState = getState().chat;
    const {match} = chatState;

    const refString =
      uid < match.id ? uid + '@' + match.id : match.id + '@' + uid;
    db.ref('/messages').child(refString).off();
    db.ref('/isOnline').child(match.id).off();
    db.ref('/isTyping').child(refString).child(match.id).off();
    dispatch({type: SET_LISTENING_FOR_CHAT, payload: false});
  };
};

export const sendMessageToMatch = messages => {
  return async (dispatch, getState) => {
    const {match} = getState().chat;
    const db = database();
    const {uid} = auth().currentUser;
    const refString =
      uid < match.id ? uid + '@' + match.id : match.id + '@' + uid;

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
            createdAt: database.ServerValue.TIMESTAMP,
            image: imageUrl,
          }),
      );
    }

    //Update in user matches
    promisesArr.push(
      db
        .ref('/matches')
        .child(uid)
        .child(match.id)
        .update({
          lastUpdate: database.ServerValue.TIMESTAMP,
          lastMessage: messages[messages.length - 1].text,
          hasPhoto: imageUrl ? true : null,
        }),
    );

    //Update in matches matches
    promisesArr.push(
      db
        .ref('/matches')
        .child(match.id)
        .child(uid)
        .update({
          lastUpdate: database.ServerValue.TIMESTAMP,
          lastMessage: messages[messages.length - 1].text,
          hasPhoto: imageUrl ? true : null,
        }),
    );

    let numOfCurrentUnseenMessages = await db
      .ref('/unseen')
      .child(match.id)
      .child(uid)
      .once('value');

    numOfCurrentUnseenMessages = numOfCurrentUnseenMessages.val();

    promisesArr.push(
      db
        .ref('/unseen')
        .child(match.id)
        .child(uid)
        .set(numOfCurrentUnseenMessages ? numOfCurrentUnseenMessages + 1 : 1),
    );

    await Promise.all(promisesArr);
    try {
      await sendFCM(match.id, {
        notification: {
          title: 'New Message 💬',
          body: 'New message from match',
        },
      });
    } catch (err) {}
  };
};

export const paginateMessagesQuery = () => {
  return async (dispatch, getState) => {
    const {match, messages} = getState().chat;
    const db = database();
    const {uid} = auth().currentUser;
    const refString =
      uid < match.id ? uid + '@' + match.id : match.id + '@' + uid;

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
        dispatch({type: SET_CAN_LOAD_EARLIER_MESSAGES, payload: false});
      else dispatch({type: SET_CAN_LOAD_EARLIER_MESSAGES, payload: true});

      olderMessagesVals.shift();

      dispatch({
        type: ADD_EARLIER_MESSAGES_IN_CHAT,
        payload: olderMessagesVals,
      });
    });
  };
};

export const removeUnseenMessages = () => {
  return async (dispatch, getState) => {
    const db = database();
    const {match} = getState().chat;
    const {uid} = auth().currentUser;
    await db.ref('/unseen').child(uid).child(match.id).remove();
    dispatch({type: REMOVE_UNSEEN, payload: match.id});
  };
};

export const fetchMatchCueCards = () => {
  return async (dispatch, getState) => {
    const match = getState().chat.match;
    const firestoreDb = firestore();
    const cueCardsRef = firestoreDb.collection('cueCards').doc(match.id);
    let cards = await cueCardsRef.get();
    dispatch({
      type: SET_MATCH_CUE_CARDS,
      payload: Object.values(cards.data() || {}),
    });
  };
};
