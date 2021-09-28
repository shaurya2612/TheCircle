import {Alert} from 'react-native';

export const FCMMessageHandler = remoteMessage => {
  console.warn(remoteMessage);
  return {type: 'none', payload: {}};
};
