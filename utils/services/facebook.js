import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk-next';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {checkRelation, db} from '../../firebase/util';
import {getFacebookUid} from '..';

export const fetchFacebookFriends = () => {
  //Only fetches friends of users that are using the app
  return new Promise((resolve, reject) => {
    const facebookUid = getFacebookUid(auth().currentUser);
    const facebookFriendsReq = new GraphRequest(
      `/${facebookUid}/friends`,
      null,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    new GraphRequestManager().addRequest(facebookFriendsReq).start();
  });
};

export const fetchFacebookRecommendations = () => {
  return new Promise((resolve, reject) => {
    fetchFacebookFriends()
      .then(res => {
        let data = res.data;

        return Promise.all(
          data.map(obj => {
            return db
              .ref('facebookUids')
              .child(obj.id)
              .once('value')
              .then(uid => {
                uid = uid.val();
                let [name, username, dp, status] = [
                  db.ref('/users').child(uid).child('name').once('value'),
                  db
                    .ref('/usernames')
                    .orderByValue()
                    .equalTo(uid)
                    .limitToFirst(1)
                    .once('value'),

                  storage()
                    .ref('/profiles')
                    .child(uid)
                    .child('0')
                    .getDownloadURL(),

                  checkRelation(auth().currentUser.uid, uid),
                ];

                return Promise.all([name, username, dp, status, uid]);
              })
              .then(([name, username, dp, status, uid]) => {
                console.warn('apap', status);
                return {
                  name: name.val(),
                  username: Object.keys(username.val())[0],
                  status,
                  dp,
                  uid,
                };
              });
          }),
        );
      })
      .then(recommendations => {
        resolve(recommendations);
      })
      .catch(err => {
        reject(err);
      });
  });
};