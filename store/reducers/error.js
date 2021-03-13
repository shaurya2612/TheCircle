import { CLEAR_REDUX_STATE } from "../../utils";
import { CLEAR_ERROR_MESSAGE, SET_ERROR_MESSAGE } from "../actions/error";

const initialState = {
  errorMessage: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ERROR_MESSAGE:
      return { ...state, errorMessage: payload };
    case CLEAR_ERROR_MESSAGE:
      return initialState;
    case CLEAR_REDUX_STATE:
      return initialState;
    default:
      return state;
  }
};
