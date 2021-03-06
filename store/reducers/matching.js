import {CLEAR_REDUX_STATE} from '../../utils';
import {
  ADD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM,
  ADD_MESSAGE_IN_CHAT_ROOM,
  LISTEN_FOR_ANONYMOUS_CHAT_ROOM,
  REMOVE_CHAT_ROOM,
  SET_CAN_LOAD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM,
  SET_CHAT_ROOM,
  SET_FOF_CUE_CARDS,
  SET_IS_FOF_ONLINE,
  SET_IS_FOF_TYPING,
  SET_LISTENING_FOR_ANONYMOUS_CHAT_ROOM,
  SET_USER_MATCHING_STATUS,
} from '../actions/matching';

const initialState = {
  matchingStatus: null,
  FOF: null,
  via: null,
  listeningForUserMatchingStatus: false,
  messages: null,
  canLoadEarlierMessages: null,
  listeningForAnonymousChatRoom: false,
  FOFCueCards: null,
  isFOFOnline: null,
  isFOFTyping: null,
};

export default (state = initialState, action) => {
  const {type, payload} = action;

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
        via: payload.via,
      };

    case SET_CAN_LOAD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM:
      return {
        ...state,
        canLoadEarlierMessages: payload,
      };

    case ADD_EARLIER_MESSAGES_IN_ANONYMOUS_CHAT_ROOM:
      return {
        ...state,
        messages: [...(state.messages || []), ...payload],
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
      if (
        state.messages.slice(0, 21).filter(item => {
          return item._id == payload._id;
        }).length > 0
      ) {
        return state;
      }
      return {
        ...state,
        messages: [payload, ...(state.messages || [])],
      };

    case SET_LISTENING_FOR_ANONYMOUS_CHAT_ROOM:
      return {
        ...state,
        listeningForAnonymousChatRoom: payload,
      };

    case REMOVE_CHAT_ROOM:
      return {
        ...state,
        FOF: null,
        via: null,
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
