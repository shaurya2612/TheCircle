import {bdToAge} from '../../utils';
import {setErrorMessage} from './error';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {serverKey} from '../../firebase/config';
import {sendNotification} from '../../firebase/utils';

export const SET_USER_MATCHING_STATUS = 'SET_USER_MATCHING_STATUS';
export const SET_CHAT_ROOM = 'SET_CHAT_ROOM';
export const REMOVE_CHAT_ROOM = 'REMOVE_CHAT_ROOM';
export const ADD_MESSAGE_IN_CHAT_ROOM = 'ADD_MESSAGE_IN_CHAT_ROOM';
export const SET_FOF_CUE_CARDS = 'SET_FOF_CUE_CARDS';
export const SET_IS_FOF_ONLINE = 'SET_IS_FOF_ONLINE';
export const SET_IS_FOF_TYPING = 'SET_IS_FOF_TYPING';

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
        await db.ref('/matchingStatus').child(uid).set(1);

        let chosenFOF = null; //FOF chosen
        let foundFOF = false; //is FOF found or not (since chosenFOF !== null is not a sufficient condition)
        let viaFriendId = null; //Friend via which final fof is chosen

        //pick a random friend
        const friendsSnapshot = await db
          .ref('/friends')
          .child(uid)
          .once('value'); //**** potentially heavy data downloaded ****

        if (!friendsSnapshot.exists()) {
          //user does not have friends yet
          dispatch(setErrorMessage('Please add at friends first !'));
          dispatch(changeUserMatchingStatus(0));
          return;
        }

        let friendsIds = Object.keys(friendsSnapshot.val());
        let copyOfFriendsIds = Object.keys(friendsSnapshot.val()); // for later use during adding users name in every friends waitingList

        while (friendsIds.length > 0) {
          //select a random friend from friendsIds array
          const randomFriendIndex = Math.floor(
            Math.random() * friendsIds.length,
          );

          const chosenFriendId = friendsIds[randomFriendIndex];

          //Query in firestore to find a potential match

          //if user is interested in everyone
          if (userState.interestedIn === 'Everyone') {
            chosenFOF = await firestoreDb
              .collection(`waitingUsers`)
              .where('friends', 'array-contains', chosenFriendId)
              .where('interestedIn', 'in', [userState.gender, 'Everyone'])
              .orderBy('timestamp', 'asc')
              .limit(1)
              .get();
          } else {
            chosenFOF = await firestoreDb
              .collection(`waitingUsers`)
              .where('friends', 'array-contains', chosenFriendId)
              .where('gender', '==', userState.interestedIn)
              .where('interestedIn', 'in', [userState.gender, 'Everyone'])
              .orderBy('timestamp', 'asc')
              .limit(1)
              .get();
          }
          if (chosenFOF.empty) {
            friendsIds.splice(randomFriendIndex, 1);
            continue;
          } else {
            //check if the chosen fof is in your matches
            let matchesRes = await db
              .ref('/matches')
              .child(uid)
              .child(chosenFOF.docs[0].id)
              .once('value');
            if (matchesRes.exists()) {
              friendsIds.splice(randomFriendIndex, 1);
              continue;
            }
            //check if the chosen fof is in your friends
            let friendsRes = await db
              .ref('/friends')
              .child(uid)
              .child(chosenFOF.docs[0].id)
              .once('value');
            if (friendsRes.exists()) {
              friendsIds.splice(randomFriendIndex, 1);
              continue;
            }

            //change the data structure of chosenFOF to {id, gender, timestamp, interestedIn}
            chosenFOF = {
              ...chosenFOF.docs[0].data(),
              id: chosenFOF.docs[0].id,
            };
            foundFOF = true;
            viaFriendId = chosenFriendId;
            break;
          }
        }

        if (foundFOF) {
          //make an anonymous chat room with the chosenFOF and change the matching status
          console.log('trying to make anonymous chat room');
          //delete the doc of the selected FOF from all their friends' waiting lists
          await firestoreDb
            .collection('waitingUsers')
            .doc(chosenFOF.id)
            .delete();

          //Add in chat rooms
          await Promise.all([
            db.ref('/chatRooms').child(uid).set(chosenFOF.id),
            db.ref('/chatRooms').child(chosenFOF.id).set(uid),
          ]);

          //Add in viaFriend
          await Promise.all([
            db.ref('/viaFriend').child(uid).set(viaFriendId),
            db.ref('/viaFriend').child(chosenFOF.id).set(viaFriendId),
          ]);

          //get the name of via friend
          let viaFriendName = await db
            .ref('/users')
            .child(viaFriendId)
            .child('name')
            .once('value');
          viaFriendName = viaFriendName.val();

          //get the age of FOF
          let FOFbd = await db
            .ref('/users')
            .child(chosenFOF.id)
            .child('bd')
            .once('value');
          FOFbd = FOFbd.val();

          chosenFOF['age'] = bdToAge(FOFbd);

          //check the nonbinary (if that's the case)
          let FOFNonBinary = await db
            .ref('/nonBinary')
            .child(chosenFOF.id)
            .once('value');

          if (FOFNonBinary.exists()) {
            FOFNonBinary = FOFNonBinary.val();
            chosenFOF['nonBinary'] = FOFNonBinary;
          }

          dispatch({
            type: SET_CHAT_ROOM,
            payload: {
              viaFriend: {name: viaFriendName, id: viaFriendId},
              FOF: chosenFOF,
            },
          });

          //change Matching Status of both the users
          await Promise.all([
            db.ref('/matchingStatus').child(uid).set(2),
            db.ref('/matchingStatus').child(chosenFOF.id).set(2),
          ]);
        } else {
          //push current user to waiting users
          await firestoreDb.collection(`waitingUsers`).doc(uid).set({
            gender: userState.gender,
            interestedIn: userState.interestedIn,
            timestamp: firestore.FieldValue.serverTimestamp(),
            friends: copyOfFriendsIds,
          });
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
      console.log(err.message);
      dispatch(setErrorMessage(err.message));
      dispatch(changeUserMatchingStatus(0)); //set matching back to off
    }
  };
};

