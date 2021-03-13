import { CLEAR_REDUX_STATE } from "../../utils";
import { SET_DATA } from "../actions/photoGrid";

const initialState = {
  data: [
    "https://homepages.cae.wisc.edu/~ece533/images/goldhill.png",
    "https://homepages.cae.wisc.edu/~ece533/images/peppers.png",
    "https://homepages.cae.wisc.edu/~ece533/images/mountain.png",
    "https://homepages.cae.wisc.edu/~ece533/images/fprint3.pgm",
    null,
    null,
  ],
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_DATA:
      return { ...state, data: payload };
    case CLEAR_REDUX_STATE:
      return initialState;
    default:
      return state;
  }
};
