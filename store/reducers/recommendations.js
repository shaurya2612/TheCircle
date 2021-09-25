import {CLEAR_REDUX_STATE} from '../../utils';

const initialState = {
  facebook: null,
  contacts: null,
};

export default (state = initialState, action) => {
  let {type, payload} = action;
  switch (type) {
    case CLEAR_REDUX_STATE:
      return initialState;

    default:
      return state;
  }
};
