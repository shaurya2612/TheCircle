const functions = require('firebase-functions');

// The Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp();
const ASIA_SOUTH1 = 'asia-south1';
const STORAGE_BUCKET_NAME = 'gs://thecircle-native.appspot.com';
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
        'unauthenticated',
        'Endpoint requires authentication.',
      );
    }
    try {
      const uid = context.auth.uid;
      const db = admin.database();
      const firestore = admin.firestore();

      await db.ref('/matchingStatus').child(uid).set(1);
      var chosenFOF = null; //FOF chosen
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
        throw new functions.https.HttpsError(
          'failed-precondition',
          'No friends or stream subscriptions to match from.',
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

      userInterestedIn = userInterestedIn.val();
      userGender = userGender.val();

      while (friendsAndStreamsIds.length > 0) {
        //select a random friend from friendsIds array
        const randomFriendOrStreamIdIndex = Math.floor(
          Math.random() * friendsAndStreamsIds.length,
        );

        var chosenFriendOrStreamId =
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
            .where('gender', '==', userInterestedIn)
            .where('interestedIn', 'in', [userGender, 'Everyone'])
            .orderBy('timestamp', 'asc')
            .limit(1);
        }

        var skip = false;
        //find a potential match via a transaction
        await firestore.runTransaction(async transaction => {
          chosenFOF = await transaction.get(query);
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
          transaction.delete(
            firestore.collection('waitingUsers').doc(chosenFOF.docs[0].id),
          );
        });
        if (skip) {
          friendsAndStreamsIds.splice(randomFriendOrStreamIdIndex, 1);
          continue;
        } else {
          foundFOF = true;
          break;
        }
      }
      //make an anonymous chat room with the chosenFOF and change the matching status
      if (foundFOF && chosenFOF !== null) {
        //change the data structure of chosenFOF to {id, gender, timestamp, interestedIn}
        chosenFOF = {
          ...chosenFOF.docs[0].data(),
          id: chosenFOF.docs[0].id,
        };

        viaFriendOrStreamId = chosenFriendOrStreamId;
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
        let [FOFName, FOFDp] = await Promise.all([
          viaType === 'stream'
            ? db.ref('/users').child(chosenFOF.id).child('name').once('value')
            : null,
          viaType === 'stream'
            ? admin
                .storage()
                .bucket(STORAGE_BUCKET_NAME)
                .file(`/profiles/${chosenFOF.id}/0`)
                .getSignedUrl({action: 'read', expires: '03-09-2491'})
            : null,
        ]);

        FOFName = FOFName?.val();
        FOFDp = FOFDp[0];

        chosenFOF = {...chosenFOF, name: FOFName, dp: FOFDp};

        //Add in via
        await Promise.all([
          db
            .ref('/via')
            .child(uid)
            .set({id: viaFriendOrStreamId, type: viaType}),
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

        const bdToAge = DOB => {
          var today = new Date();
          var birthDate = new Date(DOB);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
          }

          return age;
        };

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

        let tokenDocs = await Promise.all([
          firestore.collection('tokens').doc(uid).get(),
          firestore.collection('tokens').doc(chosenFOF.id).get(),
        ]);
        let tokens = tokenDocs.map(tokenDoc => tokenDoc.data().token);

        const payload = {
          notification: {
            title: 'We found someone 😍',
            body: `New chat room created!`,
          },
        };

        await admin.messaging().sendToDevice(tokens, payload);
      } else {
        //push current user to waiting users
        await firestore.collection(`waitingUsers`).doc(uid).set({
          gender: userGender,
          interestedIn: userInterestedIn,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
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
    } catch (err) {
      //Unknown error
      if (err.code === 'internal') {
        functions.logger.error(err.stack);
        throw new functions.https.HttpsError(
          'internal',
          'Internal server error',
        );
      }
      //Known error (not internal probably client's fault)
      else throw new functions.https.HttpsError(err.code, err.message);
    }
  });

exports.deleteUser = functions
  .region(ASIA_SOUTH1)
  .https.onCall(async (data, context) => {
    //User is not authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Endpoint requires authentication.',
      );
    }

    try {
      const uid = context.auth.uid;
      const db = admin.database();
      const firestore = admin.firestore();
      const auth = admin.auth();
      const storage = admin.storage();
      //deleting fcm token
      await firestore.collection('tokens').doc(uid).delete();

      //delete main nodes
      db.ref('/users').child(uid).remove();
      db.ref('/genders').child(uid).remove();
      db.ref('/interestedIn').child(uid).remove();
      db.ref('/stats').child(uid).remove();
      db.ref('/profiles').child(uid).remove();
      db.ref('/isOnline').child(uid).remove();
      let username = await db
        .ref('/usernames')
        .orderByValue()
        .equalTo(uid)
        .once('value');
      username = Object.keys(username.val())[0];
      db.ref('/usernames').child(username).remove();
      db.ref('/matchingStatus').child(uid).remove();
      await storage
        .bucket(STORAGE_BUCKET_NAME)
        .deleteFiles({prefix: `profiles/${uid}/`});

      //delete requests
      await db.ref('/requests').child(uid).remove();

      //delete friends
      const friends = await db.ref('/friends').child(uid).once('value');
      if (friends.exists()) {
        const friendKeys = Object.keys(friends.val());

        for (var i = 0; i < friendKeys.length; i++) {
          try {
            //unfriend
            await Promise.all([
              db.ref('/friends').child(uid).child(friendKeys[i]).remove(),
              db.ref('/friends').child(friendKeys[i]).child(uid).remove(),
            ]);
          } catch (err) {
            //handled so loop doesn't break
          }
        }
      }
      //Leave all streams
      const streamsubs = await db.ref('/streamsubs').child(uid).once('value');
      if (streamsubs.exists()) {
        const streamIds = Object.keys(streamsubs.val());
        for (var i = 0; i < streamIds.length; i++) {
          try {
            await db.ref('/streamsubs').child(uid).child(streamIds[i]).remove();
            await db
              .ref('/streams')
              .child(streamIds[i])
              .child('members')
              .transaction(currentMembers => {
                if (currentMembers === null) return 0;
                else return currentMembers - 1;
              });
          } catch (err) {
            //handled so loop doesn't break
          }
        }
      }

      //delete cue cards
      await firestore.collection('cueCards').doc(uid).delete();

      //delete matches
      const matches = await db.ref('/matches').child(uid).once('value');
      if (matches.exists()) {
        const matchKeys = Object.keys(matches.val());
        for (var i = 0; i < matchKeys.length; i++) {
          //unmatch
          const refString =
            uid < matchKeys[i]
              ? uid + '@' + matchKeys[i]
              : matchKeys[i] + '@' + uid;
          await Promise.all([
            db.ref('/matches').child(uid).child(matchKeys[i]).remove(),
            db.ref('/matches').child(matchKeys[i]).child(uid).remove(),
            db.ref('/messages').child(refString).remove(),
          ]);
          try {
            await storage
              .bucket(STORAGE_BUCKET_NAME)
              .file(`/messages/${refString}`)
              .delete();
          } catch (err) {
            //Prevent unhandled promise rejection
          }
        }
      }
      await auth.deleteUser(uid);
    } catch (err) {
      //Unknown error
      if (err.code === 'internal') {
        functions.logger.error(err.stack);
        throw new functions.https.HttpsError(
          'internal',
          'Internal server error',
        );
      }
      //Known error (not internal probably client's fault)
      else throw new functions.https.HttpsError(err.code, err.message);
    }
  });

