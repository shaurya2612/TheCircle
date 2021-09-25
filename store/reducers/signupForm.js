import {CLEAR_REDUX_STATE} from '../../utils';
import {SET_FORM_DATA, CLEAR_FORM_DATA} from '../actions/signupForm';

const initialState = {
  phoneNumber: '',
  name: '',
  birthDate: {
    dd: '',
    mm: '',
    yyyy: '',
  },
  username: '',
  password: '',
  gender: '',
  interestedIn: '',
  nonBinary: '',
  userPhotos: [null, null, null, null, null, null],
};

export default (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_FORM_DATA:
      return payload;
    case CLEAR_FORM_DATA:
      return initialState;
    case CLEAR_REDUX_STATE:
      return initialState;
    default:
      return state;
  }
};
