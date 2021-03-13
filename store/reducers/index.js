import { combineReducers } from "redux";
import photoGridReducer from "./photoGrid";
import signupFormReducer from "./signupForm";
import userReducer from "./user";
import loadingReducer from "./loading";
import errorReducer from "./error";
import matchingReducer from "./matching";
import chatReducer from "./chat";
const reducers = {
  signupForm: signupFormReducer,
  photoGrid: photoGridReducer,
  user: userReducer,
  matching: matchingReducer,
  chat: chatReducer,
  loading: loadingReducer,
  error: errorReducer,
};

const allReducers = combineReducers(reducers);
export default allReducers;