exports.onMatchAdded = functions
  .region(ASIA_SOUTH1)
  .database.ref('/matches/{uid}')
  .onCreate(async (snapshot, context) => {
    try {
      const uid = context.params.uid;

      const db = admin.database();
      const firestore = admin.firestore();
      const messaging = admin.messaging();
      await db
        .ref('/stats')
        .child(uid)
        .child('matches')
        .transaction(currentMatches => currentMatches + 1);

      let tokenDoc = await firestore.collection('tokens').doc(uid).get();
      let token = tokenDoc.data().token;

      const payload = {
        notification: {
          title: 'You have a new match!',
          body: `Open to find out who it is`,
        },
      };

      await messaging.sendToDevice(token, payload);
    } catch (err) {
      //Unknown error
      if (err.code === 'internal') {
        functions.logger.error(err.stack);
        throw new functions.https.HttpsError(
          'internal',
          'Internal server error',
        );
      }
      //Known error (not internal probably client's fault)
      else throw new functions.https.HttpsError(err.code, err.message);
    }
  });

exports.onUnmatch = functions
  .region(ASIA_SOUTH1)
  .database.ref('/matches/{uid}')
  .onDelete(async (snapshot, context) => {
    try {
      const uid = context.params.uid;

      const db = admin.database();
      await db
        .ref('/stats')
        .child(uid)
        .child('matches')
        .transaction(currentMatches => currentMatches - 1);
    } catch (err) {
      //Unknown error
      if (err.code === 'internal') {
        functions.logger.error(err.stack);
        throw new functions.https.HttpsError(
          'internal',
          'Internal server error',
        );
      }
      //Known error (not internal probably client's fault)
      else throw new functions.https.HttpsError(err.code, err.message);
    }
  });

