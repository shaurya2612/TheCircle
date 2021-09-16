import {PermissionsAndroid} from 'react-native';

export const CLEAR_REDUX_STATE = 'CLEAR_REDUX_STATE';

export const bdToAge = DOB => {
  var today = new Date();
  var birthDate = new Date(DOB);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age = age - 1;
  }

  return age;
};

export const getFacebookUid = currentUser => {
  let fbProviderData = currentUser.providerData.filter(
    provider => provider.providerId === 'facebook.com',
  );
  if (fbProviderData.length == 0) return null;
  else return fbProviderData[0]['uid'];
};
