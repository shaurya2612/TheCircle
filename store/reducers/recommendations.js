import {CLEAR_REDUX_STATE} from '../../utils';
import {SET_FACEBOOK_RECOMMENDATIONS} from '../actions/recommendations';
import {SET_RELATION} from '../actions/user';

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

    case SET_RELATION:
      let {uid, relation} = payload;
      let newFacebookByIds = state.facebook.byIds;
      if (newFacebookByIds?.[uid]) {
        newFacebookByIds[uid].status = relation;
      }
      console.warn('changing rec', uid, relation);
      let newContactsByIds = state.contacts.byIds;
      if (newContactsByIds?.[uid]) {
        newContactsByIds[uid].status = relation;
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
