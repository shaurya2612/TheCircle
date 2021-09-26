export const SET_FACEBOOK_RECOMMENDATIONS = 'SET_FACEBOOK_RECOMMENDATIONS';

export const setFacebookRecommendations = recommendations => {
  return {type: SET_FACEBOOK_RECOMMENDATIONS, payload: recommendations};
};