exports.onFriendRequestAdded = functions
  .region(ASIA_SOUTH1)
  .database.ref('/requests/{uid}')
  .onCreate(async (snapshot, context) => {
    try {
      const uid = context.params.uid;
      const firestore = admin.firestore();
      const messaging = admin.messaging();

      let tokenDoc = await firestore.collection('tokens').doc(uid).get();
      let token = tokenDoc.data().token;

      const payload = {
        notification: {
          title: 'New friend request',
          body: `Someone sent you a friend request`,
        },
      };

      await messaging.sendToDevice(token, payload);
    } catch (err) {
      //Unknown error
      if (err.code === 'internal') {
        functions.logger.error(err.stack);
        throw new functions.https.HttpsError(
          'internal',
          'Internal server error',
        );
      }
      //Known error (not internal probably client's fault)
      else throw new functions.https.HttpsError(err.code, err.message);
    }
  });

exports.onFriendAdded = functions
  .region(ASIA_SOUTH1)
  .database.ref('/friend/{uid}')
  .onCreate(async (snapshot, context) => {
    try {
      const uid = context.params.uid;

      const db = admin.database();
      await db
        .ref('/stats')
        .child(uid)
        .child('friends')
        .transaction(currentFriends => currentFriends + 1);
    } catch (err) {
      //Unknown error
      if (err.code === 'internal') {
        functions.logger.error(err.stack);
        throw new functions.https.HttpsError(
          'internal',
          'Internal server error',
        );
      }
      //Known error (not internal probably client's fault)
      else throw new functions.https.HttpsError(err.code, err.message);
    }
  });

exports.onUnfriend = functions
  .region(ASIA_SOUTH1)
  .database.ref('/friends/{uid}')
  .onDelete(async (snapshot, context) => {
    try {
      const uid = context.params.uid;

      const db = admin.database();
      await db
        .ref('/stats')
        .child(uid)
        .child('friends')
        .transaction(currentFriends => currentFriends - 1);
    } catch (err) {
      //Unknown error
      if (err.code === 'internal') {
        functions.logger.error(err.stack);
        throw new functions.https.HttpsError(
          'internal',
          'Internal server error',
        );
      }
      //Known error (not internal probably client's fault)
      else throw new functions.https.HttpsError(err.code, err.message);
    }
  });
