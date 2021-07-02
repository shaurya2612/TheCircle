const functions = require('firebase-functions');

// The Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp();
const ASIA_SOUTH1 = 'asia-south1';

/**
 *matches a user with a potential match
 * @returns {Object} Object having via and FOF fields
 */
exports.match = functions
  .region(ASIA_SOUTH1)
  .https.onCall(async (data, context) => {
    //User is not authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.',
      );
    }

    const uid = context.auth.uid;
    const db = admin.database();
    const firestore = admin.firestore();

    await db.ref('/matchingStatus').child(uid).set(1);
    let chosenFOF = null; //FOF chosen
    let foundFOF = false; //is FOF found or not (since chosenFOF !== null is not a sufficient condition)
    let viaFriendOrStreamId = null; //Friend via which final fof is chosen

    //GET all friends
    const friendsSnapshot = await db.ref('/friends').child(uid).once('value');

    //GET all subscribed streams
    const streamsubsSnapshot = await db
      .ref('/streamsubs')
      .child(uid)
      .once('value');

    //Check if user does not have friends or streamsubs yet
    if (!friendsSnapshot.exists() && !streamsubsSnapshot.exists()) {
      //TODO Handle on client by changing user matching status to 0
      throw new functions.https.HttpsError(
        'no-friends-and-streamsubs',
        'No friends and stream subscriptions to match from.',
      );
    }

    let friendsAndStreamsIds = Object.keys({
      ...(friendsSnapshot.val() || {}),
      ...(streamsubsSnapshot.val() || {}),
    });

    // for later use during adding users name in every friends waitingList
    let copyOfFriendsAndStreamsIds = Object.keys({
      ...(friendsSnapshot.val() || {}),
      ...(streamsubsSnapshot.val() || {}),
    });

    let [userInterestedIn, userGender] = await Promise.all([
      db.ref('/interestedIn').child(uid).once('value'),
      db.ref('/genders').child(uid).once('value'),
    ]);

    while (friendsAndStreamsIds.length > 0) {
      //select a random friend from friendsIds array
      const randomFriendOrStreamIdIndex = Math.floor(
        Math.random() * friendsAndStreamsIds.length,
      );

      const chosenFriendOrStreamId =
        friendsAndStreamsIds[randomFriendOrStreamIdIndex];

      var query;
      if (userInterestedIn === 'Everyone') {
        query = firestore
          .collection(`waitingUsers`)
          .where('friends', 'array-contains', chosenFriendOrStreamId)
          .where('interestedIn', 'in', [userGender, 'Everyone'])
          .orderBy('timestamp', 'asc')
          .limit(1);
      } else {
        query = firestore
          .collection(`waitingUsers`)
          .where('friends', 'array-contains', chosenFriendOrStreamId)
          .where('gender', '==', userState.interestedIn)
          .where('interestedIn', 'in', [userGender, 'Everyone'])
          .orderBy('timestamp', 'asc')
          .limit(1);
      }
      var skip = false;
      //find a potential match via a transaction
      firestore.runTransaction(async transaction => {
        let chosenFOF = await transaction.get(query);
        if (chosenFOF.empty) {
          skip = true;
          return;
        }
        //check if the chosen fof is in your matches
        let matchesRes = await db
          .ref('/matches')
          .child(uid)
          .child(chosenFOF.docs[0].id)
          .once('value');
        if (matchesRes.exists()) {
          skip = true;
          return;
        }
        //check if the chosen fof is in your friends
        let friendsRes = await db
          .ref('/friends')
          .child(uid)
          .child(chosenFOF.docs[0].id)
          .once('value');
        if (friendsRes.exists()) {
          skip = true;
          return;
        }
      });
      if (skip) {
        friendsAndStreamsIds.splice(randomFriendOrStreamIdIndex, 1);
        continue;
      } else break;
    }

    //change the data structure of chosenFOF to {id, gender, timestamp, interestedIn}
    chosenFOF = {
      ...chosenFOF.docs[0].data(),
      id: chosenFOF.docs[0].id,
    };
    foundFOF = true;
    viaFriendOrStreamId = chosenFriendOrStreamId;
    break;

    //make an anonymous chat room with the chosenFOF and change the matching status
    if (foundFOF) {
      await firestore.collection('waitingUsers').doc(chosenFOF.id).delete();

      //Add in chat rooms
      await Promise.all([
        db.ref('/chatRooms').child(uid).set(chosenFOF.id),
        db.ref('/chatRooms').child(chosenFOF.id).set(uid),
      ]);

      var viaType = 'friend';
      //get the name of via friend
      var viaFriendOrStreamName = await db
        .ref('/users')
        .child(viaFriendOrStreamId)
        .child('name')
        .once('value');
      if (!viaFriendOrStreamName.exists()) {
        viaFriendOrStreamName = await db
          .ref('/streams')
          .child(viaFriendOrStreamId)
          .child('name')
          .once('value');

        viaType = 'stream';
      }

      viaFriendOrStreamName = viaFriendOrStreamName.val();

      //Fetch the name and dp of chat room partner if via stream
      [FOFName, FOFDp] = await Promise.all([
        viaType === 'stream'
          ? db.ref('/users').child(chosenFOF.id).child('name').once('value')
          : null,
        viaType === 'stream'
          ? storage().ref(`/profiles/${chosenFOF.id}/0`).getDownloadURL()
          : null,
      ]);

      FOFName = FOFName?.val();
      //FOFDp is a string returned from storage

      chosenFOF = {...chosenFOF, name: FOFName, dp: FOFDp};

      //Add in via
      await Promise.all([
        db.ref('/via').child(uid).set({id: viaFriendOrStreamId, type: viaType}),
        db
          .ref('/via')
          .child(chosenFOF.id)
          .set({id: viaFriendOrStreamId, type: viaType}),
      ]);

      //get the age of FOF
      let FOFbd = await db
        .ref('/users')
        .child(chosenFOF.id)
        .child('bd')
        .once('value');
      FOFbd = FOFbd.val();

      chosenFOF['age'] = bdToAge(FOFbd);

      //check if partner is nonbinary
      let FOFNonBinary = await db
        .ref('/nonBinary')
        .child(chosenFOF.id)
        .once('value');

      if (FOFNonBinary.exists()) {
        FOFNonBinary = FOFNonBinary.val();
        chosenFOF['nonBinary'] = FOFNonBinary;
      }

      //change Matching Status of both the users
      await Promise.all([
        db.ref('/matchingStatus').child(uid).set(2),
        db.ref('/matchingStatus').child(chosenFOF.id).set(2),
      ]);
    } else {
      //push current user to waiting users
      await firestore.collection(`waitingUsers`).doc(uid).set({
        gender: userState.gender,
        interestedIn: userState.interestedIn,
        timestamp: firestore.FieldValue.serverTimestamp(),
        friends: copyOfFriendsAndStreamsIds,
      });
    }

    return {
      via: {
        name: viaFriendOrStreamName,
        id: viaFriendOrStreamId,
        type: viaType,
      },
      FOF: chosenFOF,
    };
  });
