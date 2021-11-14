import {Alert} from 'react-native';
import {setRelation} from './user';

// {"sentTime":1632854074433,"data":{"type":"relation","senderId":"nhkoNyu5MaP3oV7AcdySqazYi3a2","status":"USER_RECEIVED_REQUEST"},"messageId":"0:1632854074452499%db043a62f9fd7ecd","ttl":2419200,"from":"227255097562"}

export const FCMMessageHandler = remoteMessage => {
  return async (dispatch, getState) => {
    console.warn('datmessage', remoteMessage);
    let data = remoteMessage.data;
    if (data) {
      console.warn('data', data);
      switch (data.type) {
        case 'relation':
          let {senderId, status} = data;
          dispatch(setRelation(senderId, status));
          return;
        default:
          return;
      }
    }
  };
};
