import { CLEAR_REDUX_STATE } from "../../utils";
import {
  SET_LOADING_STATE,
  STOP_APP_LOADING,
  START_APP_LOADING,
  SET_SIGNING_UP,
  SET_SEARCHING_FOR_FRIENDS,
} from "../actions/loading";

const initialState = {
  appLoading: true,
  SignupUsernameScreen: {
    fetchingUsername: false,
  },
  signingUp: false,
  searchingForFriends: false,
  fetchingFriends: false,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADING_STATE:
      return payload;
    case START_APP_LOADING:
      return { ...state, appLoading: true };
    case STOP_APP_LOADING:
      return { ...state, appLoading: false };
    case SET_SIGNING_UP:
      return { ...state, signingUp: payload };
    case SET_SEARCHING_FOR_FRIENDS:
      return { ...state, searchingForFriends: payload };
    case CLEAR_REDUX_STATE:
      return initialState;
    default:
      return state;
  }
};
