import database from '@react-native-firebase/database';
import {setErrorMessage} from './error';

export const FETCH_ALL_STREAMS = 'FETCH_ALL_STREAMS';

export const fetchAllStreams = () => {
  return async (dispatch, getState) => {
    try {
      const db = database();
      let streams = await db.ref('/streams').once('value');
      streams = streams.val();
      //Converting fetched object to array
      let streamsArr = Object.keys(streams).map(streamId => {
        return {streamId, ...streams[streamId]};
      });
      dispatch({type: FETCH_ALL_STREAMS, payload: streamsArr});
    } catch (err) {
      dispatch(setErrorMessage(err));
    }
  };
};
