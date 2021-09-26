import {bdToAge} from '../utils';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {Platform} from 'react-native';
import {serverKey} from './config';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import {ASIA_SOUTH1} from '../store/actions/matching';

//Relation states, No relation resolves to null
export const relations = {
  USER_RECEIVED_REQUEST: 'USER_RECEIVED_REQUEST',
  USER_SENT_REQUEST: 'USER_SENT_REQUEST',
  FRIENDS: 'FRIENDS',
  NONE: null,
};

export const isUsernameValid = async username => {
  const db = database();
  const snapshot = await db.ref('/usernames').child(username).once('value');
  if (snapshot.val() === null) return true;
  return false;
};

export const uploadUserPhotos = async userPhotos => {
  //Upload user photos in parallel
  const uid = auth().currentUser.uid;
  await Promise.all(
    userPhotos.map(async (item, index) => {
      //delete the image on this index
      if (!item) {
        return;
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
};

export const searchFriendByUsername = async username => {
  const db = database();
  const friendId = await db.ref('/usernames').child(username).once('value');
  if (!friendId) return null;
  const [name, dp] = await Promise.all(
    db.ref('/users').child('name').once('value'),
    storage().ref(`/profiles/${friendId}/0`).getDownloadURL(),
  );
  return {id: friendId, name: name.val(), dp};
};

export const checkRelation = async (userId, targetUserId) => {
  //check if the person is in your requests
  const db = database();
  let isPersonInMyRequests = (
    await db
      .ref('/requests')
      .child(userId)
      .orderByValue()
      .equalTo(targetUserId)
      .limitToFirst(1)
      .once('value')
  ).exists();

  if (isPersonInMyRequests) {
    return relations.USER_RECEIVED_REQUEST;
  }
  //check if you have sent the person a request
  let sentRequest = (
    await db
      .ref('/requests')
      .child(targetUserId)
      .orderByValue()
      .equalTo(userId)
      .limitToFirst(1)
      .once('value')
  ).exists();
  if (sentRequest) {
    return relations.USER_SENT_REQUEST;
  }
  //check if you are already friends
  const isFriend = (
    await db.ref('/friends').child(userId).child(targetUserId).once('value')
  ).exists();
  if (isFriend) {
    return relations.FRIENDS;
  }
  return relations.NONE;
};

export const searchFriendsByNameOrUsername = async (
  nameOrUsername,
  numOfResults,
) => {
  let friends = [];
  const db = database();

  //search by username
  let lowerCaseUsername =
    nameOrUsername.charAt(0).toLowerCase() + nameOrUsername.slice(1); //first char lower case
  let friendIdByUsername = await db
    .ref('/usernames')
    .child(lowerCaseUsername)
    .once('value');
  friendIdByUsername = friendIdByUsername.val();

  if (friendIdByUsername && friendIdByUsername !== auth().currentUser.uid) {
    numOfResults--; //query one user less by name
    let [name, dp, bd] = await Promise.all([
      db.ref('/users').child(friendIdByUsername).child('name').once('value'),

      storage()
        .ref('/profiles')
        .child(friendIdByUsername)
        .child('0')
        .getDownloadURL(),
      db.ref('/users').child(friendIdByUsername).child('bd').once('value'),
    ]);

    friends.push({
      name: name.val(),
      dp,
      age: bdToAge(bd.val()),
      id: friendIdByUsername,
      username: lowerCaseUsername,
    });
  }

  //Search by name
  const firstName =
    nameOrUsername.charAt(0).toUpperCase() + nameOrUsername.slice(1); //capitalized first letter
  const searchByNameQuery = db
    .ref('/users')
    .orderByChild('name')
    .equalTo(firstName)
    .limitToFirst(numOfResults);
  let usersByName = await searchByNameQuery.once('value');
  usersByName = usersByName.val(); //returns Object of Objects

  if (usersByName) {
    delete usersByName[auth().currentUser.uid];
    //remove the result which has already been pushed in friends
    if (friends.length !== 0) {
      delete usersByName[friends[0].id];
    }

    //converting to array of objects
    let keys = Object.keys(usersByName);

    for (var i = 0; i < keys.length; i++) {
      friends.push(await fetchNameAgeUsernameDpById(keys[i]));
    }
  }
  if (friends.length === 0) return null;
  return friends;
};

export const sendFriendRequest = async receiverId => {
  const db = database();
  const {uid} = auth().currentUser;
  await db
    .ref('/requests')
    .child(receiverId)
    .child(uid)
    .set(database.ServerValue.TIMESTAMP);
};

export const fetchNameAgeUsernameDpById = async id => {
  const db = database();
  const [name, bd, username, dp] = await Promise.all([
    db.ref('/users').child(id).child('name').once('value'),
    db.ref('/users').child(id).child('bd').once('value'),
    db
      .ref('/usernames')
      .orderByValue()
      .equalTo(id)
      .limitToFirst(1)
      .once('value'),
    storage().ref('/profiles').child(id).child('0').getDownloadURL(),
  ]);
  return {
    id,
    name: name.val(),
    age: bdToAge(bd.val()),
    username: Object.keys(username.val())[0],
    dp,
  };
};

export const declineRequest = async rejectedUserId => {
  const {uid} = auth().currentUser;
  const db = database();
  await db.ref('/requests').child(uid).child(rejectedUserId).remove();
};

export const unfriend = async unfriendId => {
  const {uid} = auth().currentUser;
  const db = database();

  await Promise.all([
    db.ref('/friends').child(uid).child(unfriendId).remove(),
    db.ref('/friends').child(unfriendId).child(uid).remove(),
  ]);
};

export const unmatch = async unmatchId => {
  const {uid} = auth().currentUser;
  const db = database();
  const refString =
    uid < unmatchId ? uid + '@' + unmatchId : unmatchId + '@' + uid;
  await Promise.all([
    db.ref('/matches').child(uid).child(unmatchId).remove(),
    db.ref('/matches').child(unmatchId).child(uid).remove(),
    db.ref('/messages').child(refString).remove(),
  ]);
  try {
    const instance = functions()
      .app.functions(ASIA_SOUTH1)
      .httpsCallable('deleteFilesInStorage');
    await instance({prefix: `messages/${refString}/`});
  } catch (err) {
    //Prevent unhandled promise rejection
  }
};

export const setUserIsTyping = async (chatPartnerId, userIsTyping) => {
  const db = database();
  const {uid} = auth().currentUser;
  const refString =
    uid < chatPartnerId ? uid + '@' + chatPartnerId : chatPartnerId + '@' + uid;
  if (userIsTyping) {
    await db
      .ref('/isTyping')
      .child(refString)
      .child(uid)
      .onDisconnect()
      .remove();
    db.ref('/isTyping').child(refString).child(uid).set(true);
  } else db.ref('/isTyping').child(refString).child(uid).remove();
};

export const joinStream = async streamId => {
  const db = database();
  const uid = auth().currentUser.uid;

  await db.ref('/streamsubs').child(uid).child(streamId).set('true');

  await db
    .ref('/streams')
    .child(streamId)
    .child('members')
    .transaction(currentMembers => {
      if (currentMembers === null) return 1;
      else return currentMembers + 1;
    });
};

export const leaveStream = async streamId => {
  const db = database();
  const uid = auth().currentUser.uid;

  await db.ref('/streamsubs').child(uid).child(streamId).remove();
  await db
    .ref('/streams')
    .child(streamId)
    .child('members')
    .transaction(currentMembers => {
      if (currentMembers === null) return 0;
      else return currentMembers - 1;
    });
};
