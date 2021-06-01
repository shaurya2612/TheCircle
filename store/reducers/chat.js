import {
  ADD_EARLIER_MESSAGES_IN_CHAT,
  ADD_MULTIPLE_MESSAGES_IN_CHAT,
  ADD_MESSAGE_IN_CHAT,
  CLEAR_CHAT_STATE,
  SET_LISTENING_FOR_CHAT,
  SET_MATCH,
  SET_CAN_LOAD_EARLIER_MESSAGES,
  SET_MATCH_CUE_CARDS,
  SET_IS_MATCH_ONLINE,
  SET_IS_MATCH_TYPING,
} from '../actions/chat';
import {CLEAR_REDUX_STATE} from '../../utils';

const initialState = {
  match: null,
  messages: null,
  listeningForChat: false,
  canLoadEarlierMessages: false,
  matchCueCards: null,
  isMatchOnline: null,
  isMatchTyping: null,
};

export default (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_LISTENING_FOR_CHAT:
      return {
        ...state,
        listeningForChat: payload,
      };

    case ADD_MESSAGE_IN_CHAT:
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

    case SET_MATCH:
      return {
        ...state,
        match: payload,
      };

    case SET_CAN_LOAD_EARLIER_MESSAGES:
      return {
        ...state,
        canLoadEarlierMessages: payload,
      };

    case SET_IS_MATCH_ONLINE:
      return {
        ...state,
        isMatchOnline: payload,
      };

    case SET_IS_MATCH_TYPING:
      return {
        ...state,
        isMatchTyping: payload,
      };

    case ADD_MULTIPLE_MESSAGES_IN_CHAT:
      return {
        ...state,
        messages: [...payload, ...(state.messages || [])],
      };

    case ADD_EARLIER_MESSAGES_IN_CHAT:
      return {
        ...state,
        messages: [...(state.messages || []), ...payload],
      };

    case SET_MATCH_CUE_CARDS:
      return {
        ...state,
        matchCueCards: payload,
      };

    case CLEAR_CHAT_STATE:
      return initialState;

    case CLEAR_REDUX_STATE:
      return initialState;

    default:
      return state;
  }
};
