import {CLEAR_REDUX_STATE} from '../../utils';
import {FETCH_ALL_STREAMS} from '../actions/streams';

const initialState = {
  streams: null,
};
export default (state = initialState, action) => {
  let {type, payload} = action;

  switch (type) {
    case FETCH_ALL_STREAMS:
      return {...state, streams: payload};

    case CLEAR_REDUX_STATE:
      return initialState;

    default:
      return state;
  }
};
