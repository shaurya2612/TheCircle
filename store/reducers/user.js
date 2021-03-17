import { bdToAge, CLEAR_REDUX_STATE } from "../../utils";
import {
  CLEAR_USER_STATE,
  UPDATE_ABOUT,
  SET_USER,
  SET_USER_PHOTOS,
  SET_USER_PROFILE,
  SET_USER_STATE,
  SET_DP,
  UPDATE_PROFILE_INFO,
  ADD_REQUEST,
  REMOVE_REQUEST,
  ADD_FRIEND,
  REMOVE_FRIEND,
  SET_LISTENING_FOR_FRIENDS,
  ADD_MATCH,
  REMOVE_MATCH,
  SET_LISTENING_FOR_MATCHES,
  UPDATE_MATCH,
  REMOVE_UNSEEN,
  SET_FETCHED_MATCH_PROFILE,
  SET_CURRENT_MATCH_PROFILE,
  UPDATE_INTERESTED_IN,
  SET_CUE_CARDS,
  ADD_CUE_CARD,
  UPDATE_CUE_CARD,
  REMOVE_CUE_CARD,
} from "../actions/user";
import database from "@react-native-firebase/database";
import storage from "@react-native-firebase/storage";

const initialState = {
  bd: null,
  age: null,
  dp: null,
  name: null,
  phone: null,
  userPhotos: null,
  userPhotosUpdated: false,
  profile: null,
  profileUpdated: false,
  gender: null,
  username: null,
  cueCards: null,
  requests: null,
  listeningForRequests: false,
  friends: null,
  listeningForFriends: false,
  matches: null,
  listeningForMatches: false,
  currentMatchProfile: null,
  fetchedMatchProfile: false,
  isAuthenticated: false,
};

export default (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case SET_USER_STATE:
      return payload;

    case CLEAR_USER_STATE:
      return initialState;

    case SET_USER:
      return { ...state, ...payload, age: bdToAge(payload.bd) };

    case SET_DP:
      return { ...state, dp: payload };

    case SET_USER_PHOTOS:
      return { ...state, userPhotos: payload, userPhotosUpdated: true };

    case SET_USER_PROFILE:
      return { ...state, profile: payload, profileUpdated: true };

    case SET_CUE_CARDS:
      return { ...state, cueCards: payload };

    case ADD_CUE_CARD:
      return { ...state, cueCards: [...(state.cueCards || []), payload] };

    case UPDATE_CUE_CARD:
      let updatedCueCards = state.cueCards;
      updatedCueCards[payload.index]["ans"] = payload.newAns;
      return {
        ...state,
        cueCards: updatedCueCards,
      };

    case REMOVE_CUE_CARD:
      let tempCueCards = state.cueCards;
      tempCueCards.splice(payload, 1);
      return {
        ...state,
        cueCards: tempCueCards,
      };

    case UPDATE_ABOUT:
      return { ...state, profile: { ...state.profile, about: payload } };

    case UPDATE_PROFILE_INFO:
      let updatedProfile = state.profile ? state.profile : {};

      //User cleared the action.key field in info
      if (payload === null) {
        if (updatedProfile?.info?.[action.key])
          delete updatedProfile["info"][action.key];
      } else {
        if (!updatedProfile["info"]) updatedProfile["info"] = {};
        updatedProfile["info"][action.key] = payload;
      }

      return { ...state, profile: updatedProfile };

    case UPDATE_INTERESTED_IN:
      return { ...state, interestedIn: payload };

    case ADD_REQUEST:
      return {
        ...state,
        requests: [...(state.requests || []), payload],
        listeningForRequests: true,
      };

    case REMOVE_REQUEST:
      return {
        ...state,
        requests: (state.requests || []).filter((obj) => obj.id !== payload),
        listeningForRequests: true,
      };

    case ADD_FRIEND:
      return {
        ...state,
        friends: [...(state.friends || []), payload],
        listeningForFriends: true,
      };

    case REMOVE_FRIEND:
      return {
        ...state,
        friends: (state.friends || []).filter((obj) => obj.id !== payload),
        listeningForFriends: true,
      };

    case ADD_MATCH:
      return {
        ...state,
        matches: [payload, ...(state.matches || [])],
        listeningForMatches: true,
      };

    case UPDATE_MATCH:
      let obj = (state.matches || []).filter((obj) => obj.id === payload.id)[0];

      //the match is already fetched and is on the screen
      if (obj)
        return {
          ...state,
          matches: [
            {
              ...obj,
              ...payload,
              unseen: payload.updateUnseen
                ? obj.unseen
                  ? obj.unseen + 1
                  : 1
                : obj.unseen,
            },
            ...(state.matches || []).filter((obj) => obj.id !== payload.id),
          ],
          listeningForMatches: true,
        };
      //need to fetch the match list item  *TODO rfc
      else {
        const fetchMatchListItem = async () => {
          const db = database();

          let [name, dp] = await Promise.all([
            db.ref("/users").child(payload.id).child("name").once("value"),

            storage()
              .ref("/profiles")
              .child(payload.id)
              .child("0")
              .getDownloadURL(),
          ]);
          return {
            name: name.val(),
            id: payload.id,
            lastMessage: payload.lastMessage,
            dp,
          };
        };
        let newObj = fetchMatchListItem();
        return {
          ...state,
          matches: [newObj, ...(state.matches || [])],
          listeningForMatches: true,
        };
      }

    case SET_FETCHED_MATCH_PROFILE:
      return {
        ...state,
        fetchedMatchProfile: payload,
      };

    case SET_CURRENT_MATCH_PROFILE:
      return {
        ...state,
        currentMatchProfile: payload,
      };

    case REMOVE_UNSEEN:
      return {
        ...state,
        matches: (state.matches || []).map((obj) => {
          if (obj.id === payload) {
            obj.unseen = null;
          }
          return obj;
        }),
      };

    case REMOVE_MATCH:
      return {
        ...state,
        matches: (state.matches || []).filter((obj) => obj.id !== payload),
        listeningForMatches: true,
      };

    case SET_LISTENING_FOR_MATCHES:
      return {
        ...state,
        listeningForMatches: payload,
      };

    case SET_LISTENING_FOR_FRIENDS:
      return {
        ...state,
        listeningForFriends: payload,
      };

    case CLEAR_REDUX_STATE:
      return initialState;

    default:
      return state;
  }
};
