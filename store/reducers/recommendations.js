import {CLEAR_REDUX_STATE} from '../../utils';
import {SET_FACEBOOK_RECOMMENDATIONS} from '../actions/recommendations';

const initialState = {
  facebook: null,
  contacts: null,
};

export default (state = initialState, action) => {
  let {type, payload} = action;
  switch (type) {
    case SET_FACEBOOK_RECOMMENDATIONS:
      return {...state, facebook: payload};

    case CLEAR_REDUX_STATE:
      return initialState;

    default:
      return state;
  }
};
