export const SET_LOADING_STATE = "SET_LOADING_STATE";
export const START_APP_LOADING = "START_APP_LOADING";
export const STOP_APP_LOADING = "STOP_APP_LOADING";
export const SET_SIGNING_UP = "SET_SIGNING_UP";
export const SET_SEARCHING_FOR_FRIENDS = "SET_SEARCHING_FOR_FRIENDS";
export const SET_LOADING_AD = "SET_LOADING_AD";

export const setLoadingState = (payload) => {
  return { type: SET_LOADING_STATE, payload };
};

export const startAppLoading = () => {
  return { type: START_APP_LOADING };
};

export const setLoadingAd = (payload) => {
  return {type: SET_LOADING_AD, payload}
}

export const setSigningUp = (payload) => {
  return { type: SET_SIGNING_UP, payload };
};

export const setSearchingForFriends = (payload) => {
  return { type: SET_SEARCHING_FOR_FRIENDS, payload };
};

export const stopAppLoading = () => {
  return { type: STOP_APP_LOADING };
};