export const configureAnonymousChatRoom = () => {
  return async (dispatch, getState) => {
    const uid = auth().currentUser.uid;
    const db = database();

    let [FOFId, viaFriendId] = await Promise.all([
      db.ref('/chatRooms').child(uid).once('value'),
      db.ref('/viaFriend').child(uid).once('value'),
    ]);

    //When matched
    if (!FOFId.exists()) {
      dispatch(changeUserMatchingStatus(1));
      return;
    }
    FOFId = FOFId.val();
    viaFriendId = viaFriendId.val();

    let [FOFBd, FOFGender, FOFNonBinary, viaFriendName] = await Promise.all([
      db.ref('/users').child(FOFId).child('bd').once('value'),
      db.ref('/genders').child(FOFId).once('value'),
      db.ref('/nonBinary').child(FOFId).once('value'),
      db.ref('/users').child(viaFriendId).child('name').once('value'),
    ]);

    FOFBd = FOFBd.val();
    FOFGender = FOFGender.val();
    FOFNonBinary = FOFNonBinary.val();
    viaFriendName = viaFriendName.val();

    dispatch({
      type: SET_CHAT_ROOM,
      payload: {
        viaFriend: {name: viaFriendName, id: viaFriendId},
        FOF: {
          id: FOFId,
          age: bdToAge(FOFBd),
          gender: FOFGender,
          nonBinary: FOFNonBinary,
        },
      },
    });
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
    let tokens = await firestore().collection('tokens').doc(FOF.id).get();
    if (!tokens.exists) return;
    tokens = tokens.data().tokens;
    for (var i = 0; i < tokens.length; i++) {
      await sendNotification(
        tokens[i],
        'Your FOF just texted you',
        messages[0].text,
      );
    }
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
      .limitToFirst(100)
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
  };
};

export const skipThisFOF = (keepChats = false) => {
  return async (dispatch, getState) => {
    const uid = auth().currentUser.uid;
    const db = database();
    const matchingState = getState().matching;
    const {FOF} = matchingState;

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
      db.ref('/viaFriend').child(uid).remove(),
    ]);
    dispatch({type: REMOVE_CHAT_ROOM});
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
