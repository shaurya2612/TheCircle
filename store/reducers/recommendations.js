import {CLEAR_REDUX_STATE} from '../../utils';
import {
  SET_FACEBOOK_RECOMMENDATIONS,
  SET_RECOMMENDATION_STATUS,
} from '../actions/recommendations';

const initialState = {
  facebook: {
    byIds: null,
    allIds: null,
  },
  contacts: {
    byIds: null,
    allIds: null,
  },
};

export default (state = initialState, action) => {
  let {type, payload} = action;
  switch (type) {
    case SET_FACEBOOK_RECOMMENDATIONS:
      let {byIds, allIds} = payload;
      return {...state, facebook: {byIds, allIds}};

    case SET_RECOMMENDATION_STATUS:
      let {uid, status} = payload;
      let newFacebookByIds = state.facebook.byIds;
      if (newFacebookByIds?.[uid]) {
        newFacebookByIds[uid].status = status;
      }

      let newContactsByIds = state.contacts.byIds;
      if (newContactsByIds?.[uid]) {
        newContactsByIds[uid].status = status;
      }
      return {
        ...state,
        facebook: {byIds: newFacebookByIds, allIds: state.facebook.allIds},
        contacts: {byIds: newContactsByIds, allIds: state.contacts.allIds},
      };

    case CLEAR_REDUX_STATE:
      return initialState;

    default:
      return state;
  }
};
