import { CLEAR_REDUX_STATE } from "../../utils";
import {
  ADD_MESSAGE_IN_CHAT_ROOM,
  LISTEN_FOR_ANONYMOUS_CHAT_ROOM,
  REMOVE_CHAT_ROOM,
  SET_CHAT_ROOM,
  SET_FOF_CUE_CARDS,
  SET_IS_FOF_ONLINE,
  SET_IS_FOF_TYPING,
  SET_USER_MATCHING_STATUS,
} from "../actions/matching";

const initialState = {
  matchingStatus: null,
  FOF: null,
  viaFriend: null,
  listeningForUserMatchingStatus: false,
  messages: null,
  FOFCueCards: null,
  isFOFOnline: null,
  isFOFTyping: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_USER_MATCHING_STATUS:
      return {
        ...state,
        matchingStatus: payload,
        listeningForUserMatchingStatus: true,
      };

    case SET_CHAT_ROOM:
      return {
        ...state,
        FOF: payload.FOF,
        viaFriend: payload.viaFriend,
      };

    case SET_IS_FOF_ONLINE:
      return {
        ...state,
        isFOFOnline: payload,
      };

    case SET_IS_FOF_TYPING:
      return {
        ...state,
        isFOFTyping: payload,
      };

    case SET_FOF_CUE_CARDS:
      return {
        ...state,
        FOFCueCards: payload,
      };

    case ADD_MESSAGE_IN_CHAT_ROOM:
      return {
        ...state,
        messages: [payload, ...(state.messages || [])],
      };

    case REMOVE_CHAT_ROOM:
      return {
        ...state,
        FOF: null,
        viaFriend: null,
        messages: null,
        isFOFOnline: null,
        isFOFTyping: null,
      };

    case CLEAR_REDUX_STATE:
      return initialState;

    default:
      return state;
  }
};
