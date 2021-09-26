import {combineReducers} from 'redux';
import photoGridReducer from './photoGrid';
import signupFormReducer from './signupForm';
import userReducer from './user';
import loadingReducer from './loading';
import errorReducer from './error';
import matchingReducer from './matching';
import chatReducer from './chat';
import streams from './streams';
import recommendations from './recommendations';
const reducers = {
  signupForm: signupFormReducer,
  photoGrid: photoGridReducer,
  user: userReducer,
  recommendations: recommendations,
  streams: streams,
  matching: matchingReducer,
  chat: chatReducer,
  loading: loadingReducer,
  error: errorReducer,
};

const allReducers = combineReducers(reducers);
export default allReducers;
